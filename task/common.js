var q = require('q');
exports.getSearchBooksData = function(req,mysql)
{
	    console.log(req.query);
	    if(typeof(req.query['search']) === 'undefined')
	    {
	    	req.query['search'] = '';
	    }	
	    var escape_data = [parseInt(req.session.userid)];
		var strQuery = 'SELECT b.*,CONCAT(b.description,u.email,b.name,b.authour,b.published) AS data,u.email,(SELECT COUNT(id) FROM watchlist as w WHERE w.user_id = ? AND w.book_id = b.id) As watchlist FROM book AS b INNER JOIN users AS u  ON u.id = b.user_id  order by b.id desc';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
exports.setSession = function(req,mysql)
{	    
	    var id = 0;
	    if(typeof(req.params.id) !== 'undefined')
	    {
	    	id = req.params.id;
	    }	
	    var escape_data = [id];
		var strQuery = 'SELECT * FROM users where id = ?';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
exports.addWatchlist = function(req,mysql)
{	    
	    var escape_data = [req.query['id'],req.session.userid];
		var strQuery = 'INSERT INTO watchlist (book_id,user_id) VALUES(?,?)';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
exports.deleteWatchlist = function(req,mysql)
{	    
	    var escape_data = [req.query['id'],req.session.userid];
		var strQuery = 'DELETE FROM watchlist where book_id = ? and user_id = ?';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
exports.checkuserAvailable = function(req,mysql)
{	    
	    var id = 0;
	    var escape_data = [req.query['email']];
		var strQuery = 'SELECT * FROM users where email = ?';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
exports.insertUser = function(req,mysql)
{	    
	    var escape_data = [req.query['email'],req.query['md5password'],req.query['salt'],req.query['ref'],req.query['ref_id']];
		var strQuery = 'INSERT INTO users (email,password,salt,date_added,from_ref,from_ref_id) VALUES (?,?,?,NOW(),?,?)';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
exports.checkLogedUser = function(req,mysql)
{	    
	    var escape_data = [req.query['email']];
		var strQuery = 'SELECT * FROM users WHERE email = ?';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
exports.addNewProduct = function(req,mysql)
{	    
	    var escape_data = [req.query['title'],req.query['authour'],req.query['year'],req.query['desc'],req.query['isbn'],req.session.userid];
		var strQuery = 'INSERT INTO book (name,authour,published,description,isbn,date_added,user_id) VALUES(?,?,?,?,?,NOW(),?)';
	    var defered = q.defer();
		mysql.query(strQuery,escape_data,defered.makeNodeResolver());
		return defered.promise;
}
