var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool =require('../database/db');

var testimonials = [];
var venues = [];
var genresAll = [];
var genres = [];
var userData;
var idUserData;
var dates = [];

var getVidId = function(url) {
	var vidId;
	if (url.indexOf("youtube.com/watch?v=") !== -1) {
		vidId = url.substr(url.indexOf("youtube.com/watch?v=") + 20);
	} else if (url.indexOf("youtube.com/watch/?v=") !== -1) {
		vidId = url.substr(url.indexOf("youtube.com/watch/?v=") + 21);
	} else if (url.indexOf("youtu.be") !== -1) {
		vidId = url.substr(url.indexOf("youtu.be") + 9);
	} else if (url.indexOf("www.youtube.com/embed/") !== -1) {
		vidId = url.substr(url.indexOf("www.youtube.com/embed/") + 22);
	} else if (url.indexOf("?v=") !== -1) {
		vidId = url.substr(url.indexOf("?v=") + 3, 11);

	} else {
		console.warn("YouTubeUrlNormalize getVidId not a youTube Video: " + url);
		vidId = null;
	}

	if (vidId.indexOf("&") !== -1) {
		vidId = vidId.substr(0, vidId.indexOf("&"));
	}
	return vidId;
};

var YouTubeUrlNormalize = function(url) {
	var rtn = url;
	if (url) {
		var vidId = getVidId(url);
		if (vidId) {
			rtn = "https://www.youtube.com/embed/" + vidId;
		} else {
			rtn = url;
		}
	}

	return rtn;
};

