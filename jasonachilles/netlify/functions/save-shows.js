const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const password = "danascullyiloveu"; 
  const { pass, action, show, index } = JSON.parse(event.body);

  if (pass !== password) {
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
    if(action === 'add' && show){
      currentShows.push(show);
    } else if(action === 'delete' && typeof index === 'number'){
      currentShows.splice(index,1);
    } else if(action === 'list'){
      // just return current shows
    } else {
      return { statusCode: 400, body: 'Invalid action or missing data' };
    }

    fs.writeFileSync(showsFile, JSON.stringify(currentShows, null, 2), 'utf8');

    return {
      statusCode: 200,
      body: JSON.stringify({ message:'Success', shows: currentShows })
    };
  } catch(err){
    console.error(err);
    return { statusCode: 500, body: 'Error updating shows: '+err.message };
  }
};