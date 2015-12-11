<h1>Captcha in your forms with AngularJS</h1>
<h2>¿How to use?</h2>
<p>Create new view file and add the next code</p>
```html
	<!DOCTYPE  html>
<html lang="es" ng-app="app">
<head>
	<meta charset="UTF-8" />
	<title>Captcha in Angular</title>
	<link rel="stylesheet"  href="normalize.css"  media="screen" />
	<link rel="stylesheet"  href="foundation.min.css" media="screen" />   
	<style type="text/css">
	.captcha p{
		display: inline;
		width: 20px;
		padding: 20px;
	}
	.resultado{
		margin-left: -30px;
		margin-bottom: 20px;
	}
	</style>
</head>
<body ng-controller="homeController">
	<form name="loginUserForm">
		<fieldset>
			<legend>Captcha con angularjs</legend>
			<div class="row">
				<div class="large-12 columns">
					<label>Email</label>
					<input type="email" required placeholder="Introduce tu email" ng-model="user.email">
				</div>
				<div class="large-12 columns">
					<label>Password</label>
					<input type="password" required placeholder="Introduce tu password" ng-model="user.password">
				</div>

				<div class="large-2 columns captcha">
					<!--add captcha to form-->
					<captcha field1="{{field1}}" operator="{{operator}}" field2="{{field2}}"></captcha>
				</div>
				<div class="large-1 columns resultado">
					<!--campoo que hace de respuesta a nuestro captcha-->
					<input ng-model="resultado" size="1" required />
				</div>

				<button type="submit" ng-disabled="!loginUserForm.$valid" ng-click="login(user)" class="button expand round">
					Login
				</button>
			</div>

		</fieldset>
	</form>
	<!--load js files angularjs, captcha.js and app.js-->
	<script type="text/javascript" src="angular.min.js"></script>
	<script type="text/javascript" src="captcha.js"></script>
	<script type="text/javascript" src="app.js"></script>
</body>
</html>
```
<h2>Check if is correctly</h2>
```js
//inject the captcha factory our module
var app = angular.module("app", ["udpCaptcha"]);

//inject the captcha factory our controller
app.controller("homeController", function($scope, $captcha)
{	
	//create a function, for example to make a login form
	//and check if the captcha passes validation
	$scope.login = function(user)
	{
		//correct
		if($captcha.checkResult($scope.resultado) == true)
		{
		 	alert("Correct");
		}
		//error captcha
		else
		{
		 	alert("Error");
		}
	}
});
```
## Visit me

* [Visit me](http://uno-de-piera.com)