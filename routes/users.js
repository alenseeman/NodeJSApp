var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pool =require('../database/db');


router.get('/login', function(req, res) {
	res.render('login');
});

router.get('/register', function(req, res) {
	res.render('register');
});

async function findUserByUsername(username) {
	var sql = "select * from user where username='" + username + "'";
	try {
		let itemData = await pool.query(
			sql
			);
		if(itemData.length==0)
			return false;
		else
			return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}
async function insertUser(sql) {
	try {
		let itemData = await pool.query(
			sql
			);
		if(itemData)
			console.log('User added...');
	} catch (error) {
		console.log(error);
	}
} 

router.post('/register',
	async(req, res)=> {
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var password2 = req.body.password2;
		var errors;

		var uname;
		let foundUsername = await findUserByUsername(username);
		if(foundUsername)
			uname=username;
		else
			uname="";

		req.checkBody('firstName', 'First name is required').notEmpty();
		req.checkBody('lastName', 'Last name is required').notEmpty();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Please use valid email').isEmail();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
		req.checkBody('username', 'Username is taken').not().equals(uname);
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Password is required').notEmpty();


		// Check for errors
		errors = req.validationErrors();

		if (errors) {
			console.log('Form has errors...');
			res.render('register', {
				errors : errors,
				firstName : firstName,
				lastName : lastName,
				email : email,
				username : username,
				password : password,
				password2 : password2
			});
		} else {
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
					password = hash;
					var sql = "INSERT INTO user (firstName,lastName,username,pass,eMail,isDeleted) VALUES ('" + firstName + "','" + lastName + "','" + username + "','" + password + "','" + email + "'," + 0 + ")";
					insertUser(sql);
					req.flash('success', 'Registration successfully');
					res.locals.message = req.flash();
					res.render('login');		
				});
			});
		}
	});


passport.serializeUser(function(user, done) {
	done(null, user.idUser);
});

passport.deserializeUser(function(id, done) {
	pool.query(
		"select * from user where idUser = " + id,function(err, rows){
			done(err, rows[0]);
		}
		);
});


passport.use('local', new LocalStrategy(
	function(username, password, done) {
		pool.query("SELECT * FROM user where username='" + username + "';", function(err, rows) {
			if (err) return done(err);
			if (!rows.length) {
				return done(null, false, {
					message : 'No user find'
				});
			}
			bcrypt.compare(password, rows[0].pass, function(err, isMatch) {
				if (err) {
					return done(null, false, {
						message : 'Wrong password'
					});

				}
				if (isMatch) {
					return done(null, rows[0]);
				} else {
					return done(null, false, {
						message : 'Incorrect password'
					});
				}

			});
		});
	}
	));

// // Login - POST
router.post('/login',
	passport.authenticate('local', {
		successRedirect : '/',
		failureRedirect : '/users/login',
		failureFlash : 'Invalid Username Or Password'
	}),

	function(req, res) {
		console.log('Auth Successfull');
		res.redirect('/');
	});


router.get('/logout', function(req, res) {

	req.logout();
	req.flash('successs', 'You have logged out');
	res.redirect('/users/login');
	req.session.destroy();
});

module.exports = router;