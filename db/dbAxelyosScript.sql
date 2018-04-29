create schema test_task_axelyos_db;
use test_task_axelyos_db;
CREATE TABLE BOOKED_DATE
(
	bookedDate            DATE NOT NULL,
	idUserData            INTEGER NOT NULL,
	 PRIMARY KEY (bookedDate,idUserData)
)
;



CREATE TABLE GENRE
(
	idGenre               INTEGER NOT NULL auto_increment,
	nameGenre             VARCHAR(40) NOT NULL,
	 PRIMARY KEY (idGenre)
)
;






CREATE TABLE TESTIMONIAL
(
	idTestimonial         INTEGER  NOT NULL auto_increment,
	nameTestimonial       VARCHAR(50) NOT NULL,
	contentTestimonial    VARCHAR(255) NOT NULL,
	idUserData            INTEGER NOT NULL,
	 PRIMARY KEY (idTestimonial)
)
;



CREATE TABLE USER
(
	idUser                INTEGER NOT NULL auto_increment,
	firstName             VARCHAR(45) NOT NULL,
	lastName              VARCHAR(45) NOT NULL,
	username              VARCHAR(45) NOT NULL,
	pass                  VARCHAR(255) NOT NULL,
	eMail                 VARCHAR(45) NOT NULL,
	isDeleted             boolean NULL,
	 PRIMARY KEY (idUser)
)
;



CREATE TABLE USER_DATA
(
	idUserData            INTEGER NOT NULL auto_increment,
	bio                   VARCHAR(255) NULL,
	linkYoutube           VARCHAR(255) NULL,
	address               VARCHAR(50) NULL,
	birthDate             DATE NULL,
    typeUser ENUM('DJ', 'Two Piece','Three Piece','Solo Artist','Other') NULL DEFAULT 'Solo Artist',
	gender                VARCHAR(20) NULL,
	city                  VARCHAR(50) NULL,
	country               VARCHAR(50) NULL,
    numberPhone           VARCHAR(25) NULL,
	postcode              INTEGER NULL,
	minPricePerHour       INTEGER NULL,
	maxPricePerHour       INTEGER NULL,
    idUser            INTEGER NOT NULL,
	 PRIMARY KEY (idUserData)
)
;



CREATE TABLE USER_DATA_GENRES
(
	idGenre               INTEGER NOT NULL auto_increment,
	idUserData            INTEGER NOT NULL,
	 PRIMARY KEY (idGenre,idUserData)
)
;



CREATE TABLE VENUE
(
	idVenue               INTEGER NOT NULL auto_increment,
	nameVenue             VARCHAR(50) NOT NULL,
	typeVenue             VARCHAR(50) NOT NULL,
	locationVenue         VARCHAR(50) NOT NULL,
	idUserData            INTEGER NOT NULL,
	 PRIMARY KEY (idVenue)
)
;



ALTER TABLE BOOKED_DATE
	ADD FOREIGN KEY R_14 (idUserData) REFERENCES USER_DATA(idUserData)
;


ALTER TABLE TESTIMONIAL
	ADD FOREIGN KEY R_7 (idUserData) REFERENCES USER_DATA(idUserData)
;



ALTER TABLE user_data
	ADD FOREIGN KEY R_4 (idUser) REFERENCES USER(idUser)
;



ALTER TABLE USER_DATA_GENRES
	ADD FOREIGN KEY R_16 (idGenre) REFERENCES GENRE(idGenre)
;


ALTER TABLE USER_DATA_GENRES
	ADD FOREIGN KEY R_17 (idUserData) REFERENCES USER_DATA(idUserData)
;



ALTER TABLE VENUE
	ADD FOREIGN KEY R_6 (idUserData) REFERENCES USER_DATA(idUserData)
;

