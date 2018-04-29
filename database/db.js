var mysql= require('promise-mysql');

const config = {
    host : "localhost",
	user : "root",
	password : "",
	database : "test_task_axelyos_db",
    connectionLimit: 100,
};

const pool = mysql.createPool(config);

module.exports=pool;