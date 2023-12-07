// Express package
const express = require("express");
// router object
const router = express.Router();
// import model
const Track = require("../../models/track");

// pagination
const pageSize = 10;

// POST
router.post("/", async (req, res, next) => {
  if (!req.body.title) {
    res.status(400).json({ validationError: "Title is a required field." });
  } else if (!req.body.artist) {
    res.status(400).json({ validationError: "Artist is a required field." });
  } else if (!req.body.album) {
    res.status(400).json({ validationError: "Album is a required field." });
  } else if (!req.body.year) {
    res.status(400).json({ validationError: "Year is a required field." });
  } else if (!req.body.genre) {
    res.status(400).json({ validationError: "Genre is a required field." });
  } else {
    let track = new Track({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      year: req.body.year,
      genre: req.body.genre
    });
    await track.save();
    res.status(201).json(track);
  }
});

// GET


router.get("/", async (req, res, next) => {
    // pagination
  let page = req.query.page || 1; // if page is null, default to 1

  //calculate records to skip
  let skipSize = pageSize * (page - 1);

  // empty object to represent query
  // retrieve query string for filtering

  // tracks?year=X
  let query = {};
  if (req.query.year) {
    query.year = req.query.year;
  }

  // tracks?genre=Y
  if (req.query.genre) {
    query.genre = req.query.genre;
  }

  // tracks?artist=Z
  if (req.query.artist) {
    query.artist = req.query.artist
  }

  let tracks = await Track.find(query)
    .sort([["year", "descending"]])
    .skip(skipSize)
    .limit(pageSize);
  res.status(200).json(tracks);
})

// GET by id
router.get('/:_id', async (req, res, next) => {
    try {
      const track = await Track.findById(req.params._id);
      if (!track) {
        return res.status(404).send({ message: 'Track not found' });
      }
      res.json(track);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

// PUT

router.put("/:_id", async (req, res, next) => {
    if (!req.body.title) {
        res.status(400).json({ validationError: "Title is a required field." });
      } else if (!req.body.artist) {
        res.status(400).json({ validationError: "Artist is a required field." });
      } else if (!req.body.album) {
        res.status(400).json({ validationError: "Album is a required field." });
      } else if (!req.body.year) {
        res.status(400).json({ validationError: "Year is a required field." });
      } else if (!req.body.genre) {
        res.status(400).json({ validationError: "Genre is a required field." });
    } else {
      let track = await Track.findByIdAndUpdate(
        req.params._id,
        {
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            year: req.body.year,
            genre: req.body.genre
        },
        { new: true } // mongoose returns the updated version of this
      );
      res.status(200).json(track);
    }
  });

  // DELETE

  router.delete("/:_id", async (req, res, next) => {
    await Track.findByIdAndDelete(req.params._id);
    res.status(200).json({ success: "true" });
  });
  
  // Export
  module.exports = router;