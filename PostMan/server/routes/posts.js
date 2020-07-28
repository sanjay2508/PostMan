const express = require('express');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const PostModel = require('../DB/models/post');

router.get('', (req, res, next) => {
    PostModel.find()
        .then((data => {
            res.status(200).json({
                message: 'Post Fetched Successfully',
                posts: data
            });
        })
        )
});

router.delete("/:id", (req, res, next) => {
    PostModel.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: "Post deleted!" });
        });
});

router.post('', checkAuth, (req, res, next) => {
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        createrId: req.userData.userId,
        createrName: req.userData.UserName
    });
    post.save();
    res.status(201).json({
        message: 'Post inserted successfully'
    });
});

router.put('/:id', (req, res, next) => {
    const post = new PostModel({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });

    PostModel.updateOne({ _id: req.params.id }, post)
        .then((result => {
            console.log('Post Updated successfully', result);
            res.status(200).json({
                message: 'Post Updated successfully'
            });
        }))
});

module.exports = router;