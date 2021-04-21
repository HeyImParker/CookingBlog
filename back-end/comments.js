const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const recipes = require("./recipes.js");
const Recipe = recipes.model;

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    recipe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Recipe'
    },
    created: {
        type: Date,
        default: Date.now
    },
    comment: String
});

const Comment = mongoose.model('Comment', commentSchema);

//upload comment
router.post("/:title", validUser, async (req, res) => {
    if(req.body.comment == "") {
        return res.status(400).send({
            message: "No comment."
        });
    }
    try {
        let recipe = await Recipe.findOne({
            title: req.params.title
        });
        const comment = new Comment({
            comment: req.body.comment,
            user: req.user,
            recipe: recipe,
        });
        await comment.save();
        return res.sendStatus(200);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//get list of comments for a photo
router.get('/:title', async (req, res) => {
    try {
        const recipe = await Recipe.find({
            title: req.params.title
        })
        let comments = await Comment.find({
            recipe: recipe
        }).sort({
            created: -1
        }).populate('user');
        return res.send(comments);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    model: Comment,
    routes: router,
}