// hello there. you shouldn't be here. don't be a fuckass and mess with my listings.

const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const password = "danascullyiloveu"; // admin password
  const { pass, shows } = JSON.parse(event.body);

  if (pass !== password) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  // Path to the shows.json file
  const showsFile = path.join(__dirname, '../../shows.json');

  try {
    fs.writeFileSync(showsFile, JSON.stringify(shows, null, 2));
    return { statusCode: 200, body: 'Shows updated successfully' };
  } catch (err) {
    return { statusCode: 500, body: 'Error saving shows: ' + err.message };
  }
};