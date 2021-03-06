const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const Users = express.Router();
// Bring in the User and Poll Schema
User = require('../models/user');
Poll = require('../models/poll');

//              **ROUTES FOR AUTHENTICATED USER**
// Get Route for the Profile Page ** Requires Authentication **
Users.get('/profile', authenticationMiddleware(), (req, res) => {
	if (req.session.flash.success) {
		res.locals.success_msg = req.flash();
	} else {
		res.locals.success_msg = null;
	}

	Poll.find({ _creator: req.user.id }).exec((err, polls) => {
		if (err) return next(err);
		res.render('profile', {
			title: 'Profile Page',
			hasSession: req.isAuthenticated(),
			noPolls: !polls.length ? true : false,
			profilePage: true,
			css: 'profile.css',
			username: req.user.user,
			user_id: req.user.id,
			polls
		});
	});
});

// Post Route for submitting new poll
Users.post('/profile', authenticationMiddleware(), (req, res) => {
	if (validatePolls(req.body)) {
		let poll = new Poll();
		poll.question = req.body.question;
		poll._creator = req.user.id;
		poll.options = req.body.option.map(option => ({
			option: option
		}));

		Poll.addPoll(poll, (err, poll) => {
			if (err) console.log(err);
			req.flash(
				'success_msg',
				'Your poll has been successfully posted!'
			);
			// res.locals.success_msg = req.flash();
			res.redirect('/users/profile');
		});
	} else {
		req.flash('error_msg', 'poll is rejected');
		res.status(404).redirect('/users/profile');
	}
});

// Put Route to update or edit a poll
Users.put('/profile/:_id', authenticationMiddleware(), (req, res) => {
	const id = req.params._id;
	const poll = req.body;

	Poll.updatePoll(id, poll, {}, (err, pollres) => {
		if (err) console.log('poll was unsuccessful', err);
		console.log('poll was successful', pollres);
		res.redirect('/users/profile');
	});
});

// Delete a Poll
Users.delete(
	'/profile/:_id',
	authenticationMiddleware(),
	(req, res) => {
		const id = req.params._id;
		Poll.remove({ _id: id }, err => {
			if (err) return next(err);
			res.redirect('/users/profile');
		});
	}
);

// Logout Route for signing out a user
Users.get('/logout', (req, res) => {
	req.logOut();
	req.session.destroy(() => {
		res.status(401).redirect('/');
	});
});

// custom function to validate a poll before its created
let validatePolls = poll => {
	return (
		typeof poll.question === 'string' &&
		poll._creator !== 'undefined' &&
		poll.options !== ''
	);
};

// Custom Passport Authentication Middleware
// has to be with function assignment or code will break
function authenticationMiddleware() {
	return (req, res, next) => {
		// console.log(`auth user info: ${JSON.stringify(req.session.passport)}`);
		// If user is authenticated the page wil be available for that user only
		if (req.isAuthenticated()) return next();
		// If Authentication fails user will be redirected to the Login Page
		res.redirect('/users/login');
	};
}

module.exports = Users;
