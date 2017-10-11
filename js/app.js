var app= angular.module('ctdadminpanel',['ui.router']);
app.config(function($stateProvider,$urlRouterProvider,$locationProvider){
	$urlRouterProvider.otherwise('dashboard');
	$locationProvider.html5Mode(true);
	$stateProvider
	.state('dashboard',{
		url:'/dashboard',
		templateUrl:'./templates/dashboard.html',
		controller:'dashboardController'
	})
	.state('dashboard.mainDashboard',{
		url:'/',
		templateUrl:'./templates/mainDashboard.html',
		controller:'mainDashboardController'
	})
	.state('dashboard.tipapproval',{
		url:'/approveTips',
		templateUrl:'./templates/tipapproval.html',
		controller:'tipapprovalController'
	})
	.state('dashboard.userAuthentication',{
		url:'/userAuth',
		templateUrl:'./templates/userAuthentication.html',
		controller:'userAuthController'
	})
	.state('dashboard.readymadeCode',{
		url: '/rmc',
		templateUrl: './templates/readymadeCode.html',
		controller: 'readymadeCodeController'
	})
	.state('dashboard.addPractiseTest',{
		url: 'addPractiseTest',
		templateUrl: './templates/addPractiseTest.html',
		controller: 'addPractiseTestController'
	})
})


app.controller('dashboardController',function($scope,$rootScope,$state,$http){
	console.log("Hello Admin");
	$state.go('dashboard.mainDashboard');	
})

app.controller('mainDashboardController',function($scope,$rootScope,$state,$http){
	console.log("Hello dashboard");
	$http({
		method:'POST',
		url:'http://localhost:8080/tip/getRecentTips',
	}).then((response)=>{
		$scope.tips=response.data;
		console.log($scope.tips);
	})
	$http({
		method:'POST',
		url:'http://localhost:8080/register/findTotaluser'
	}).then((response)=>{
		$scope.reg_user=response.data;
		console.log($scope.reg_user);
	})

	$http({
		method:'POST',
		url:'http://localhost:8080/code/getRecentcodes',
	}).then((response)=>{
		$scope.codes=response.data;
		console.log($scope.codes);
	})

	$http({
		method:'POST',
		url:'http://localhost:8080/code/findTotalcode',
	}).then((response)=>{
		$scope.tot_code=response.data;
		console.log($scope.tot_code);
	})

	$http({
		method:'POST',
		url:'http://localhost:8080/tip/findTotaltip',
	}).then((response)=>{
		$scope.tot_tip=response.data;
		console.log($scope.tot_tip);
	})
})
app.controller('tipapprovalController',function($scope,$rootScope,$state,$http){
	console.log("Tip approval");
	$http({
		method:'GET',
		url:'http://localhost:8080/tip_submit/getAllTips'
	}).then((response)=>{
		console.log(response.data);
		$scope.allTips=response.data;

	})

	$scope.approve=function(val1,val2,val3,val4){
		$http({
			method:'POST',
			url:'http://localhost:8080/tip/addApprovedTips',
			data:{
				tip_heading:val1,
				tip_content:val2,
				author_name:val3,
				tip_language:val4,
			}
		}).then((response)=>{
			console.log("thanks for approving");
			$http({
				method:'POST',
				url:'http://localhost:8080/tip_submit/deleteOneTip',
				data:{
					tip_heading:val1
				}
			}).then((res)=>{
				console.log("Deleted One entry from Tip_table and added in Tipapprove");
				$http({
					method:'GET',
					url:'http://localhost:8080/tip_submit/getAllTips'
				}).then((response)=>{
					console.log(response.data);
					$scope.allTips=response.data;

				})
			})
		})
	}

	$scope.deleteTip=function(val)
	{
		$http({
			method:'POST',
			url:'http://localhost:8080/tip_submit/deleteOneTip',
			data:{
					tip_heading:val
				}
			}).then((res)=>{
				console.log("Deleted One entry from Tip_table");
				$http({
					method:'GET',
					url:'http://localhost:8080/tip_submit/getAllTips'
				}).then((response)=>{
					console.log(response.data);
					$scope.allTips=response.data;

				})
			})
	}
})

