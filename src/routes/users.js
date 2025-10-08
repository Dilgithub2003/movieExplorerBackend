const express = require('express');
const router =  express.Router();
const controllers = require('../controllers/userController.js');
const {protect} = require('../middlewares/authMiddleware.js');

router.post('/register',controllers.createUser);
router.post('/login',controllers.loginUSer);

router.get('/register',(req,res)=>{
    res.send({"Message":"get on /register"});
});

router.get('/home',protect,(req,res)=>{
    res.json({ message: 'Welcome to your profile!', user: req.user });
});

router.post('/watchlist/addmovie',protect,controllers.addMovieToWatchList);
router.post('/watchlist/removemovie',protect,controllers.removeMovieFromWatchList);
router.post('/profile/updateprofile',protect,controllers.updateProfile);
router.get('/watchlist/movies',protect,controllers.getWatchlistMoviesByID);
router.get('/profile',protect,controllers.getUserData);
router.delete('/delete-account', protect, controllers.deleteAccount);

module.exports = router;