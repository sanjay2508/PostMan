const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const googleAuth = require('./routes/googleAuth');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

//app.use(cors({ origin: true, credentials: true }));

mongoose.connect("mongodb+srv://SanjayGangwar:Xperia@7@postbook-yled4.mongodb.net/test?w=majority", { useNewUrlParser: true })
    .then(() => {
        console.log('connected to Database');
    })
    .catch(() => {
        console.log('Error');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //Not used currently but can be used if required

app.use(passport.initialize());

passport.use(
    new GoogleStrategy({
        clientID: "256061973850-b8gg0tulqjofd300g7leks0ckm2kl25m.apps.googleusercontent.com",
        clientSecret: "v1F8f7NebDx9KW0A2NWkN3kq",
        callbackURL: "http://localhost:3000/api/googleAuth/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/googleAuth", googleAuth);

module.exports = app;