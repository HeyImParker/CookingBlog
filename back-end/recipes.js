const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

//
//Recipe schema and model
//

const recipeSchema = new mongoose.Schema({
    title: String,
    ingredients: {
        amount: Number,
        ingredient: String
    },
    directions: []
});

const Recipe = mongoose.model('Recipe', recipeSchema);

/* API Endpoints */

// upload new recipe

// get all recipes
router.get('/:title', async (req,res) => {
    try {
        let recipe = await Recipe.find();
        if(!recipe) {
            return res.sendStatus(404);
        }
        return res.send(recipe);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// get specific recipe
router.get('/:title', async (req,res) => {
    try {
        let recipe = await Recipe.find({
            title: req.params.title
        });
        if(!recipe) {
            return res.sendStatus(404);
        }
        return res.send(recipe);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// modify recipe

module.exports = {
    model: Recipe,
    routes: router,
}