const express = require('express');
const nodemailer = require('nodemailer');
var generator = require('generate-password');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const User = require('../DB/models/user');

router.get('/userInfo', checkAuth, (req, res, next) => {
    userId = req.userData.userId;
    User.find({ '_id': userId })
        .then((data => {
            console.log(data);
            res.status(200).json({
                message: 'User Info Fetched Successfully',
                userInfo: data[0]
            });
        })
        )
});
router.get('', (req, res, next) => {
    User.find({}, { email: 1, _id: 0 })
        .then((data => {
            res.status(200).json({
                message: 'Users Fetched Successfully',
                Users: data
            });
        })
        )
});
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

    User.findOneAndUpdate(query, { $push: { friends: req.body.requestFrom }, $pullAll: { friendsRequest: req.body.requestFrom } }, { upsert: true, new: true } & { useFindAndModify: false }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });

});

module.exports = router;