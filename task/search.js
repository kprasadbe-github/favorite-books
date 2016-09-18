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