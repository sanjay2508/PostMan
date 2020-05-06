const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var generator = require('generate-password');

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
            const token = jwt.sign({ name: fetchedUser.name, email: fetchedUser.email, userId: fetchedUser._id },
                'Secret_Key_sanjay',
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userName: fetchedUser.name,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                status: "Auth Failed: Due to some error"
            });
        })
})
router.post("/sendEmail", (req, res, next) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'postbookforyou@gmail.com',
            pass: 'PostBook!1525'
        }
    });

    var password = generator.generate({
        length: 10,
        numbers: true
    });

    console.log(req.body.emailId)

    var mailOptions = {
        from: 'postbookforyou@gmail.com',
        to: req.body.emailId,
        subject: 'New password request from PostBook',
        text: 'Your new password is' + password
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(401).send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({
                status: true,
                Message: "Password Sent Succesfully to" + req.body.emailId
            });
        }
    });
})


module.exports = router;