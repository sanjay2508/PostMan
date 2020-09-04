const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const request = require('request');

const router = express.Router();

passport.serializeUser(async function (user, done) {

  const authData = {
    name: user.displayName,
    email: user.emails[0].value,
    password: 'google'
  };

  request({
    url: 'http://localhost:3000/api/auth/signup',
    method: "POST",
    json: true,   // <--Very important!!!
    body: authData
  }, function (error, response, body) {
    console.log(response);
  });

  done(null, user);

});

passport.deserializeUser(function (user, done) {

  done(null, user);
});

router.get('/', passport.authenticate('google', { scope: ['Profile', 'email'] }));

router.get('/callback',
  passport.authenticate('google'),
  function (req, res) {
    res.send('/api/auth/signup');
  });

module.exports = router;
