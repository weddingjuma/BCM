

var mainModule = angular.module('mainModule', ['ngRoute', 'ngCookies', 'customModuleFilter', 'angularUtils.directives.dirPagination', 'ui.calendar', 'ui.bootstrap']);

mainModule.config(function ($routeProvider, $httpProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

    $routeProvider.when("/login", {
        templateUrl: "partialViews/login.html",
        controller: 'login'
    });
    $routeProvider.when("/userDayOperations", {
        templateUrl: "partialViews/userDayOperations.html"
    });
     $routeProvider.when("/chat", {
        templateUrl: "partialViews/onlineUsers.html"
    });
    $routeProvider.when("/accounts", {
        templateUrl: "partialViews/accounts.html"
    });
    $routeProvider.when("/approveCerts", {
        templateUrl: "partialViews/approveCerts.html"
    });
    $routeProvider.when("/accInv", {
        templateUrl: "partialViews/accInv.html"
    });
    $routeProvider.when("/fleetClients", {
        templateUrl: "partialViews/fleetClients.html"
    });
    $routeProvider.when("/locations", {
        templateUrl: "partialViews/locationPicker.html"
    });
    $routeProvider.when("/changePassword", {
        templateUrl: "partialViews/changePassword.html"
    });
    $routeProvider.when("/viewVehicleDetails", {
        templateUrl: "partialViews/viewVehicleDetails.html"
    });
    $routeProvider.when("/viewCustomerDetails", {
        templateUrl: "partialViews/viewCustomerDetails.html"
    });
    $routeProvider.when("/customers", {
        templateUrl: "partialViews/customers.html",
        controller: 'login'
    });
    $routeProvider.when("/devices", {
        templateUrl: "partialViews/devices.html"
    });
    $routeProvider.when("/approveCertificates", {
        templateUrl: "partialViews/approveCerts.html"
    });
    $routeProvider.when("/checker", {
        templateUrl: "partialViews/checker.html",
        controller: 'login'
    });
    $routeProvider.when("/vehicles", {
        templateUrl: "partialViews/vehicles.html"
    });
    $routeProvider.when("/notify", {
        templateUrl: "partialViews/notify.html"
    });
    $routeProvider.when("/insurance", {
        templateUrl: "partialViews/insurors.html"
    });

    $routeProvider.when("/financier", {
        templateUrl: "partialViews/financier.html"
    });
    $routeProvider.when("/cv", {
        templateUrl: "partialViews/cv.html"
    });
    $routeProvider.when("/printReceipt", {
        templateUrl: "partialViews/cv.html"
    });
    $routeProvider.when("/calendar", {
        templateUrl: "partialViews/calendar.html"
    });
    $routeProvider.when("/company", {
        templateUrl: "partialViews/company.html"
    });
    $routeProvider.when("/reprint", {
        templateUrl: "partialViews/reprint.html"
    });
    $routeProvider.when("/certificates", {
        templateUrl: "partialViews/certificates.html"
    });
    $routeProvider.when("/governor", {
        templateUrl: "partialViews/governor.html"
    });
    $routeProvider.when("/profile", {
        templateUrl: "partialViews/profile.html"
    });

    $routeProvider.when("/emailCert", {
        templateUrl: "partialViews/emailCert.html"
    });
    $routeProvider.when("/payments", {
        templateUrl: "partialViews/payments.html"
    });
    $routeProvider.when("/tickets", {
        templateUrl: "partialViews/tickets.html"
    });
    $routeProvider.when("/todo", {
        templateUrl: "partialViews/todoList.html"
    });
 $routeProvider.when("/myDayWork", {
        templateUrl: "partialViews/userEndOfDayReport.html"
    });
    $routeProvider.otherwise({
        templateUrl: "partialViews/todoList.html"
    })


})

//mainModule.constant('serverURL', 'http://172.16.10.25:8088/BCMBE/index.php/API/')

