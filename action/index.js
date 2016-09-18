var common = require('../task/common');
module.exports = function(action,db)
{
  action.get('/',function(req,res)
  {
       res.send(JSON.stringify({}));
       res.end();
       return false;
  });
  action.get('/logout',function(req,res)
  {
     delete req.session.userid;
     delete req.session.loged;
     delete req.session.email;
     delete session;
     res.send(JSON.stringify({}));
     res.end();
     return false;
  });
  action.get('/watchlist',function(req,res)
  {
        var data = {};
	    data.success = false;
	    data.message = '';
	    data.loged = true;

	    if(parseInt(req.session.userid) == 0)
    	{
    		data.loged = false;
    	}
    	if(data.loged)
	    {
	    	  data.success = true;
              common.deleteWatchlist(req,db.mysql);
              if(req.query['add'] == 1)
              {
              	common.addWatchlist(req,db.mysql);
              }	
	          
	    }
	    res.send(JSON.stringify(data));
	    res.end();
  });
  action.post('/addform',function(req,res)
  {
  	    var q = require('q');
  	    var data = {};
	    data.success = false;
	    data.message = '';
	    data.loged = true;
	    var required = ['title','desc','authour','year','isbn'];
	    req.query = req.body;
	    console.log(req.body);
	    for(var i in required)
	    {
	    	if(typeof(req.query[required[i]]) === 'undefined')
	    	{
                  data.message += required[i]+' is required<br />';
	    	}
	    }
	    if(data.message != '')
	    {
	    	if(parseInt(req.session.userid) == 0)
	    	{
	    		data.loged = false;
	    	}	
	    }
	    if(data.loged && data.message == '')
	    {
              q.all([common.addNewProduct(req,db.mysql)]).then(function(result){
                    data.success = true;
	       	        res.send(JSON.stringify(data));
	                res.end();
              }).fail(function (error){
					console.log("Error : "+error.stack);
					throw error;
	          }).done();
	    }
	    else
	    {
	    	  res.send(JSON.stringify(data));
              res.end();
	    }	

  });
  action.post('/loginform',function(req,res)
  {
  	   var q = require('q');
  	   function validateEmail(email) {
		    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
	    }
	    var data = {};
	    data.success = false;
	    data.message = '';
	    var required = ['email','password'];
	    req.query = req.body;
	    console.log(req.body);
	    for(var i in required)
	    {
	    	if(typeof(req.query[required[i]]) === 'undefined')
	    	{
                  data.message += required[i]+' is required<br />';
	    	}
	    }
	    if(data.message == '')
	    {
	    	if(!validateEmail(req.query.email))
	    	{
	    		data.message += 'Email is Invalid<br />';
	    	}	
	    }
	    if(data.message != '')
	    {
	        res.send(JSON.stringify(data));
            res.end();
        }
        else
        {	
		    q.all([common.checkLogedUser(req,db.mysql)]).then(function(result){
	            
		    	if(result[0][0].length == 0)
	            {
	                 data.message += 'Email is Not Exist';
	            }
	            else
	            {
	            	var md5 = require('md5'); 
	            	if(result[0][0][0]['password'] != md5(req.query['password']+result[0][0][0]['salt']))
	            	{
	                    data.message += 'Password is Not Matched';
	            	}	
	            	else
	            	{
	            		req.session.userid = result[0][0][0].id;
		       	        req.session.email = result[0][0][0]['email'];
		       	        req.session.loged = true;
		       	        data.success = true;
	            	}	
	            }
	            console.log(data);
	            res.send(JSON.stringify(data));
	            res.end();

		    }).fail(function (error){
					console.log("Error : "+error.stack);
					throw error;
	        }).done();
		}
   });	    
  action.post('/signupform',function(req,res)
  {
  	   var q = require('q');
  	   function validateEmail(email) {
		    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
	    }
	    var data = {};
	    data.success = false;
	    data.message = '';
	    var required = ['email','password','password2'];	    
	    req.query = req.body;
	    console.log(req.query);
	    for(var i in required)
	    {
	    	if(typeof(req.query[required[i]]) === 'undefined')
	    	{
                  data.message += required[i]+' is required<br />';
	    	}
	    }
	    //console.log(data);
	    if(data.message == '')
	    {
	    	if(!validateEmail(req.query.email))
	    	{
	    		data.message += 'Email is Invalid<br />';
	    	}	
	    }
	    //console.log(data);
	    if(data.message == '')
	    {
	    	if(req.query.password != req.query.password2 || req.query.password.length < 6)
	    	{
	    		data.message += 'Password is Invalid/Not Matched<br />';
	    	}	
	    }
	    console.log(data);
        if(data.message != '')
	    {
	    	console.log(2); 
	        res.send(JSON.stringify(data));
            res.end();
        }
        else
        {	
           q.all([common.checkuserAvailable(req,db.mysql)]).then(function(result){
	           var shortid = require('shortid');
	           var md5 = require('md5');	
	           req.query['salt'] = 	shortid.generate();
	           req.query['ref'] = 	'site';
	           req.query['ref_id'] = 0;
	           req.query['md5password'] = md5(req.query['password']+req.query['salt']);
	           if(result[0][0].length == 0)
	           {	
	           	  console.log(3);
	              q.all([common.insertUser(req,db.mysql)]).then(function(result){
	              	console.log(result[0][0]);
	                req.session.userid = result[0][0].insertId;
	       	        req.session.email = req.query['email'];
	       	        req.session.loged = true;
	       	        data.success = true;
	       	        res.send(JSON.stringify(data));
	                res.end();
	              }).fail(function (error){
					console.log("Error : "+error.stack);
					throw error;
	              }).done();
	           }
	           else
	           {
	           	   console.log(4);
	           	   data.message = 'Email Address Exists!';
	           	   res.send(JSON.stringify(data));
	               res.end();
	           }	
	            
	        }).fail(function (error){
					console.log("Error : "+error.stack);
					throw error;
	        }).done(); 
	    }    	    
  });
  action.get('/setsession/:id',function(req,res)
  {
       var q = require('q');
       q.all([common.setSession(req,db.mysql)]).then(function(result){
        var data = {};
        data.loged = false;
        if(result[0][0].length > 0)
        {
        	req.session.userid = result[0][0][0].id;
       	    req.session.email = result[0][0][0].email;
       	    req.session.loged = true;
            data = req.session;
        }	
       	res.send(JSON.stringify(data));
        res.end();
        return false;
       }).fail(function (error){
				console.log("Error : "+error.stack);
				throw error;
       }).done();
  });
  action.get('/checkuserloged',function(req,res)
  {
  	   var data = {};
  	   data.loged = (req.session.userid > 0) ? true : false;
  	   if(data.loged)
  	   {
  	   	  data = req.session;
  	   }
       res.send(JSON.stringify(data));
       res.end();
       return false;
  });
  action.get('/searchform',function(req,res){  	  
      //console.log(db.mysql);;
      var q = require('q');
      q.all([common.getSearchBooksData(req,db.mysql)]).then(function(data){
        res.send(JSON.stringify(data[0][0]));
        res.end();
        return false;
      }).fail(function (error){
				console.log("Error : "+error.stack);
				throw error;
      }).done();
   
  });
  return action;
}