router.get('/', ensureAuthenticated, async(req, res)=> {
	let dbGenres = await getGenresDb(req,res);
	pool.query("SELECT * FROM USER_DATA where idUser=" + req.user.idUser, function(err, result, fields) {
		if (err) return console.log(err);
		if (result.length == 0) {
			req.session.user = req.user;
			res.render('createProfile');
		} else {
			userData = result[0];
			req.session.user = req.user;
			req.session.idUserData = userData.idUserData;
			idUserData = userData.idUserData;
			req.session.userData = userData;
				//testimonials
				pool.query("SELECT * FROM testimonial where idUserData=" + idUserData, function(err, result1, fields) {

					if (result1.length == 0) {
						res.render('testimonials', {
							userr : req.user,
							idUserData : idUserData,
							testimonials : testimonials
						});
					} else {
						testimonials = result1;
						req.session.testimonials = testimonials;
						pool.query("SELECT * FROM booked_date where idUserData=" + idUserData, function(err, resultt, fields) {
							if (resultt.length == 0) {
								res.render('calendarDates', {
									dates : dates,
									userr : req.user,
									idUserData : idUserData
								});
							} else {
								pool.query("SELECT * FROM venue where idUserData=" + idUserData, function(err, result2, fields) {
									if (result2.length == 0) {
										res.render('venues', {
											userr : req.user,
											idUserData : idUserData,
											venues : venues
										});
									} else {
										venues = result2;
										req.session.venues = venues;
										
										pool.query("SELECT idGenre FROM user_data_genres where idUserData=" + idUserData, function(err, result3, fields) {
											if (result3.length == 0) {
												res.render('genre', {
													userr : req.user,
													idUserData : idUserData,
													genresAll : genresAll,
													genres : genres
													
												});
											} else {
												genres = result3;
												req.session.genres = result3;
												var gen = genres[0].idGenre;
												for (var i = 1; i < genres.length; i++) {
													gen = gen + "," + genres[i].idGenre;
												}
												var sql = "SELECT * FROM genre where idGenre in (" + gen + ")";
												pool.query(sql, function(err, result5, fields) {
													genres = result5;
													req.session.genres = result5;
													res.render('index', {
														userData : userData,
														userr : req.user,
														venues : venues,
														genresAll:genresAll,
														genres : genres,
														testimonials : testimonials
													});
													testimonials = [];
													venues = [];
													genresAll = [];
													genres = [];
													idUserData = "";
													userData = "";
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}
router.post('/editVideo',ensureAuthenticated, function(req, res) {
	var link = req.body.link;
	link = YouTubeUrlNormalize(link);
	pool.query("UPDATE user_data SET linkYoutube = '" + link + "' WHERE idUser =" + req.user.idUser, function(err, result3, fields) {
		res.send(link);
	});
});
router.post('/editPrice',ensureAuthenticated, function(req, res) {
	var sql;
	if (req.body.minPrice && req.body.maxPrice) {
		sql = "UPDATE user_data SET minPricePerHour = " + req.body.minPrice + ",maxPricePerHour = " + req.body.maxPrice + " WHERE idUser =" + req.user.idUser;
	} else {
		if (req.body.minPrice) {
			sql = "UPDATE user_data SET minPricePerHour = " + req.body.minPrice + " WHERE idUser =" + req.user.idUser;

		}
		if (req.body.maxPrice) {
			maxPrice = req.body.maxPrice;
			sql = "UPDATE user_data SET maxPricePerHour = " + maxPrice + " WHERE idUser =" + req.user.idUser;
		}
	}
	pool.query(sql, function(err, result3, fields) {
		res.send("true");
	});
});

router.post('/editBio',ensureAuthenticated, function(req, res) {
	var bio = req.body.bio;
	pool.query("UPDATE user_data SET bio = '" + bio + "' WHERE idUser =" + req.user.idUser, function(err, result3, fields) {
		res.send(bio);
	});
});

router.post('/addTestimonial',ensureAuthenticated, function(req, res) {
	var name = req.body.name;
	var text = req.body.text;
	pool.query("INSERT into testimonial (nameTestimonial,contentTestimonial,idUserData) values ('" + name + "','" + text + "'," + req.session.idUserData + ");", function(err, result3, fields) {
		if (err) {
			res.send("err");
		} else {
			res.send({
				id : result3.insertId
			});
		}
	});
});
router.post('/addNewVenue',ensureAuthenticated, function(req, res) {
	var name = req.body.name;
	var type = req.body.type;
	var location = req.body.location;
	pool.query("INSERT into venue (nameVenue,typeVenue,locationVenue,idUserData) values ('" + name + "','" + type + "','" + location + "'," + req.session.idUserData + ");", function(err, result3, fields) {
		res.send({
			id : result3.insertId
		});
	});
});
router.post('/checkDate',ensureAuthenticated, function(req, res) {
	var date = req.body.date;
	pool.query("select * from booked_date where bookedDate='" + date + "' and idUserData=" + req.session.idUserData + ";", function(err, result3, fields) {
		if (result3.length == 0) {
			res.send("success");
		} else {
			res.send("err");

		}
	});
});

router.post('/addNewSelectedGenre',ensureAuthenticated, function(req, res) {
	var id = req.body.idGenre;
	pool.query("INSERT INTO user_data_genres (idGenre,idUserData) VALUES ("+id+","+req.session.idUserData + ");", function(err, result3, fields) {
		if (err) {
			res.send("err");

		} else {
			res.send("success");
		}
	});
});
router.post('/addNewGenre',ensureAuthenticated, function(req, res) {
	var name = req.body.name;
	pool.query("insert into genre (nameGenre) values ('" + name + "');",function(error, result3, fields) {
		if(error) res.send("err");
		var id=result3.insertId;
		pool.query("INSERT INTO user_data_genres (idGenre,idUserData) VALUES ("+id+","+req.session.idUserData + ");", function(err, results) {
			if (err) {
				res.send("err");
			} else {
				res.send({
					id : result3.insertId
				});
			}
		});
	});
});
router.post('/deleteUserGenre',ensureAuthenticated, function(req, res) {
	var idGenre = req.body.idGenre;
	pool.query("DELETE FROM user_data_genres WHERE idGenre ="+idGenre+" and idUserData="+req.session.idUserData+";", function(err, results) {
		if (err) {
			res.send("err");
		} else {
			res.send("success");
		}
	});
});

router.post('/deleteUserVenue',ensureAuthenticated, function(req, res) {
	var idVenue = req.body.idVenue;
	pool.query("DELETE FROM venue WHERE idVenue ="+idVenue+" and idUserData="+req.session.idUserData+";", function(err, results) {
		if (err) {
			res.send("err");
		} else {
			res.send("success");
		}
	});
});

async function getGenresDb(req,res) {
	try {
		let itemData = await pool.query(
			"SELECT * FROM genre"
			);
		genresAll = itemData;
		req.session.genresAll = genresAll;
		return true;
	} catch (error) {
		console.log(error);
	}
}



module.exports = router;