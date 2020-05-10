const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var generator = require('generate-password');

const router = express.Router();

const User = require('../DB/models/user');

router.get('/users', (req, res, next) => {
    User.find({}, { email: 1, _id: 0 })
        .then((data => {
            res.status(200).json({
                message: 'Users Fetched Successfully',
                Users: data
            });
        })
        )
});

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
                    friends:fetchedUser.friends,
                    friendsRequest:fetchedUser.friendsRequest
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

router.post('/friendRequest', (req, res, next) => {
    var query = { 'email': req.body.requestTo };

    User.findOneAndUpdate(query, { $push: { friendsRequest: req.body.requestFrom } }, { upsert: true, new: true } & { useFindAndModify: false }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });

});
router.post('/acceptFriendRequest', (req, res, next) => {
    var query = { 'email': req.body.requestTo };

    User.findOneAndUpdate(query, { $push: { friends: req.body.requestFrom },$pullAll: { friendsRequest: req.body.requestFrom } }, { upsert: true, new: true } & { useFindAndModify: false }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });

});

module.exports = router;