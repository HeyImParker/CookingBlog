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
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    },
    comment: String
});

const Comment = mongoose.model('Comment', commentSchema);

//upload comment
router.post("/:title/title", validUser, async (req, res) => {
    if(req.body.comment == "") {
        return res.status(400).send({
            message: "No comment."
        });
    }
    if(req.params.title == null || req.params.title == "") {
        return res.status(400).send({
            message: "title undefined or empty string"
        })
    }
    try {
        let recipe = await Recipe.findOne({
            title: req.params.title
        });
        if(!recipe) {
            return res.status(404).send({
                message: "recipe not found"
            })
        }
        const comment = new Comment({
            comment: req.body.comment,
            user: req.user,
            recipe: recipe,
            parent: null
        });
        await comment.save();
        return res.sendStatus(200);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//upload a sub comment
router.post("/:id/sub", validUser, async (req, res) => {
    if(req.body.comment == "") {
        return res.status(400).send({
            message: "No comment."
        });
    }
    try {
        let parentComment = await Comment.findOne({
            _id: req.params.id
        });
        const comment = new Comment({
            comment: req.body.comment,
            user: req.user,
            recipe: null,
            parent: parentComment,
        });
        await comment.save();
        return res.sendStatus(200);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//get list of comments for a recipe
router.get('/:title/title', async (req, res) => {
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

//get list of sub comments
router.get('/:id/sub', async (req, res) => {
    try {
        const headComment = await Comment.find({
            _id: req.params.id
        })
        let comments = await Comment.find({
            parent: headComment
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