const express = require('express');
const passport = require('passport');
const expressValidator = require('express-validator');

const Router = express.Router();
Router.use(expressValidator());

const User = require('../models/user');

// Get Route for the HomePage
Router.get('/', (req, res) => {
    res.render('home', { title: 'Home Page', hasSession: req.isAuthenticated(), homePage: true });
});
// Get Route for the registration page
Router.get('/register', (req, res) => {
    let username = req.user;
    res.render('register', { title: 'Registration Page', register: true, username: username });
});
// Post Route for the registration page
Router.post('/register', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    // Express Validator uses checkBody function to error check registration form
    req.checkBody('username', 'Username field cannot be empty').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters').len(4, 15);
    req.checkBody('email', 'Email Field cannot be empty').notEmpty();
    req.checkBody('password', 'Password must be between 5-15 characters').len(5, 15);
    req.checkBody('passwordMatch', 'Must re-enter password').notEmpty();
    req.checkBody('passwordMatch', 'Passwords do not match, please try again').equals(password);
    // assign validation errors to variable
    let errors = req.validationErrors();
    // If any errors ill output them with the appropriate flash error messages
    if (errors) {
        res.render('register', { title: 'Registration Page', alert: 'there is an error.', regErr: true, errors });
    } else {
        // if there are no errors we will insert user info into database
        let user = new User();
        user.username = username;
        user.email = email;
        user.password = password;
        // Add the user to the database
        user.save((err, user) => {
            if (err) {
                req.flash('error_msg', 'User couldnt be created');
                res.redirect('/register');
            } else {
                User.findOne()
                    .sort({ created_at: -1 })
                    .exec((err, post) => {
                    
                    req.login(post.username, (err, user) => {
                        if (err) console.error(err);
                        res.redirect('/users/profile');
                    });
                });
            }
        });
    }
});


module.exports = Router;