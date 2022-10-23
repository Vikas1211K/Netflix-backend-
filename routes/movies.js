const router = require('express').Router();
const Movies = require('../models/Movies');
const crypto = require('crypto-js');
const verify = require('../veifyToken')

//Create
router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movies(req.body)
        try {
            const savedMovie = await newMovie.save()
            res.status(200).json(savedMovie)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can't perform this action")
    }
});

//Update
router.put('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await Movies.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { $new: true }
            )
            res.status(200).json(updatedMovie)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can't perform this action")
    }
});

//Delete
router.delete('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const deletedMovie = await Movies.findByIdAndDelete(
                req.params.id,
            )
            res.status(200).json({ deletedMovie, msg: "Deleted" })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can't perform this action")
    }
});

//get
router.get('/find/:id', verify, async (req, res) => {
    try {
        const Movie = await Movies.findById(
            req.params.id,
        )
        res.status(200).json(Movie)
    } catch (err) {
        res.status(500).json(err)
    }
});

//get random
router.get('/random', verify, async (req, res) => {
    const type = req.query.type
    let Movie
    try {
        if (type === "series") {
            Movie = await Movies.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ]);
        } else {
            Movie = await Movies.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ]);
        }

        res.status(200).json(Movie)
    } catch (err) {
        res.status(500).json(err)
    }
});

//get all
router.get('/', verify, async (req, res) => {
    try {
        const Movie = await Movies.find()
        res.status(200).json(Movie.reverse())
    } catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router