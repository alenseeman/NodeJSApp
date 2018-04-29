var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool =require('../database/db');
var _ = require('lodash');

var userData;
var idUserData;
var testimonials = [];
var venues = [];
var genres = [];
var genresAll = [];
var user;
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

async function getUserData(idUser) {
	try {
		let itemData = await pool.query(
			"SELECT * FROM USER_DATA where idUser=" + idUser
			);
		if(itemData.length!=0)
		{
			userData = itemData[0];
			idUserData = userData.idUserData;
		}
	} catch (error) {
		console.log(error);
	}	
}

router.get('/new', ensureAuthenticated, function(req, res) {
	res.render('createProfile');
});

router.post('/new', ensureAuthenticated, async(req, res)=> {
	user = req.session.user;
	var bday = req.body.bday;
	var numberPhone = req.body.numberPhone;
	var typeUser = req.body.typeUser;
	var address = req.body.address;
	var city = req.body.city;
	var postCode = req.body.postCode;
	var country = req.body.country;
	var gender = req.body.gender;
	var bio = req.body.bio;
	var linkYoutube = req.body.linkYoutube;
	var minPrice = req.body.minPrice;
	var maxPrice = req.body.maxPrice;
	linkYoutube = YouTubeUrlNormalize(linkYoutube);
	var errors;
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('postCode', 'Post code is required').notEmpty();
	req.checkBody('country', 'Country is required').notEmpty();
	req.checkBody('bio', 'Bio is required').notEmpty();
	req.checkBody('bday', 'Birth date is required').notEmpty();
	errors = req.validationErrors();

	if (errors) {
		console.log('Form has errors...');
		res.render('createProfile', {
			bday : bday,
			numberPhone : numberPhone,
			typeUser : typeUser,
			address : address,
			city : city,
			postCode : postCode,
			country : country,
			gender : gender,
			bio : bio,
			linkYoutube : linkYoutube
		});
	} else {
		var sql = "INSERT INTO user_data (numberPhone,typeUser,birthDate,bio,gender,country,postcode,minPricePerHour,maxPricePerHour,city,address,linkYoutube,idUser) VALUES('" + numberPhone + "','" + typeUser + "','" + bday + "','" + bio + "','" + gender + "','" + country + "'," + postCode + "," + minPrice + "," + maxPrice + ",'" + city + "','" + address + "','" + linkYoutube + "'," + user.idUser + ");";
		pool.query(sql, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log("User data added ...");
				idUserData=result.insertId;
				req.session.idUserData=idUserData;
				res.render('testimonials', {
					testimonials : testimonials
				});
			}
		});
	}
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}

router.post('/addTestimonial', ensureAuthenticated, function(req, res) {
	if (req.session.idUserData)
		idUserData = req.session.idUserData;
	var nameT = req.body.nameTestimonial;
	var contentT = req.body.contentTestimonial;
	testimonials.push([ nameT, contentT, idUserData ]);

	res.render('testimonials', {
		testimonials : testimonials
	});
});

router.post('/testimonials', ensureAuthenticated, function(req, res) {
	if (req.session.userData)
		idUserData = req.session.userData.idUserData;
	if (testimonials.length != 0) {
		var sql = "INSERT INTO testimonial (nameTestimonial,contentTestimonial,idUserData) VALUES ?;";

		pool.query(sql, [ testimonials ], function(err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log("Testimonials added ...");
				testimonials=[];
			}
		});
	}
	res.render('calendarDates', {
		dates : dates
	});
});
router.post('/removeBooking',ensureAuthenticated, function(req, res) {
	if (req.session.userData)
		idUserData = req.session.userData.idUserData;
	var sql="DELETE FROM booked_date WHERE bookedDate='"+req.body.date+"' and idUserData="+idUserData;
	pool.query(sql, function(err, result3, fields) {
		if (err) {
			res.send('err');
		} else {
			res.send('success');
		}
	});

});

router.post('/addBooking', ensureAuthenticated, function(req, res) {
	if (req.session.userData)
		idUserData = req.session.userData.idUserData;
	pool.query("insert into booked_date (bookedDate,idUserData) values ('" + req.body.date + "'," + idUserData + ");", function(err, result3, fields) {
		if (err) {
			res.send('err');
		} else {
			res.send('success');
		}
	});
});

router.post('/bookings', ensureAuthenticated, function(req, res) {
	if (req.session.userData)
		idUserData = req.session.userData.idUserData;
	res.render('venues', {
		venues : venues
	});
});


//venuess
router.post('/addVenue', ensureAuthenticated, function(req, res) {
	if (req.session.userData)
		idUserData = req.session.userData.idUserData;
	userData = req.session.userData;
	var nameV = req.body.nameVenue;
	var typeV = req.body.typeVenue;
	var locationV = req.body.locationVenue;
	venues.push([ nameV, typeV, locationV, idUserData ]);
	res.render('venues', {
		venues : venues
	});
});

