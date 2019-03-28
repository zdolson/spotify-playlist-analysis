const express = require('express');
const cors = require('cors');
const querystring = require('querystring');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const request = require('request');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// CONSTANTS
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3001/callback';

const stateKey = 'spotify_auth_state';
const port = 3001;

// used for generating random state keys
const generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

app.use(cors())
  .use(cookieParser());


// STEP ONE: GET OAUTH CODE
app.get('/login', function(req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  let scope = 'user-read-private user-read-email user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
    })
  );
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
    };
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        console.log('access: ', access_token);
        console.log('refresh: ', refresh_token);

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        // request.get(options, function(error, response, body) {
        //   console.log(body);
        // });

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/auth/' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('http://localhost:3000/err/' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// STEP TWO: SEND OAUTH CODE  => ACCESS + REFRESH TOKENS
// app.get('/api/callback', function(req, res) {
//   let code = req.query.code || null;
//   let state = req.query.state || null;
//   let storedState = req.cookies ? req.cookies[stateKey] : null;
//
//   console.log('got callback');
//   if (state === null || state != storedState){
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       })
//     );
//   } else {
//     res.clearCookie(stateKey);
//     let authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };
//
//     fetch(authOptions.url, {
//       method: 'post',
//       body: JSON.stringify(authOptions.form),
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       }
//     })
//     .then((response) => response.json())
//     .then((json) => console.log(json));
//   }
//
// });

app.listen(port, (err) => {
  if (err) console.error(err);
  console.log('Listening on port ' + port);
})