app.controller('userAuthController',function($scope,$http,$rootScope,$state){
	console.log("userAuthentication");

	$scope.display=true;
	$scope.display1=false;
	$scope.show=function()
	{
		$scope.display=false;
		$scope.display1=true;

		$http({
			method:'GET',
			url:'http://localhost:8080/register/all_users'
		}).then(function(response){
			console.log(response.data);
			$scope.user=response.data;
		})
	}

	$scope.removeauserfront=true;
	$scope.removeauserback=false;
	
	$scope.removeausershow=function()
	{
		$scope.removeauserfront=false;
		$scope.removeauserback=true;
	}

	$scope.errorshow=false;
	$scope.remove=function()
	{
		if($scope.email=="")
		{
			$scope.errorshow=true;
			$scope.error="Please enter a valid email id";
			$scope.email="";
		}
		else
		{
			$http({
				method: 'POST',
				url: 'http://localhost:8080/register/checkAUser',
				data:{
					email: $scope.email
				}
			}).then(function(response){
				console.log(response.data);
				if(response.data=="")
				{
					$scope.errorshow=true;
					$scope.error="No Such User Found!!!";
					$scope.email="";
				}
				else
				{
					$http({
						method: 'POST',
						url: 'http://localhost:8080/register/deleteAUser',
						data:{
							email: $scope.email
						}
					}).then(function(response){
						console.log("user deleted!!!");
						$scope.errorshow=true;
						alert("User Deleted!!!");
						$scope.removeauserfront=true;
						$scope.removeauserback=false;
						$scope.email="";
					})
				}
			})
		}
	}
})

app.controller('readymadeCodeController',function($scope,$http,$rootScope){
	console.log("readymadeCodeController called");
	$scope.rmcerror=null;
	$scope.submitCode=function()
	{
		if(($scope.heading=null)||($scope.desp==null)||($scope.code_type==null)||($scope.codeContent==null))
		{
			$scope.rmcerror=true;
		}
		else
		{
			$http({
				method: 'POST',
				url: 'http://localhost:8080/code/addCode',
				data:{
					heading: $scope.heading,
					desp: $scope.desp,
					code_type: $scope.code_type,
					codeContent: $scope.codeContent
				}
			}).then(function(response){
				console.log(response);
				console.log("code submitted");
				$scope.heading="";
				$scope.desp="";
				$scope.code_type="";
				$scope.codeContent="";
			})
		}
	}
});

app.controller('addPractiseTestController',function($scope,$http,$rootScope){
	console.log("addPractiseTestController called");
	
	$scope.htmlerror=false;
	$scope.csserror=false;
	$scope.javaerror=false;
	$scope.question=null;
	$scope.option1=null;
	$scope.option2=null;
	$scope.option3=null;
	$scope.option4=null;
	$scope.addHtmlQues=function()
	{
		if(($scope.question==null)||($scope.option1==null)||($scope.option2==null)||($scope.option3==null)||($scope.option4==null))
		{
			$scope.htmlerror=true;
		}
		else
		{
			$http({
				method: 'POST',
				url: 'http://localhost:8080/addtestQues/addQues',
				data:{
					language: 'HTML',
					question: $scope.question,
					option1: $scope.option1,
					option2: $scope.option2,
					option3: $scope.option3,
					option4: $scope.option4
				}
			}).then(function(response){
				console.log("question added");
				$scope.question="";
				$scope.option1="";
				$scope.option2="";
				$scope.option3="";
				$scope.option4="";
			})

			$http({
				method: 'POST',
				url: 'http://localhost:8080/addtestQues/getLatestQuesAdded',
				data:{
					language:'HTML'
				}
			}).then(function(response){
				console.log(response);
				$scope.htmlquestions=response.data;
			})
		}
	}

	$scope.addCSSQues=function()
	{
		if(($scope.question==null)||($scope.option1==null)||($scope.option2==null)||($scope.option3==null)||($scope.option4==null))
		{
			$scope.csserror=true;
		}
		else
		{
			$http({
				method: 'POST',
				url: 'http://localhost:8080/addtestQues/addQues',
				data:{
					language: 'CSS',
					question: $scope.question,
					option1: $scope.option1,
					option2: $scope.option2,
					option3: $scope.option3,
					option4: $scope.option4
				}
			}).then(function(response){
				console.log("question added");
				$scope.question="";
				$scope.option1="";
				$scope.option2="";
				$scope.option3="";
				$scope.option4="";
			})

			$http({
				method: 'POST',
				url: 'http://localhost:8080/addtestQues/getLatestQuesAdded',
				data:{
					language:'CSS'
				}
			}).then(function(response){
				console.log(response);
				$scope.cssquestions=response.data;
			})
		}	
	}

	$scope.addJavaQues=function()
	{
		if(($scope.question==null)||($scope.option1==null)||($scope.option2==null)||($scope.option3==null)||($scope.option4==null))
		{
			$scope.javaerror=true;
		}
		else
		{
			$http({
				method: 'POST',
				url: 'http://localhost:8080/addtestQues/addQues',
				data:{
					language: 'Java',
					question: $scope.question,
					option1: $scope.option1,
					option2: $scope.option2,
					option3: $scope.option3,
					option4: $scope.option4
				}
			}).then(function(response){
				console.log("question added");
				$scope.question="";
				$scope.option1="";
				$scope.option2="";
				$scope.option3="";
				$scope.option4="";
			})

			$http({
				method: 'POST',
				url: 'http://localhost:8080/addtestQues/getLatestQuesAdded',
				data:{
					language:'Java'
				}
			}).then(function(response){
				console.log(response);
				$scope.javaquestions=response.data;
			})
		}
	}
})