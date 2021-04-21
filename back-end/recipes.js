const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

//
//Recipe schema and model
//

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const recipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    path: String,
    title: String,
    discription: String,
    ingredients: [],
    directions: String,
    notes: String,
    created: {
        type: Date,
        default: Date.now
    },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

/* API Endpoints */

// upload new recipe
router.post('/', validUser, upload.single('photo'), async (req,res) => {
    if (!req.file)
        return res.status(400).send({
            message: "Must upload a file."
        });
    let ingredients = JSON.parse(req.body.ingredients);
    const recipe = new Recipe({
        user: req.user,
        path: "/images/" + req.file.filename,
        title: req.body.title,
        discription: req.body.discription,
        ingredients: ingredients,
        directions: req.body.directions,
        notes: req.body.notes
    });
    try {
        await recipe.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// get all recipes
router.get('/', async (req,res) => {
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

// get all recipes from a specific user
router.get("/users", validUser, async (req, res) => {
    // return photos
    try {
      let recipes = await Recipe.find({
        user: req.user
      }).sort({
        created: -1
      })
      return res.send(recipes);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get specific recipe
router.get('/:title', async (req,res) => {
    try {
        let recipe = await Recipe.findOne({
            title: req.params.title
        }).populate('user');
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
router.put('/:title', async (req,res) => {
    try {
        let duplicate = await Recipe.findOne({title: req.body.title});
        if(!duplicate) {
            let recipe = await Recipe.findOne({title: req.params.title})
            if(!recipe) {
                return res.sendStatus(404);
            }
            let titleChange = false;
            if(recipe.title != req.body.title)
                titleChange = true;
            recipe.title = req.body.title;
            recipe.discription = req.body.discription;
            recipe.ingredients = JSON.parse(req.body.ingredients);
            recipe.directions = req.body.directions;
            recipe.notes = req.body.notes;
            await recipe.save();
            return res.send(titleChange);
        } else {
            return res.sendStatus(400).send({
                message: "Title already in use"
            })
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})


module.exports = {
    model: Recipe,
    routes: router,
}