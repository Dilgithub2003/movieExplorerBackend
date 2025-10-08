const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  movies: [
    {
      movieID: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

//  Instance method to add a movie
watchlistSchema.methods.addMovie = async function(movieID) {
  //console.log("watchlist scema ")
  // prevent duplicates
  const exists = this.movies.some(m => m.movieID === movieID);
  if (!exists) {
    this.movies.push({ movieID });
    await this.save();
  }
  return this;
};

//  Instance method to remove a movie
watchlistSchema.methods.removeMovie = async function(movieID) {
  this.movies = this.movies.filter(m => m.movieID !== movieID);
  await this.save();
  return this;
};



const WatchList = mongoose.model("WatchList", watchlistSchema);
module.exports = WatchList;
