const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

const User = require('../DB/models/user');

router.post('/signup', (req, res, next) => {
    console.log(req.body.name);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            console.log(user);

            user.save()
                .then(result => {
                    res.status(200).send({
                        status: 'Success'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        });
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).send("Auth Failed:User Not found");
            } else {
                fetchedUser = user;
                return bcrypt.compare(req.body.password, user.password);
            }
        })
        .then(result => {
            if (result === true) {
                const token = jwt.sign({ name: fetchedUser.name, email: fetchedUser.email, userId: fetchedUser._id },
                    'Secret_Key_sanjay',
                    { expiresIn: "1h" }
                );

                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    userName: fetchedUser.name,
                    userId: fetchedUser._id,
                    userEmail: fetchedUser.email,
                    friends: fetchedUser.friends,
                    friendsRequest: fetchedUser.friendsRequest
                });
            } else {
                return res.status(401).send("Auth Failed:Password Incorrect");
            }
        })
        .catch((err) => {
            console.log(err);
            /* return res.status(500).json({
                status: "Auth Failed: Due to some error"
            }); */
        })
})

module.exports = router;