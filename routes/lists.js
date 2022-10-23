const router = require('express').Router();
const List = require('../models/List');
const crypto = require('crypto-js');
const verify = require('../veifyToken')

//Create
router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body)
        try {
            const savedList = await newList.save()
            res.status(200).json(savedList)
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
            const deletedList = await List.findByIdAndDelete(
                req.params.id,
            )
            res.status(200).json({ deletedList, msg: "Deleted" })
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
        const Lists = await List.findById(
            req.params.id,
        )
        res.status(200).json(Lists)
    } catch (err) {
        res.status(500).json(err)
    }
});

//get random
router.get('/random', verify, async (req, res) => {
    const type = req.query.type
    let Lists
    try {
        if (type === "series") {
            Lists = await List.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ]);
        } else {
            Lists = await List.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ]);
        }

        res.status(200).json(Lists)
    } catch (err) {
        res.status(500).json(err)
    }
});

//get all
router.get('/', verify, async (req, res) => {
    let list = []
    const typeQuery = req.query.type
    const genreQuery = req.query.genre
    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ])
            } else {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } }
                ])
            }
        }
        else {
            list = await List.aggregate([{ $sample: { size: 10 } }])
        }
        res.status(200).json(list.reverse())
    } catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router