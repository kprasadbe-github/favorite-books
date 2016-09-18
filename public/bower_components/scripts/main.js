var app = angular.module('app',['ui.router']);
function logeAuthService($http,$rootScope)
{
    this.checkUserLoged = function()
    {
    	$http.get('/checkuserloged').then(function(response){
    	  $rootScope.loged = response.data.loged;
    	  if(response.data.loged)
    	  {
    	  	$rootScope.name = response.data.email;
    	  }
    	  else
    	  {
            $rootScope.name = '';
    	  }    	  
    	  console.log(response.data);
        });
    }; 	  
}
function head($scope,$rootScope,$http,logeAuthService)
{
	 $rootScope.title = 'Book Catalogue Search';
	 $rootScope.description = 'Search a Book Catalogue through ISBN or Title or Authour Or Description'
	 $rootScope.loged = false;
	 $rootScope.checkup = 0;
	 $rootScope.name = '';
	 $rootScope.logout = function()
	 {
	 	$http.get('/logout').then(function(){
	 		logeAuthService.checkUserLoged();
	 	});
	 }
}
function add($scope,$rootScope,$http,logeAuthService)
{
   $scope.error = false;
   $scope.errorMessage = '';
   $scope.addnew = function()
   {
       $scope.errorMessage = '';  
   	   var req = {
		  	         method:'POST',
		             url:'/addform',
					 data:{
					 	title:$scope.title,
					 	desc:$scope.desc,
					 	authour:$scope.authour,
					 	year:$scope.year,
					 	isbn:$scope.isbn
					 }
		          };
		console.log(req);          
        $http(req).then(function(response)
        {
        	console.log(response);
             if(response.data.success)
             {
             	 $scope.error = true;
                 $scope.errorMessage = 'Project Added Successfully';
                 window.setTimeout(function(){
                   window.location.href = '/index/';
                 },2000);
               	 
             } 
             else
             {
             	 $scope.error = true;
                 $scope.errorMessage = response.data.message;
             }     
        });
   	  
   }
}
function signup($scope,$rootScope,$http,logeAuthService)
{
   $scope.error = false;	
   $scope.$watchGroup(['username','password'],function()
   {
   	 $scope.error = false;
   });
   $scope.errorMessage = '';	
   $scope.signupform = function()
   {

   	   if($scope.username == '' || $scope.password == '')
   	   {
   	   	 $scope.error = true;
   	   	 return true; 
   	   }
   	   //console.log($scope);
       $scope.errorMessage = '';  
   	   var req = {
		  	         method:'POST',
		             url:'/signupform',
					 data: { 
					 	     'email': $scope.username,
					 	     'password': $scope.password,
					 	     'password2': $scope.password2
					  }
		          };
        $http(req).then(function(response)
        {
        	console.log(response);
             if(response.data.success)
             {
               	 window.location.href = '/index/';
             } 
             else
             {
             	 $scope.error = true;
                 $scope.errorMessage = response.data.message;
             }     
        });
   	  
    }
}
function login($scope,$rootScope,$http,logeAuthService)
{
   $scope.error = false;	
   $scope.$watchGroup(['username','password'],function()
   {
   	 $scope.error = false;
   });
   $scope.errorMessage = '';	
   $scope.loginform = function()
   {
       $scope.error = false; 
   	   if($scope.username == '' || $scope.password == '')
   	   {
   	   	 $scope.error = true; 
   	   	 return true;
   	   }
   	   	  var req = {
		  	         method:'POST',
		             url:'/loginform',
					 data: { 
					 	     'email': $scope.username,
					 	     'password': $scope.password
					  }
		            };
          $http(req).then(function(response)
          {
          	 console.log(response);
             if(response.data.success)
             {
               	 window.location.href = '/index/';
             } 
             else
             {
             	 $scope.error = true;
                 $scope.errorMessage = response.data.message;
             }
          });
   	   	
   }
}
function searchBooks($scope,$rootScope,$http)
{
	/*$scope.books = [{
		'name' : 'Davinci Code',
		'authour' : 'Mathew',
		'isbn' : 123,
		'details' : 'Well Exeuted Book',
		'published' : '2009'
	},
	{
		'name' : 'Davinci Code',
		'authour' : 'Mathew',
		'isbn' : 456,
		'details' : 'Well Exeuted Book',
		'published' : '2009'
	},
	{
		'name' : 'Davinci Code',
		'authour' : 'Mathew',
		'isbn' : 678,
		'details' : 'Well Exeuted Book',
		'published' : '2009'
	}];*/

	$scope.books = [];
	$scope.searchBooks = function()
	{
		  var req = {
		  	         method:'GET',
		             url:'/searchform',
		             headers: {
					   'Content-Type': 'JSON'
					 },
					 data: { search: $scope.search }
		            };
          $http(req).then(function(response)
          {
             $scope.books = response.data;      
          });

	}
	$scope.watchlist = function(id,add)
	{
		  var req = {
		  	         method:'GET',
		             url:'/watchlist?id='+id+'&add='+add
		            };

          $http(req).then(function(response)
          {
          	 console.log(response);
             $scope.searchBooks();      
          });

	}
	$scope.searchBooks();
}

app.service('logeAuthService',logeAuthService);
app.controller('head',head);
app.controller('login',login);
app.controller('signup',signup);
app.controller('add',add);
app.controller('searchbooks',searchBooks);
app.config(function($stateProvider, $urlRouterProvider,$locationProvider) {  
  $stateProvider.state('index', {   
     url:'/index/',
         views :{
		 'header':{templateUrl:'/templates/static/header.html'},
		 'content':{templateUrl:'/templates/static/home.html'},	
		 'footer':{templateUrl:'/templates/static/footer.html'}
     },
     resolve:{
          user: function($stateParams, logeAuthService) {
		      return logeAuthService.checkUserLoged();
		  }
     }   
  }).state('login', {   
     url:'/login/',
         views :{
		 'header':{templateUrl:'/templates/static/header.html'},
		 'content':{templateUrl:'/templates/static/login.html'},	
		 'footer':{templateUrl:'/templates/static/footer.html'}
     }
   }).state('signup', {   
     url:'/signup/',
         views :{
		 'header':{templateUrl:'/templates/static/header.html'},
		 'content':{templateUrl:'/templates/static/signup.html'},	
		 'footer':{templateUrl:'/templates/static/footer.html'}
     }
   }).state('add', {   
     url:'/add/',
         views :{
		 'header':{templateUrl:'/templates/static/header.html'},
		 'content':{templateUrl:'/templates/static/add.html'},	
		 'footer':{templateUrl:'/templates/static/footer.html'}
     }
   });  
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise("/index/");
});