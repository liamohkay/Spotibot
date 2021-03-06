// Libraries & dependencies
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const request = require('request');
const querystring = require('querystring');
const config = require('./spotifyConfig.js');

// Global vars
const port = 3000;
const stateKey = 'spotify_auth_state';
const { client_id, client_secret, redirect_uri } = config;

// Express server + middleware + controllers
const app = express()
  .use(cors())
  .use(cookieParser())
  .use(morgan('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../client/dist/')))

// Helper function for state serialization
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Login route to auth spotify account
app.get('/login', (req, res) => {
  let scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// Redirect request to serve client token after getting auth code
app.get('/callback', (req, res) => {
  let code = req.query.code || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      json: true,
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
    };

    request.post(authOptions, (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        let access_token = body.access_token;
        let refresh_token = body.refresh_token;
        let options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
a
        // use the access token to access the Spotify Web API
        // request.get(options, (err, resp, body) => console.log(body));
        res.redirect('/#' + querystring.stringify({ access_token, refresh_token }));
      } else {
        res.redirect('/#' + querystring.stringify({ err: 'invalid_token' }));
      }
    });
  }
});

// Refresh token endpoint that allows past users to get a fresh token w/o another oauth
app.get('/refresh_token', (req, res) => {
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    json: true,
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));