mainModule.constant('serverURL','http://localhost:8081/bcm/public_html/bcmbe/index.php/api/')
mainModule.constant('serverURLGTS', 'http://172.16.10.135:8081/cira/API/')
mainModule.controller('mainController', function ($scope, $cookieStore, $http, serverURL,
        SERVER_CONSTANTS, $rootScope, $location, serverURLGTS, fetchAPIDataService) {
    $scope.data = {};

    $scope.currentPage = 1;
    $scope.pageSize = 15;
    $scope.meals = [];
    $rootScope.globalVariable = {};
    $rootScope.globalVariable = {
        responseStatus: false,
        message: ''
    };

    $('.popper').popover({
        placement: 'bottom',
        container: 'body',
        html: true,
        title: 'Header',
        content: function () {
            return $(this).next('.popper-content').html();
        }
    });




    $scope.data.getMenus = function () {

        try {
            var url = serverURL + 'getMenus';
            $http.get(url)
                    .success(function (data) {
                        if (data.status) {

                        }
                    })
                    .error(function (error) {

                    })
        } catch (e) {

        }
    }
    $scope.data.keyIput = '/^[a-zA-Z0-9 ]*$/';

    $scope.data.createFailLogs = function (errorOccured) {
        var error = {};
        error.exceptionError = 'Error message => ' + errorOccured;
        console.log(error.exceptionError);
        var url = serverURL + 'saveExceptionToFile';
        try {
            $http.
                    post(url, error)
                    .success(function (data) {
                        console.log(data);
                    })

        } catch (e) {
            console.log(e)
        }
    }
    $scope.data = {
        portfolioData: {}
    }
    $scope.data.logout = function () {
        $rootScope.fullnames = $cookieStore.remove('fullnames');
        $rootScope.username = $cookieStore.remove('username');
        $rootScope.username = $cookieStore.remove('groupId');
        $rootScope.username = $cookieStore.remove('loggedStatus');
        $cookieStore.remove("currentCustomerId");
        $cookieStore.remove("currentCustomerName");
        $scope.data.menus = {};

        $rootScope.loggedStatus = $cookieStore.remove('loggedStatus');
        if (angular.isUndefined($rootScope.loggedStatus) || $rootScope.loggedStatus == false) {

            $location.path("/login");
        }


    }
    $scope.data.modalHeaderColor = 'green';
    $scope.data.modalHeader = 'Modal up';


    $scope.data.menus = {};

    $scope.data.getUserMenus = function () {

        try {
            if (angular.isUndefined($scope.data.menus.length)) {
                var user = {};
                user.groupId = $cookieStore.get('groupId');
                var url = serverURL + '/fetchMenus'
                console.log('data absent')
                $http.
                        post(url, user)
                        .success(function (data) {
                            if (data.status == 1) {

                                $scope.data.menus = data.data;

                                $scope.$broadcast('menusEvent', {data: data.data});

                            } else {
                                $location.path("/notify");
                            }
                        })
                        .error(function (error) {
                            $scope.data.createFailLogs(error);
                        })
            } else {

                $scope.$broadcast('menusEvent', {data: $scope.data.menus});
            }
        } catch (e) {
            $scope.data.createFailLogs(e);
        }


    }
    $scope.data.allMenus = {};
    $scope.data.getAllMenus = function () {

        try {
            var user = {};

            var url = serverURL + '/fetchAllMenu'

            $http.
                    get(url)
                    .success(function (data) {
                        if (data.status == 1) {

                            $scope.data.allMenus = data.data;
                        } else {
                            $location.path("/notify");
                        }
                    })
                    .error(function (error) {
                        $scope.data.createFailLogs(error);
                    })
        } catch (e) {
            $scope.data.createFailLogs(e);
        }


    }






    $scope.data.getPortFolios = function () {

        try {
            var url = serverURL + '/getPortfolio';
            $http.
                    get(url)
                    .success(function (data) {
                        if (data.status == 1) {
                            $scope.data.portfolioData = data.data;
                        } else {
                            $rootScope.globalVariable = {
                                responseStatus: true,
                                message: data.message
                            };
                        }

                    })
                    .error(function (e) {

                    })

        } catch (e) {
            $scope.data.createFailLogs(e)
        }
    }

    $scope.data.convertToHumanTime = function (unixTime)
    {
        if (unixTime > 0) {
            var date = fetchAPIDataService.decodeUnixDate(unixTime);
            return date.substring(0, 11);
        } else {
            return 'N/A';
        }
    }



    $scope.data.accountAssets = {}
    $scope.data.assetAccount = '';
    $scope.data.assetDescription = '';
    $scope.data.pickRandomColorPicked = 'green';
    $scope.data.customerResults = function (accountId, description) {
        $rootScope.globalVariable = {
            responseStatus: true,
            message: 'Fetching asset for ' + accountId + ' please wait '
        };

        $scope.data.pickRandomColor();
        $scope.data.getRandomCode();

        $scope.data.assetAccount = accountId;
        $scope.data.assetDescription = description;
        var accountID = {};
        accountID.accountID = accountId;
        $scope.$broadcast('assetAccount', {data: $scope.data.assetAccount});
    }
    $scope.data.getRandomCode = function () {
        var text = "";

        var possible = "0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        $scope.data.globalSettings.code = text;
        return text;
    }

    $scope.data.getRandomCodeSpec = function () {
        var text = "";

        var possible = "0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }



    $scope.data.fetchAssets = function (accountId, description) {

        $rootScope.globalVariable = {
            responseStatus: true,
            message: 'Fetching asset for ' + accountId + ' please wait '
        };

        $scope.data.pickRandomColor();
        $scope.data.assetAccount = accountId;
        $scope.data.assetDescription = description;
        var accountID = {};
        accountID.accountID = accountId;

        try {
            var url = serverURLGTS + 'getAccountAssets'
            $http.
                    post(url, accountID)
                    .success(function (data) {
                        console.log(data.data)
                        if (data.status == 1) {
                            $rootScope.globalVariable = {
                                responseStatus: false,
                                message: 'data okay'
                            };
                            console.log(data.status);
                            $scope.data.accountAssets = data.data;
                        } else {
                            $scope.data.accountAssets = {};
                            $rootScope.globalVariable = {
                                responseStatus: true,
                                message: data.message
                            };
                        }
                    })

        } catch (e) {

            $scope.data.createFailLogs(e)

        }
    }
    $scope.data.currentDateTime = function () {

        return Date();

    }

    $scope.data.returnSubstring = function (string, endPosition) {

        return string.substring(0, endPosition);
    }








//    $rootScope.$watch('loggedStatus', function () {
//        if ($rootScope.loggedStatus == false) {
//            $location.path("/login");
//        }
//    })


    $scope.data.fullMenu = $cookieStore.get('fullMenu');
    if (!$cookieStore.get('fullMenu')) {
        $scope.data.mainDiv = 'col-xs-12';
    } else {
        $scope.data.mainDiv = 'col-xs-10';
    }
    $scope.data.toggleMenu = function () {
        var menu = !$cookieStore.get('fullMenu')
        $cookieStore.put('fullMenu', menu);
        $scope.data.fullMenu = menu;

        if (!$scope.data.fullMenu) {
            $scope.data.mainDiv = 'col-xs-12';
        } else {
            $scope.data.mainDiv = 'col-xs-10';
        }

    }

    $scope.data.unique_id = 0;
    $scope.data.showSpinner = false;
    $scope.data.showGritter = function (msg, onMsg) {
        var message = '';
        var status = '';
        var sticky = false;
        var ui = $scope.data.unique_id > 0 ? $scope.data.unique_id : 0;
        function showSpinner() {
            if (ui > 0) {
                $.gritter.remove(ui, {
                    fade: true,
                    speed: 'fast'// optional
                });
            }
        }

        showSpinner();



        if (msg == 0) {
            message = 'Error performing database operation ' + onMsg;
            ;
            status = 'Error';
            sticky = true;
        } else if (msg == 1) {
            //  message = 'Success Fetching data';
            //  status = 'Success';
            $scope.data.showSpinner = false;
        } else if (msg == 2) {
            message = 'No data is available';
            status = 'Alert';
            $scope.data.showSpinner = false;
        } else if (msg == 3) {
            $scope.data.showSpinner = true;

            // message = 'Data fetching data,please wait'
            // status = 'Notice';
            // sticky = true;
        } else if (msg == 4) {
            message = 'Request in progress,please wait'
            status = 'Progress';
        } else if (msg == 5) {
            message = 'Saving data,please wait'
            status = 'Progress';
            sticky = true;
        } else if (msg == 6) {
            message = 'Data Saved successfully'
            status = 'Success';
            sticky = false;
            $scope.data.showSpinner = false;
        } else if (msg == 20) {
            message = 'Email successfully sent to client'
            status = 'Success';
            sticky = false;
        } else if (msg == 21) {
            message = 'Could not send the email attached, please try again'
            status = 'Error';
            sticky = true;
        } else if (msg == 8) {
            message = 'Error reading current data,please reload page'
            status = 'Error';
            sticky = true;
        } else if (msg == 10) {
            message = 'Invalid code syntax,threw Exception'
            status = 'Error';
            sticky = true;
        } else if (msg == 11) {
            message = 'PDF certificate generated , awaiting approval';
            status = 'Success';
            sticky = true;
        } else if (msg == 54) {
            message = 'PDF certificate has been re-generated';
            status = 'Success';
            sticky = true;
        } else if (msg == 12) {
            message = 'Required fields missing or have incorrect values'
            status = 'Error';
            sticky = true;
        } else if (msg == 13) {
            message = 'Operation was successful'
            status = 'Success';
            sticky = true;
        } else if (msg == 30) {
            message = 'You cant close this ticket before official date'
            status = 'Alert';
            sticky = true;
        } else if (msg == 31) {
            message = 'Please reload page for changes to take place'
            status = 'Alert';
            sticky = true;
        } else if (msg == 23) {
            message = 'User already has 5 tickets'
            status = 'Alert';
            sticky = true;
        } else if (msg == 99) {
            message = onMsg
            status = 'Notice';
            sticky = true;
        } else {
            message = onMsg;
            status = 'Error';
            sticky = true;
        }

        $scope.$on('keydown', function (msg, code) {
            $scope.keys.forEach(function (o) {
                if (o.code !== code) {
                    return;
                }
                o.action();
                $scope.$apply();
            });
        });

        function createSticky() {
            $scope.data.unique_id = $.gritter.add({
                title: status,
                text: message,
                sticky: sticky,
                time: ''
            });
        }
        if (msg == 3 || msg == 1) {

        } else {
            createSticky();
        }



    }




})
        .controller('CalendarCtrl',
                function ($scope, $compile, $timeout, uiCalendarConfig, $cookieStore, $http, serverURL,
                        SERVER_CONSTANTS, $rootScope, $location, serverURLGTS, fetchAPIDataService) {
                    var date = new Date();
                    var d = date.getDate();
                    var m = date.getMonth();
                    var y = date.getFullYear();

                    $scope.changeTo = 'Kiswahili';
                    /* event source that pulls from google.com */
                    $scope.eventSource = {
                        url: "",
                        className: 'gcal-event', // an option!
                        currentTimezone: 'America/Chicago' // an option!
                    };
                    /* event source that contains custom events on the scope */
                    $scope.data.totalEvents = 0;

                    $scope.data.returnDateToday = function () {

                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();

                        if (dd < 10) {
                            dd = '0' + dd
                        }

                        if (mm < 10) {
                            mm = '0' + mm
                        }

                        today = mm + '/' + dd + '/' + yyyy;


                        var dateString = fetchAPIDataService.returnStringDate(today)
                        return dateString;

                    }
                    $scope.data.todayDate = (Number($scope.data.returnDateToday()) - (24 * 60 * 60));
                    $scope.data.functionCountDayTickets = function (dateDue) {
                        var dateStringStartToday = $scope.data.returnDateToday();
                        var dateStringEndToday = Number($scope.data.returnDateToday()) + (24 * 60 * 60);


                        if (dateDue > dateStringStartToday && Number(dateDue) < dateStringEndToday) {
                            $scope.data.totalEvents += 1;
                        }



                    }
                    $scope.events = [];
                    $scope.data.showCalendar = false;

                    $scope.data.createEventsArray = function (tickets) {

                        var tempArray = [];
                        var ticketCounter = 0;
                        if ($scope.events.length == 0) {
                            for (var i = 0; i < tickets.length; i++) {
                                if (tickets[i]['issue'] == 'RECHECK' || tickets[i]['issue'] == 'NEW INSTALLATION' || tickets[i]['issue'] == 'REPLACEMENT') {
                                    if (tickets[i]['assignedTo'] == 'NONE') {

                                    } else {

                                        tempArray = [];
                                        tempArray['id'] = tickets[i]['id'];
                                        tempArray['title'] = tickets[i]['issue'] + " | LOCATION : " + tickets[i]['location'];
                                        tempArray['desc'] = tickets[i]['desc'];
                                        tempArray['location'] = tickets[i]['location'];
                                        tempArray['start'] = $scope.data.convertToHumanTime(Number(tickets[i]['dateDue'])+ (24 * 3600));
                                        tempArray['end'] = $scope.data.convertToHumanTime(Number(tickets[i]['dateDue']) + (26 * 3600));
                                        tempArray['allDay'] = false;
                                        tempArray['url'] = '';
                                        tempArray['assignedTo'] = tickets[i]['assignedTo'];
                                        tempArray['regNo'] = tickets[i]['regNo'];
                                        tempArray['closedFlag'] = tickets[i]['closedFlag'];
                                        $scope.data.functionCountDayTickets(tickets[i]['dateDue']);
                                        console.log(tempArray);
                                        $scope.events.push(tempArray);
                                        ticketCounter++;
                                    }
                                }
                                //  console.log($scope.events)
                            }
                            console.log($scope.events);
                        } else if (tickets.length != $scope.events.length) {
                            console.log(tickets.length + ' ' + $scope.events.length)
                            for (var i = 0; i < tickets.length; i++) {
                                for (var j = 0; j < $scope.events.length; j++) {
                                    if (tickets[i]['id'] != $scope.events[j]['id']) {
                                        tempArray = [];
                                        tempArray['id'] = tickets[i]['id'];
                                        tempArray['title'] = tickets[i]['issue'];
                                        tempArray['desc'] = tickets[i]['desc'];
                                        tempArray['start'] = $scope.data.convertToHumanTime(Number(tickets[i]['dateDue']));
                                        tempArray['end'] = $scope.data.convertToHumanTime(Number(tickets[i]['dateDue']) + (2 * 3600));
                                        tempArray['allDay'] = false;
                                        tempArray['url'] = '';
                                        tempArray['regNo'] = tickets[i]['regNo'];
                                        tempArray['assignedTo'] = tickets[i]['assignedTo'];
                                        tempArray['closedFlag'] = tickets[i]['closedFlag'];
                                        $scope.events.push(tempArray);

                                    }
                                }
                            }
                        }



                    }
//                    $scope.$watchCollection('data', function () {
//                        console.log('changed');
//                    })

                    $scope.data.createEvents = function () {
                        try {
                            var url = serverURL + 'getTicketsCalendar';
                            $scope.data.showGritter(3);


                            $http.get(url)
                                    .success(function (data) {

                                        if (data.status == 1) {
                                            $scope.data.showGritter(1);
                                            $scope.modalData.tickets = data.data

                                            $scope.data.createEventsArray($scope.modalData.tickets)
                                            $scope.modalData.noData = false;
                                            $scope.eventsF();
                                        } else {
                                            $scope.data.showGritter(2);
                                            $scope.modalData.tickets = true;
                                            $scope.modalData.customerDetails = '';
                                        }
                                    })
                                    .error(function (error) {
                                        $scope.data.showGritter(0);
                                    })


                        } catch (e) {

                        }

                    }




                    /* event source that calls a function on every view switch */
                    $scope.eventsF = function (start, end, timezone, callback) {
                        $scope.data.showCalendar = false;
                        var s = new Date(start).getTime() / 1000;
                        var e = new Date(end).getTime() / 1000;
                        var m = new Date(start).getMonth();
                        var events = [{title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed']}];
                        $scope.data.showCalendar = true;
                        try {
                            callback(events);
                        } catch (e) {

                        }

                    };

                    $scope.calEventsExt = {
                        color: '#f00',
                        textColor: 'yellow',
                        events: [
                            {type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false},
                            {type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false},
                            {type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/'}
                        ]
                    };
                    /* alert on eventClick */
                    $scope.data.classAlert = '';
                    $scope.alertOnEventClick = function (date, jsEvent, view) {

                        $scope.alertMessage = (date.title + " | Assgined To : " + date.assignedTo + " | Reg No :" + date.regNo);
                        $scope.data.classAlert = $scope.modalData.returnRowClass(date.id, date.closedFlag, 1);
                    };
                    /* alert on Drop */
                    $scope.data.updateTicketChanges = function (ticketChanges) {

                        try {
                            var data = {};
                            data.dateDue = returnStringDate(ticketChanges.start) + (ticketChanges.days * 24 * 60 * 60);
                            console.log('after i add anything' + data.dateDue)
                            if ($scope.events.length > 0) {

                                for (var i = 0; i < $scope.events.length; i++) {
                                    if (data.dateDue > 0) {
                                        if ($scope.events[i]['id'] == ticketChanges.id) {
                                            $scope.events[i]['start'] = new Date($scope.data.convertToHumanTime(data.dateDue) - (22 * 60 * 60));
                                            $scope.events[i]['end'] = new Date($scope.data.convertToHumanTime(data.dateDue) - (24 * 60 * 60));
                                            console.log('After everything' + $scope.events[i]['start']);
                                            $scope.data.saveUpdate(data, ticketChanges.id, 'TBL_SIMPLE_TICKETS')
                                            break;

                                        }
                                    } else {
                                        $scope.data.showGritter(31);
                                    }
                                }
                            }



                        } catch (e) {
                            console.log(e)
                        }

                    }
                    function returnStringDate(dateString) {

                        if (dateString != 0)
                        {
                            var d = Date.parse(dateString) / 1000

                            return (d);
                        } else {
                            return 1;
                        }
                    }

                    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
                        var updateDayChange = {};
                        updateDayChange.id = event.id;
                        console.log(event.start);
                        updateDayChange.start = event.start._i;
                        updateDayChange.days = delta._days;
                        console.log(updateDayChange.start)

                        $scope.data.updateTicketChanges(updateDayChange);
                        var direction = '';
                        if (updateDayChange.dateDue < 0) {
                            direction = 'Backward';
                        } else {
                            direction = 'Forward';
                        }

                        $scope.alertMessage = ('Ticket ' + event.title + ' Has been moved ' + direction + '  by ' + delta._days + ' day(s)');


                    };
                    /* alert on Resize */
                    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
                        $scope.alertMessage = ('Ticket time has been change');
                    };
                    /* add and removes an event source of choice */
                    $scope.addRemoveEventSource = function (sources, source) {
                        var canAdd = 0;
                        angular.forEach(sources, function (value, key) {
                            if (sources[key] === source) {
                                sources.splice(key, 1);
                                canAdd = 1;
                            }
                        });
                        if (canAdd === 0) {
                            sources.push(source);
                        }
                    };
                    /* add custom event*/
                    $scope.addEvent = function () {
                        $scope.events.push({
                            title: 'New Ticket',
                            start: new Date(),
                            end: new Date(),
                            className: ['openSesame']
                        });
                    };
                    /* remove event */
                    $scope.remove = function (index) {
                        $scope.events.splice(index, 1);
                    };
                    /* Change View */
                    $scope.changeView = function (view, calendar) {
                        console.log(view)
                        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
                    };
                    /* Change View */
                    $scope.renderCalender = function (calendar) {
                        $timeout(function () {
                            if (uiCalendarConfig.calendars[calendar]) {
                                uiCalendarConfig.calendars[calendar].fullCalendar('render', 'agendaWeek');
                            }
                        });
                    };
                    /* Render Tooltip */
                    $scope.eventRender = function (event, element, view) {
                        // console.log(view)
                        element.attr({'tooltip': event.title + ' ' + event.location,
                            'tooltip-append-to-body': true});
                        $compile(element)($scope);
                    };
                    /* config object */
                    $scope.uiConfig = {
                        calendar: {
                            height: 450,
                            editable: true,
                            defaultView: 'agendaDay',
                            header: {
                                left: 'title',
                                center: '',
                                right: ' month basicWeek basicDay agendaWeek agendaDay today prev,next'
                            },
                            eventClick: $scope.alertOnEventClick,
                            eventDrop: $scope.alertOnDrop,
                            eventResize: $scope.alertOnResize,
                            eventRender: $scope.eventRender
                        }
                    };

                    $scope.changeLang = function () {
                        if ($scope.changeTo === 'Kiswahili') {
                            $scope.uiConfig.calendar.dayNames = ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alamisi", "Ijumaa", "Jumamosi"];
                            $scope.uiConfig.calendar.dayNamesShort = ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alamisi", "Ijumaa", "Jumamosi"];
                            $scope.changeTo = 'English';
                        } else {
                            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                            $scope.changeTo = 'Kiswahili';
                        }
                    };
                    /* event sources array*/
                    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
                    //$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
                })


        .controller('login', function ($scope, $cookieStore, $http, serverURL, SERVER_CONSTANTS, $location, $rootScope) {
            $scope.data.loginData = {};
            $scope.data.loginData.signName = 'Submit Login Details';
            $scope.data.loginData.signinDisabled = false;
            $scope.data.loginData.responseStatus = false;
            $scope.data.loginData.responseMessage = '';
            $scope.data.loginData.responseStyle = '';
            $scope.data.login = function (loginData) {
                $scope.data.loginData.responseStatus = false;
                $scope.data.loginData.signinDisabled = true;
                $scope.data.loginData.signName = 'Submitting Login Details';
                var url = serverURL + 'userLogin';
                try {
                    $http.post(url, loginData)
                            .success(function (data) {
                              
                                if (data.status == 1) {


                                    $cookieStore.put("username", data.data.username);
                                    $cookieStore.put("groupId", data.data.groupId);

                                    $cookieStore.put("loggedStatus", data.data.loggedStatus);
                                    $cookieStore.put("fullnames", data.data.fullnames);
                                    $cookieStore.put("timeLoggedIn", data.data.timeLoggedIn);
                                    $cookieStore.put("id", data.data.id);
                                    $cookieStore.put("changePassword", data.data.cp);
                                    $cookieStore.put('fullMenu', false);
                                    $rootScope.username = data.data.username;
                                    $rootScope.loggedStatus = data.data.loggedStatus;
                                    $rootScope.fullnames = data.data.fullnames;
                                    $rootScope.id = data.data.id;

                                    $scope.data.getUserMenus();

                                    if (data.data.cp == 0) {
                                        $location.path("/changePassword");
                                    } else {
                                        $location.path("/todo");
                                    }


                                    $scope.data.loginData.signinDisabled = false;
                                    $scope.data.loginData.signName = 'Submitting Login Details';

                                } else {
                                    $scope.data.loginData.signinDisabled = false;
                                    $scope.data.loginData.signName = 'Submit Login Details';
                                    $scope.data.loginData.responseStatus = true;
                                    $scope.data.loginData.responseMessage = data.message;
                                    $scope.data.loginData.messageStyle = SERVER_CONSTANTS;
                                }
                            })
                            .error(function (error) {
                                console.log(error);
                                $scope.data.loginData.signinDisabled = false;
                                $scope.data.loginData.signName = 'Submit Login Details';
                                $scope.data.loginData.responseStatus = true;
                                $scope.data.loginData.responseMessage = 'Server error,please try again';
                                //$scope.data.createFailLogs('SERVER_ERROR' + error);

                            })

                } catch (e) {

                    $scope.data.createFailLogs(e);
                }
            }
        })
        .run(function ($rootScope, $cookieStore, $location) {

        }).run(function ($rootScope, $location, $cookieStore) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {

        $rootScope.loggedStatus = $cookieStore.get('loggedStatus');
        if ($rootScope.loggedStatus == true) {
            var cp = $cookieStore.get('changePassword');
            if (cp == 0) {
                $location.path("/changePassword");
            }
            $rootScope.fullnames = $cookieStore.get('fullnames');
            $rootScope.username = $cookieStore.get('username');

        } else {
            $location.path("/login");
        }
    });
}).directive('notification', function () {
    return {
        template: "<div ng-if='globalVariable.responseStatus' class='alert alert-dismissable {{globalVariable.responseStyle}} text-center' >" +
                "<a href='#' target='_self' class='close' data-dismiss='alert' aria-label='close'>&times;</a>{{globalVariable.responseMessage}}</div>"

    }


})
        .directive('pagination', function () {
            return {
                template: "<div class='text-right pull-right'><dir-pagination-controls boundary-links='true' pagination-id='dataPagination' on-page-change='pageChangeHandler(newPageNumber)'" +
                        "template-url='partialViews/dirPagination.tpl.html'></dir-pagination-controls>  </div>"

            }


        }).directive('slideable', function () {
    return {
        restrict: 'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
}).directive('spinner', function () {
    return{
        template: "<i class=' pull-right fa fa-spin fa-spinner' ng-show='data.showSpinner'></i>"
    }
})
        .directive('slideToggle', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var target = document.querySelector(attrs.slideToggle);
                    attrs.expanded = false;
                    element.bind('click', function () {
                        var content = target.querySelector('.slideable_content');
                        if (!attrs.expanded) {
                            content.style.border = '1px solid rgba(0,0,0,0)';
                            var y = content.clientHeight;
                            content.style.border = 0;
                            target.style.height = y + 'px';
                        } else {
                            target.style.height = '0px';
                        }
                        attrs.expanded = !attrs.expanded;
                    });
                }
            }
        }).directive('keyTrap', function () {
    return function (scope, elem) {
        elem.bind('keydown', function (event) {
            scope.$broadcast('keydown', event.keyCode);
        });
    };
}).directive('autoComplete', function ($timeout) {
    return function (scope, iElement, iAttrs) {
        iElement.autocomplete({
            source: scope[iAttrs.uiItems],
            select: function () {
                $timeout(function () {
                    iElement.trigger('input');
                }, 0);
            }
        });
    };
});
