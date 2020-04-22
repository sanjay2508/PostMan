const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../DB/models/user');

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            console.log(req);

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
    console.log(req);
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    status: "Auth Failed:User Not found"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                console.log('Password incorrect');
                return res.status(401).json({
                    status: "Auth Failed:Password Incorrect"
                });
            }
            const token = jwt.sign({ name: fetchedUser.name, email: fetchedUser.email },
                'Secret_Key_sanjay',
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                status: "Auth Failed: Due to some error"
            });
        })
})

module.exports = router;