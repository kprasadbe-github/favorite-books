'use strict';
var http = require('http');
var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var globalInit = new Array();
var init = express();
function setupGlobalRun()
{
	 globalInit['db'] = {'host':'localhost',
	                     'username':'root',
	                     'password':'',
	                     'database':'books'};

     globalInit['host']= {'host':'http://localhost',
                           'port':'2010',
                           'root':'/home/develop/favorite_books/favorite-books/'};

     globalInit['secret'] = {'key':'genericrandom',
                             'secret':'level1'};                     

}
var db = {};
function setUpDatabase()
{
        var mysql = require('mysql');
        var dbconfig = {
		  host : globalInit['db']['host'],
		  user : globalInit['db']['username'],
		  password: globalInit['db']['password'],
		};

		db.connect = mysql.createConnection(dbconfig); 
		//console.log(config);
		db.connect.connect();
		db.connect.query('use '+globalInit['db']['database']);
		db.connect.on('close', function (err) {
		  setUpDatabase();
		});
		db.connect.on('end', function (err) {
		  setUpDatabase();
		});
		db.connect.on('error', function(err) {
	      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
	          setUpDatabase();                        
		    } 
		    else {
			  console.log(err);
			  //throw err;
			}
		});
		db.mysql = db.connect;
    
}
function setupMiddleware() {
  //app.use(authMiddleware());
  init.use(express.static(path.join(__dirname, 'public'), { maxAge: 1 }));  
  init.use(['/templates/static/'], express.static(__dirname + '/templates/static/'));
  init.use(['/index','/login','/signup','/add'], express.static(__dirname + '/templates'));
  init.use(['/js','/css'], express.static(__dirname + '/public/bower_components'));
  init.use(bodyParser.json());
  init.use(bodyParser.urlencoded({ extended: false }));
  init.use(cookieParser('cookiecnx'));
  init.use(cookieSession({ secret: globalInit['secret']['secret'], cookie: { maxAge: 60000000 } }))
}  
function setupRouter()
{
	var index = require('./action/index');
	var router = express.Router();
	init.use('/',index(router,db));
}
function setupServer()
{
	http.createServer(init).listen(globalInit['host']['port']);
}
setupGlobalRun();
setupMiddleware();
setUpDatabase();
setupRouter();
setupServer();