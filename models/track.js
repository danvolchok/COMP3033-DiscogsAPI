const mongoose = require('mongoose');
const schemaDefObj = {
    title: {
        type: String,
        require: true
    },
    artist: {
        type: String,
        require: true
    },
    album: {
       type: String,
       require: true
    },
    year: {
       type: String,
       require: true
    },
    genre: {
       type: String,
       require: true
    }
}

// create mongoose schema
const trackSchema = new mongoose.Schema(schemaDefObj)
// export mongoose model
module.exports = mongoose.model("Track", trackSchema)