const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


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
    ingredients: [],
    directions: String,
    notes: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

//
//Photo schema and model
//

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});
  
/* API Endpoints */

// upload new recipe
router.post('/', validUser, upload.single('photo'), async (req,res) => {
    console.log(req);
    if (!req.file)
        return res.status(400).send({
            message: "Must upload a file."
        });
    let ingredients = JSON.parse(req.body.ingredients);
    const recipe = new Recipe({
        user: req.user,
        path: "/images/" + req.file.filename,
        title: req.body.title,
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


// upload photo
router.post("/", upload.single('photo'), async (req, res) => {
    // check parameters
    if (!req.file)
      return res.status(400).send({
        message: "Must upload a file."
      });
  
    const photo = new Photo({
      user: req.user,
      path: "/images/" + req.file.filename,
      title: req.body.title,
    });
    try {
      await photo.save();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get all photos
router.get("/all", async (req, res) => {
    try {
      let photos = await Photo.find().sort({
        created: -1
      }).populate('user');
      return res.send(photos);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get a specific photo
router.get("/all/:id", async (req, res) => {
    try {
        let photo = await Photo.find({
            _id: req.params.id
        }).populate('user');
        if(!photo) {
            res.sendStatus(404);
            return;
        }
        res.send(photo);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

module.exports = {
    model: Recipe,
    routes: router,
}