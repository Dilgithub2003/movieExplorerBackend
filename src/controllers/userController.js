const User = require("../models/user.js");
const jwt = require('jsonwebtoken');
const WatchList  = require("../models/wachlist.js");
const { response } = require("express");

const generateWebToken = (user)=>{
    return jwt.sign(
        {id:user.id, email:user.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPRES_IN || '1h'}
    );
};

exports.createUser = async (req,res)=>{
    try{
        const {name, email, password, genres} = req.body;
        const user = await User.create({name, email, password, genres});
        res.status(200).json(user);
    }catch(err){
        res.status(400).json({error:err.message})
    }
};

exports.loginUSer = async (req,res)=>{
    try{
        const {email,password} = req.body;
        // console.log (email , password)
        const user =await User.findOne({email});
        if(!user){
            return res.status(401).json({error:"Invalid username"});
        }
        const pwd =await user.comparePassword(password);
        if(!pwd){
            return res.status(401).send({error:"Invalid password"})
        }
        const token = generateWebToken(user);

        return res.status(200).json({
            message:"Login success",
            token,
            user :{ id: user._id, name: user.name, email: user.email }
        })
    }catch (err){
        res.status(500).json({error:`Error login ${err.message}`})
    }
}

exports.addMovieToWatchList = async (req, res) => {
  try {
    const {  movieID } = req.body;

    //  Find user by email
    const user =req.user;
    // console.log(user.id)
    // console.log(movieID)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find existing watchlist for user
    let watchlist = await WatchList.findOne({ user: user.id });

    // If none, create one
    if (!watchlist) {
      watchlist = await WatchList.create({
        user: user.id,
        movies: []
      });
    }

    // Add movie using schema method
    await watchlist.addMovie(movieID);

    // 5️⃣ Return success
    return res.status(200).json({
      message: "Movie added to watchlist!",
      watchlist
    });

  } catch (err) {
    // console.error(err);
    return res.status(500).json({ error: err.message });
  }
};



exports.removeMovieFromWatchList = async function(req, res) {
    try{
        const {email, movieID} = req.body;
        const user = req.user;
        if(!user){
            return res.status(404).json({error:"Invalid user data"})
        };
        let watchlist = await WatchList.findOne({user:user.id});
        if(!watchlist){
            return res.status(404).json({error:"Not found Movie"})
        }
        // 3️⃣ Check if movie exists in watchlist
        const movieExists = watchlist.movies.some(m => m.movieID === movieID);
        if (!movieExists) {
        return res.status(404).json({ error: "Movie not found in watchlist" });
        }
         await watchlist.removeMovie(movieID);
        console.log(response);
        return res.status(200).json({message: "Movie removed successful"})
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}

exports.updateProfile =async function(req,res){
  //console.log("req catched")
    try{
    const { password,genres} = req.body;
    const user =await User.findOne({email:req.user.email});
    if(!user){
        return res.status(404).json({error:"User not found"})
    }
    if (password) {
      user.password = password;
    }
    if (genres) {
      user.genres = genres;
    }
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        genres: user.genres
      }
    })}
    catch(err){
        return res.status(401).json({error:err.message});
    }
}

exports.getWatchlistMoviesByID = async (req, res) => {
  try {
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }
    const watchlist = await WatchList.findOne({ user: user.id });
    if (!watchlist) {
      return res.status(404).json({ message: "No watchlist found for this user" });
    }
    return res.status(200).json({
      success: true,
      movies: watchlist.movies,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


exports.getUserData = async(req, res) => {
  try{
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }
    const userData =await User.findOne({email: user.email});
    //console.log(userData);
    return  res.status(200).json({
      success: true,
      name: userData.name,
      email: userData.email,
      genres: userData.genres
    });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
}
exports.deleteAccount = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    await User.findByIdAndDelete(user._id);
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

    //         const { email, password } = req.body;

    // // 1. Find user
    // const user = await User.findOne({ email });
    // if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // // 2. Compare password
    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
    // res.status(200).json({"Sucess":`Su login `})