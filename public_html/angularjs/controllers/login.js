/*  user log in module initialzed here *******/

var login = angular.module('login', ['ngCookies']);
login
        .constant('serverAPIURL', 'http://172.16.10.135:8081/cira/index.php/API/userLogin')//declares the api url as a constant//string

        .controller('loginCntrl', function ($scope, $rootScope, serverAPIURL, $http, $location, $cookieStore, $timeout) {
            $scope.data = {};
            $scope.data.error = false;
            $scope.data.Login = "Sign In";
            $scope.data.loginDisabled = false;
            $scope.data.userLogin = {};
            //change password field from password to text,in plain text///
            $scope.data.changeDisplayPassword = function (showPassword) {
                if (showPassword == true) {
                    $scope.data.userLogin.inputType = 'text';
                } else {

                    $scope.data.userLogin.inputType = 'password';
                }
            }
            //switches between login panel and password retrieval panel//////
            $scope.data.changeLoginpanel = function (showPassswordRetrival) {
                $scope.data.showPassswordRetrival = (!showPassswordRetrival);//changes value,but can also return
            }

            //connects to the server to check user credentials for validity////;/
            $scope.data.userLoginFxn = function (userLogin) {
                $scope.data.error = false;
                try {
                    $scope.data.loginDisabled = true;
                    $scope.data.Login = 'Signing in...';

                    if (angular.isObject(userLogin)) {
                        try {

                            $http
                                    .get(serverAPIURL + '/' + userLogin.username + '/' + userLogin.password + '?API_KEY=AIzaSyDE7TBQhMAvtpClgGjvnQsOlfbcP9')
                                    .success(function (data) {
                                        $scope.data.loginDisabled = false;
                                        $scope.data.Login = 'Sign in';
                                        if (data.status == 1) {

                                            if (data.data[0]['status'] == 0) {
                                                $scope.data.error = true;
                                                $scope.data.message = 'Sorry your account has been deactivated';
                                            } else {
                                                $cookieStore.put("username", userLogin.username);
                                                $cookieStore.put("account_type", data.data[0]['account_type']);
                                                $rootScope.user = userLogin.username;

                                                window.location = 'http://172.16.10.135:8081/flexTracker/public_html/';
                                            }
                                        } else {
                                            $scope.data.error = true;
                                            if (data.status == 0) {
                                                $scope.data.message = 'Wrong username or password';
                                            } else {
                                                $scope.data.message = 'Server offline'
                                            }
                                        }
                                    })
                                    .error(function (error) {
                                        $scope.data.loginDisabled = false;
                                        $scope.data.Login = 'Sign in';
                                        $scope.data.error = true;
                                        $scope.data.message = 'Could not connect to server,try again';
                                    })
                        } catch (e) {
                            $scope.data.error = true;
                            $scope.data.message = 'Internal server error ' + e;
                        }




                    } else {
                        console.log('Invalid data type passed' + typeof (userLogin)); //write to console for bad datatype
                    }
                } catch (e) {
                    console.log('function terminnated due to some errors' + e);
                }
            }
            ///send url password retrieval link//

            $scope.data.functionReturnURL = function (url) {
                return serverAPIURL + url;
            }
            $scope.data.requestResetCode = function (userEmailData) {


                try {
                    if (angular.isObject(userEmailData)) {
                        $http
                                .post($scope.data.functionReturnURL('getUserResetLink'), userEmailData)
                                .success(function (data) {

                                })
                                .error(function (data, callback) {

                                })
                    } else {

                    }
                } catch (e) {

                }
            }

        })
        .directive('onlineStatus', function () {

            return {
                template: "<div ng-hide='online' class='alert alert-danger col-md-12'>please check your internet connection</div>"
            }
        })
        .run(function ($window, $rootScope, $cookieStore) {
            $rootScope.online = navigator.onLine;
            $window.addEventListener("offline", function () {
                $rootScope.$apply(function () {
                    $rootScope.online = false;
                });
            }, false);

            $window.addEventListener("online", function () {
                $rootScope.$apply(function () {
                    $rootScope.online = true;
                });
            }, false);

        }).run(function ($rootScope, $cookieStore) {
    $rootScope.username = $cookieStore.get('username');
    if ($rootScope.username == '' || angular.isUndefined($rootScope.username)) {
        //window.location = 'http://172.16.10.135:8081/flexTracker/public_html/signin.html';
        console.log('should go here, you logged out mf')
    } else {
        console.log('should go here ' + $rootScope.username)
        window.location = 'http://172.16.10.135:8081/flexTracker/public_html/';
    }
})