const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const PASSWORD = "danascullyiloveu";
  let body;

  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { pass, action, show, index } = body;

  if (pass !== PASSWORD) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const showsFile = path.join(__dirname, '../../shows.json');
  let currentShows = [];

  try {
    const data = fs.readFileSync(showsFile, 'utf8');
    currentShows = JSON.parse(data);
  } catch (err) {
    console.log('shows.json not found or empty. Creating new.');
  }

  try {
    if (action === 'add' && show) {
      currentShows.push(show);
    } else if (action === 'delete' && typeof index === 'number') {
      currentShows.splice(index, 1);
    } else {
      return { statusCode: 400, body: 'Invalid action or missing data' };
    }

    fs.writeFileSync(showsFile, JSON.stringify(currentShows, null, 2), 'utf8');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', shows: currentShows }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Error updating shows: ' + err.message };
  }
};