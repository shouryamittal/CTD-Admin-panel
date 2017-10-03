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
})


app.controller('dashboardController',function($scope,$rootScope,$state,$http){
	console.log("Hello Admin");
	$state.go('dashboard.mainDashboard')	
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
})