router.post('/venues', ensureAuthenticated, function(req, res) {
	if (req.session.userData)
		idUserData = req.session.userData.idUserData;
	if (venues.length != 0) {
		var sql = "INSERT INTO venue (nameVenue,typeVenue,locationVenue,idUserData) VALUES ?;";

		pool.query(sql, [ venues ], function(err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log("Venues added ...");
				venues=[];
			}

		});
	}
	var sql = "select * from genre;";
	pool.query(sql, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			genresAll = [];
			for (var i = 0; i < result.length; i++) {
				var genre = {
					idGenre : result[i].idGenre,
					nameGenre : result[i].nameGenre
				}
				genresAll.push(genre);
			}
			console.log("Genres selected ...");
			res.render('genre', {
				genresAll : genresAll
			});
		}
	});
});


router.post('/addGenre',ensureAuthenticated, function(req, res) {
	pool.query("insert into genre (nameGenre) values ('" + req.body.inputValue + "');", function(err, result3, fields) {
		var genre = {
			id : result3.insertId,
			name : req.body.nameGenre
		}
		genresAll.push(genre);
		res.send({
			id : result3.insertId
		});

	});

});

router.post('/genres', ensureAuthenticated, async(req, res)=> {
	console.log("kraj");
	if (req.session.userData)
	{	
		idUserData = req.session.userData.idUserData;
		userData = req.session.userData;
	}
	else
	{
		getUserData(req.user.idUser);
	}
	if (req.session.testimonials) {
		testimonials = req.session.testimonials;
	} else {
		pool.query("SELECT * FROM testimonial where idUserData=" + idUserData, function(err, result2, fields) {
			if (err) return null;
			testimonials = result2;
		});
	}
	if (req.session.venues) {
		venues = req.session.venues;
	} else {
		pool.query("SELECT * FROM venue where idUserData=" + idUserData, function(err, result2, fields) {
			if (err) return null;
			venues = result2;
		});
	}
	genresAll=[];
	if (req.session.genresAll) {
		genresAll = req.session.genresAll;
	} else {
		pool.query("SELECT * FROM genre", function(err, result3, fields) {
			if (err) console.log(err);
			genresAll = result3;
		});
	}

	var data = [];
	data = req.body.data;
	console.log(data);
	if(data.length!=0)
	{
		var results = [];
		results = data.split(",");

		alreadySelectedGenres=[];
		let move= await userIdGenre();
		var genreForDb=[];
		for (var i=0;i<results.length;i++)
		{
			var number=parseInt(results[i]);
			if(!alreadySelectedGenres.includes(number))
			{
				genreForDb.push([results[i],idUserData]);
			}
		}
		if (genreForDb.length != 0) {
			let ins= await insertNewGenre(genreForDb);

		}
	}
	await userGenres(req,res);

});

async function userGenres(req,res)
{
	var emptyData=true;
	try {
        //Find item
        let data= await pool.query("SELECT idGenre FROM user_data_genres where idUserData=" + idUserData); 
        if (data.length != 0) {
        	var gen = data[0].idGenre;
        	for (var i = 1; i < data.length; i++) {
        		gen = gen + "," + data[i].idGenre;
        	}
        	emptyData=false;
        }
    } catch (error) {
    	console.log(error);
    }
    if(!emptyData)
    {
    	var sql = "SELECT * FROM genre where idGenre in (" + gen + ")";
    	try {
    		let itemData = await pool.query(
    			sql
    			);
    		genres = itemData;
    		req.session.genres = itemData;
    	} catch (error) {
    		console.log(error);
    	}
    }
    res.render('index', {
    	userData : userData,
    	genres : genres,
    	genresAll:genresAll,
    	userr : req.user,
    	venues : venues,
    	testimonials : testimonials
    });
    userId = "";
    idUserData = "";
    testimonials = [];
    venues = [];
    genres = [];
    genresAll = [];
    user = {	};
}

async function userIdGenre()
{
	try{
		let itemData =await pool.query("SELECT idGenre FROM user_data_genres where idUserData=" + idUserData);
		for (var i=0;i<itemData.length;i++)
		{
			alreadySelectedGenres[i]=itemData[i].idGenre;
		}
		return true;
	} catch (error) {
		console.log(error);
	}	
}

async function insertNewGenre(g)
{
	try{
		let itemData =await pool.query("INSERT INTO user_data_genres (idGenre,idUserData) VALUES ?;",[ g ]);	
		console.log("User genres added...");
		return true;
	} catch (error) {
		console.log(error);
	}	
}

module.exports = router;