var ticketsController = angular.module('mainModule');
ticketsController.controller('ticketsController', function ($scope, $cookieStore, $http, serverURL, dataStorage, SERVER_CONSTANTS,
        $rootScope, $location, $interval, serverURLGTS, fetchAPIDataService, $window, $timeout) {
    $scope.data.customersAllData = {};
    $scope.data.reasons = {};

    $scope.data.tableName = '';
    $scope.data.panelStatusColor = 'panel-success';
    $scope.data.getCustomerNames = function (tableNm, idNo) {
        var tableName = {};
        tableName.tableName = tableNm;
        tableName.idNo = idNo;
        console.log('please wait')
        try {

            var url = serverURL + 'getAllustomers'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {

                            console.log('REqUEST COMPLETED')
                            if (data.status == 1) {

                                $scope.data.customersAllData = data.data;

                            } else {
                                $scope.modalData.customersData = '';

                            }

                        })
                        .error(function (error) {

                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }
    $scope.data.getRandomCode = function () {
        var text = "";
        var possible = "0123456789";
        for (var i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        $scope.data.globalSettings.code = text;
        return text;
    }

    $scope.data.getCustomerTickets = function (tableName, custId) {
        var url = serverURL + 'fetchAllTicketsWhereCustomer'
        var dataInfo = {};
        dataInfo.custId = custId;

        try {
            $http.post(url, dataInfo)
                    .success(function (data) {
                        if (data.status == 1) {
                            $scope.data.allTicketsDataWhere = data.data
                        } else {
                            $scope.data.allTicketsDataWhere = '';
                            m
                        }
                    })
                    .error(function (error) {

                    })
        } catch (e) {

        }

    }

    $scope.data.allTicketsDataWhereVehicle = {};
    $scope.data.getTicketsPerVehicle = function (vehicleRegNumber) {
        var vehicleId = '';
        if (angular.isDefined($scope.data.searchedVehicles)) {
            for (var i = 0; i < $scope.data.searchedVehicles.length; i++) {
                if ($scope.data.searchedVehicles[i]['regNo'] == vehicleRegNumber) {
                    vehicleId = $scope.data.searchedVehicles[i]['id'];
                    break;
                }
            }


            var url = serverURL + 'fetchAllTicketsWhereCustomer'
            var dataInfo = {};
            dataInfo.vehicleId = vehicleId;

            try {

                $http.post(url, dataInfo)
                        .success(function (data) {
                            console.log(data.data)
                            if (data.status == 1) {
                                $scope.data.allTicketsDataWhereVehicle = data.data
                            } else {
                                $scope.data.allTicketsDataWhereVehicle = '';
                            }
                        })
                        .error(function (error) {

                        })
            } catch (e) {

            }

        } else {

        }

    }
    $scope.data.pendingTickets = 0;
    $scope.data.TotalTickets = function (data) {
        try {
            if (data.length > 0) {
                var openTicket = 0;
                var closedTicket = 0;
                var totalTickets = 0;
                var openAndAssigned = 0;
                for (var i = 0; i < data.length; i++) {
                    closedTicket += data[i]['closed'];
                    openTicket = data[i]['allOpenTickets'];
                    openAndAssigned += data[i]['open'];
                    totalTickets = data[i]['allTickets'];
                }
                $scope.data.closedTicket = closedTicket;
                $scope.data.openTicket = openTicket;
                $scope.data.openAndAssigned = openAndAssigned;
                $scope.data.totalTickets = totalTickets;



            }
        } catch (e) {

        }

    }
    $scope.data.totalAssets = function () {
        try {
            var url = serverURL + 'getAllAssets';
            $http.
                    get(url)
                    .success(function (data) {
                        if (data.status == 1) {
                            $scope.data.allAssetsInactive = data.inactive;
                            $scope.data.allAssetsactive = data.active;
                        }
                    })
        } catch (e) {

        }

    }

    $scope.data.getAllPayments = function (tablename) {
        $scope.data.linkView = '';
        $scope.data.linkAdd = 'active';
        var tableName = {};
        tableName.tableName = tablename;
        try {

            var url = serverURL + 'getPayments'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {

                            //   console.log('REQUEST COMPLETED FOR PAYMENTS')
                            if (data.status == 1) {

                                $scope.data.allPaymentsData = data.data;

                            } else {
                                $scope.data.allPaymentsData = '';

                            }

                        })
                        .error(function (error) {

                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }

    $scope.data.getRoutes = function (tablename) {

        $scope.data.linkView = 'active';
        $scope.data.linkAdd = '';
        var tableName = {};
        tableName.tableName = tablename;
        try {

            var url = serverURL + 'getRoutes'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {

                            console.log('REqUEST COMPLETED')
                            if (data.status == 1) {

                                $scope.data.routesAllData = data.data;

                            } else {
                                $scope.modalData.customersData = '';

                            }

                        })
                        .error(function (error) {

                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }

    $scope.data.returnTicketColor = function (ticketStatus) {
        var currentStatus = '';
        if (ticketStatus == '0') {
            currentStatus = 'panel-danger';
        } else if (ticketStatus == '1') {
            currentStatus = 'panel-success';
        } else if (ticketStatus == '2') {
            currentStatus = ' panel-warning';
        } else if (ticketStatus == '3') {
            currentStatus = 'panel-info ';
        } else {
            currentStatus = 'panel-default';
        }

        return currentStatus;
    }

    $scope.data.returnTrackingtColor = function (ticketStatus) {
        var currentStatus = '';
        if (ticketStatus == false) {
            currentStatus = 'panel-danger';
        } else if (ticketStatus == true) {
            currentStatus = 'panel-success';
        }

        return currentStatus;
    }

    $scope.data.returnTicketStatus = function (ticketStatus) {
        var currentStatus = '';
        if (ticketStatus == '0') {
            currentStatus = 'open';
        } else if (ticketStatus == '1') {
            currentStatus = 'Closed';
        } else if (ticketStatus == '2') {
            currentStatus = 'Suspended';
        } else if (ticketStatus == '3') {
            currentStatus = 'Escalated';
        } else {
            currentStatus = 'Unknown';
        }

        return currentStatus;
    }
    // $scope.data.updateTicketsFlags = {};
    $scope.data.showLocationFlag = false;
    $scope.data.showAddLocation = function () {
        $scope.data.showLocationFlag = !$scope.data.showLocationFlag;
    }
    $scope.data.updateAssignees = {};
    $scope.data.updateAssignees.assignedBy = $cookieStore.get('id');

    function returnStringDate(dateString) {

        if (dateString != 0)
        {
            var d = Date.parse(dateString) / 1000

            return (d + (24 * 60 * 60));
        } else {
            return 1;
        }
    }

    $scope.data.saveTicketUpdate = function (data, id, tableName, dateDue) {

        var tempObj = {};
        var dataTwo = {};
        $scope.data.showGritter(3);
        $scope.data.currentTicketInfo.ticketStatus = data;
        data.closedBy = $cookieStore.get('id');
        tempObj.data = data;



        try {
            var updateTicket = {};

            tempObj.id = id;
            tempObj.tableName = tableName;

            if (angular.isNumber(Number(id))) {


                var url = serverURL + 'updateWhere'
                $http.
                        post(url, tempObj)
                        .success(function (datas) {

                            if (datas.status == 1) {
                                if (tableName = 'TBL_SIMPLE_TICKETS') {
                                    $scope.modalData.getTickets();
                                }

                                $scope.data.showGritter(6);

                            } else {

                                $scope.data.showGritter(0);
                            }
                        }).error(function (error) {
                    $scope.data.showGritter(0);

                })


            }
        } catch (e) {
            console.log(e)
        }
    }


    $scope.data.todoStatus = function (status) {
        if (status == 0) {
            return 'Mark as Todo';
        } else if (status == 1) {
            return 'Unmark'
        } else {
            return 'Done'
        }
    }
    markPublicError = function (error, message) {
        var style = '';
        var errorStatus = false;
        var newMessage = '';
        if (error == 1) {
            style = SERVER_CONSTANTS.STATUS_SUCCESS_1_THEME;
            errorStatus = true;
            newMessage = message;
        } else if (error = 2) {
            style = SERVER_CONSTANTS.STATUS_WARNING_1_THEME;
            errorStatus = true;
            newMessage = SERVER_CONSTANTS.SERVER_ACTION;
        } else {
            style = SERVER_CONSTANTS.STATUS_ERROR_CODE_0_THEME;
            errorStatus = true;
            newMessage = SERVER_CONSTANTS.STATUS_ERROR_CODE_4;
        }
        $rootScope.globalVariable = {
            responseStyle: style,
            responseStatus: errorStatus,
            responseMessage: newMessage
        }

    }



    $scope.data.saveTodoList = function (data, updateId, column, table, callBack) {

        var updateInfo = {};
        updateInfo.id = updateId;
        updateInfo.column = column;
        updateInfo.data = data;
        updateInfo.tableName = table;
        try {
            if (angular.isNumber(Number(updateId))) {

                var url = serverURL + 'updateGenFunction'
                $http.
                        post(url, updateInfo)
                        .success(function (data) {

                            if (data.status == 1) {
                                console.log('okay');
                            }
                            if (callBack == 'callUpdateTicket') {
                                $scope.data.getAllTickets('1');
                            }
                        })
            }
        } catch (e) {
            console.log(e);
        }


    }
    $scope.data.returnStatusWords = function (status) {
        if (status == 1) {
            return 'Active';
        } else {
            return 'Inactive';
        }
    }
    $scope.data.getAllUsers = function () {
        var tableName = {};
        tableName.tableName = 'TBL_USERS';

        $scope.data.showGritter(3);
        try {
            var url = serverURL + 'getFetchData'
            $http
                    .post(url, tableName)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.data.showGritter(1);
                            $scope.data.allUsers = data.data;

                        } else {
                            $scope.data.showGritter(2);

                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0);
                    })
        } catch (e) {

        }
    }
    $scope.data.getUserSettings = function () {

        var tableName = {};
        tableName.tableName = 'TBL_SETTINGS';

        $scope.data.showGritter(3);
        try {
            var url = serverURL + 'getFetchData'
            $http
                    .post(url, tableName)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {
                            $scope.data.showGritter(1);
                            $scope.modalData.fetchCurrentData = data.data;
                            $scope.modalData.editFunction(1, tableName, 1);
                        } else {
                            $scope.data.showGritter(2);

                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0);
                    })
        } catch (e) {

        }
    }

    $scope.data.updateVehicleToCustomer = function (customerData) {

        try {
            var updateData = {};
            updateData.data = {};
            updateData.data.custId = customerData.id;
            updateData.data.extras = $scope.data.currentCustomerSearch.name;
            updateData.id = customerData.vehicleId;

            updateData.tableName = 'TBL_VEHICLES';

            try {
                $scope.data.saveUpdate(updateData.data, updateData.id, updateData.tableName);
            } catch (e) {
                $scope.data.showGritter(8);
            }
        } catch (e) {
            $scope.data.showGritter(0);
        }
    }


    $scope.data.unlinkCustomerVehicle = function (id) {
        var tempData = $scope.modalData.vehicleJoinCustomers;
        try {
            console.log(tempData)
            for (var i = 0; i < tempData.length; i++) {
                if (tempData[i]['id'] == id) {

                    tempData.splice(i, 1);
                    break;
                }
            }
            $scope.modalData.vehicleJoinCustomers = tempData;
        } catch (e) {

        }
    }
    $scope.data.saveAssigned = function (dataUpdate) {
        try {
            var url = serverURL + 'getInsertTicketlog'
            var data = {};
            data.assignedTo = dataUpdate.data.assignedTo;
            data.ticketId = dataUpdate.id;
            data.assignedBy = $cookieStore.get('id');
            $http
                    .post(url, data)
                    .success(function (data) {

                        if (data.status == 1) {

                        }
                    })

        } catch (e) {
            $scope.data.showGritter(0);
        }
    }

    $scope.data.saveUpdate = function (data, id, tableName) {

        $scope.data.showLocationFlag = false;
        $scope.data.showDeviceStatus = false;

        try {
            var updateTicket = {};
            updateTicket.data = data;
            updateTicket.id = id;
            updateTicket.tableName = tableName;
            console.log(updateTicket);
            $scope.data.showGritter(5);
            if (angular.isNumber(Number(id))) {

                var url = serverURL + 'updateWhere';
                $http.
                        post(url, updateTicket)
                        .success(function (data) {

                            console.log(data)
                            if (data.status == 1) {
                                $scope.data.showGritter(6);
                                if (tableName == 'TBL_SIMPLE_TICKETS') {
                                    $scope.data.saveAssigned(updateTicket);
                                }
                                console.log('okay');
                            } else {

                            }
                        })
                        .error(function (error) {

                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            $scope.data.showGritter(10);
            console.log(e)
        }

        return true;

    }
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
    $scope.data.printSchedule = function (day) {
        var starts = 24 * 60 * 60;
        var from = $scope.data.returnDateToday() - starts;



        var ends = 24 * 60 * 60;
        if (day == 0) {

        } else if (day == 1) {
            from = from + starts;
            ends = ends * 2;
        } else {
            from = from + starts;
            ends = ends * 7;

        }
        $scope.data.showGritter(3);
        console.log($scope.data.convertToHumanTime(from));
        var printData = {};

        printData.from = from;
        printData.ends = from + ends;
        printData.day = day;
        printData.printedBy = $cookieStore.get('fullnames');
        var url = serverURL + 'printSchedule'
        $http.
                post(url, printData)
                .success(function (data) {
                    $scope.data.showGritter(1);
                    if (data.status == 1) {
                        var path = data.data;
                        var printWindow = window.open(path, "", "width=1000,height=600");
                    } else {
                        $scope.data.showGritter(0);
                    }
                })
                .error(function (error) {
                    $scope.data.showGritter(2, 'Server Error');
                })




    }




    $scope.data.updateAssignee = function () {
        $scope.data.showAssignee = false;

    }
    $scope.data.showDeviceStatus = false;
    $scope.data.showAddDevice = function () {
        $scope.data.showDeviceStatus = !$scope.data.showDeviceStatus
    }
    $scope.data.updateDeviceColumn = function (numberDev) {

        $scope.data.currentTicketInfo.device = numberDev;
    }

    $scope.data.updateLocation = function (data) {
        $scope.data.currentTicketInfo.location = data;
    }
    $scope.data.escalationStatus = function (status) {
        var statusString = '';
        if (status == 1) {
            statusString = 'Escalated';
        } else {
            statusString = 'None';
        }
        return statusString;
    }
    $scope.data.currentTicketInfo = {};
    $scope.data.currentTicketInfo.status = true;
    $scope.data.getInfoTicket = function (id) {

        try {
            if (id > 0) {
                var arrayTemp = $scope.data.allTicketsData;

                for (var i = 0; i < arrayTemp.length; i++) {

                    if (arrayTemp[i]['id'] == id) {

                        $scope.data.currentTicketInfo = arrayTemp[i];

                        $scope.data.currentTicketInfo.status = false;
                        console.log($scope.data.currentTicketInfo);
                        break;
                    }
                }
            } else {

            }
        } catch (e) {
            console.log(e)
        }
    }
    $scope.data.getInfoTicketCustomer = function (id) {

        try {
            if (id > 0) {
                var arrayTemp = $scope.data.allTicketsDataWhere;

                for (var i = 0; i < arrayTemp.length; i++) {

                    if (arrayTemp[i]['id'] == id) {

                        $scope.data.currentTicketInfo = arrayTemp[i];

                        $scope.data.currentTicketInfo.status = false;
                        console.log($scope.data.currentTicketInfo);
                        break;
                    }
                }
            } else {

            }
        } catch (e) {
            console.log(e)
        }
    }
    $scope.data.getAllTicketsDataWhereVehicle = function (id) {

        try {
            if (id > 0) {
                var arrayTemp = $scope.data.allTicketsDataWhereVehicle;

                for (var i = 0; i < arrayTemp.length; i++) {

                    if (arrayTemp[i]['id'] == id) {

                        $scope.data.currentTicketInfo = arrayTemp[i];

                        $scope.data.currentTicketInfo.status = false;
                        console.log($scope.data.currentTicketInfo);
                        break;
                    }
                }
            } else {

            }
        } catch (e) {
            console.log(e)
        }
    }








//$scope.data.currentPaymentsInfo.statusShow = false;
    $scope.data.getPaymentsInfo = function (id) {

        try {
            if (id > 0) {
                var arrayTemp = $scope.data.allPaymentsData;
                for (var i = 0; i < arrayTemp.length; i++) {
                    if (arrayTemp[i]['id'] == id) {
                        $scope.data.currentPaymentsInfo = arrayTemp[i];

                        $scope.data.currentPaymentsInfo.status = true;
                        break;
                    }
                }
            } else {

            }
        } catch (e) {
            console.log(e)
        }
    }


    $scope.data.getReasons = function (tableNm) {
        var tableName = {};
        tableName.tableName = tableNm;
        try {
            var url = serverURL + 'getFetchData'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {
                            if (data.status == 1) {

                                $scope.data.reasons = data.data;

                            } else {
                                $scope.modalData.customersData = '';

                            }

                        })
                        .error(function (error) {

                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }
    var stop;

    $scope.data.showDiv = 'inbox';
    stop = $interval(function () {
        if ($scope.data.fetchingStatus == false) {
            if ($scope.data.showDiv == 'inbox') {
                $scope.data.getInboxSMS();
            } else if ($scope.data.showDiv == 'sent') {
                $scope.data.getSentSMS();
            }
        }
    }, 1000);


    $scope.data.inboxSMS = {};
    $scope.data.sentSMS = {};
    $scope.data.fetchingStatus = false;
    $scope.data.getSentSMS = function () {

        var tableName = {};
        tableName.tableName = 'MessageLog';
        try {
            $scope.data.fetchingStatus = true
            var url = serverURL + 'getSentMessages'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {
                            $scope.data.fetchingStatus = false;
                            if (data.status == 1) {
                                $scope.data.sentSMS = data.data;

                            } else {
                                $scope.data.sentSMS = '';

                            }

                        })
                        .error(function (error) {
                            $scope.data.fetchingStatus = false;
                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }

    $scope.data.saveAirtime = function (ussdInfo) {
        var creditSambaza = '*140*';

        var sambazaString = creditSambaza + ussdInfo.amount + '*' + ussdInfo.mobile + '#';
        var ussdInfos = {};

        ussdInfos.ussdCode = sambazaString;

        if (Number(ussdInfo.amount) > 0) {

            $scope.data.saveUssdCode(ussdInfos);
        }

    }
    $scope.data.ticketReports = {};
    $scope.data.userId = '';
    $scope.data.issue = '';
    $scope.data.getTicketReport = function (issue, userId) {

        try {
            $scope.data.showGritter(3)
            var dateRange = $('#daterange').val();
            var dateSelected = {};
            dateSelected.dateRange = dateRange;
            dateSelected.issue = issue;
            dateSelected.userId = userId;
            var url = serverURL + 'getTicketReport';
            console.log(dateSelected);
            $http.
                    post(url, dateSelected)
                    .success(function (data) {
                        $scope.data.showGritter(1)
                        if (data.status == 1) {
                            $scope.data.showGritter(1)
                            $scope.data.ticketReports = data.data;
                        } else {
                            $scope.data.showGritter(2)
                            $scope.data.ticketReports = {};
                        }
                    }).error(function (error) {
                $scope.data.showGritter(0);
            })


        } catch (e) {
            console.log(e)
        }


    }

    $scope.data.saveUssdCode = function (ussdInfo) {

        ussdInfo.createdBy = $cookieStore.get('id');

        try {
            $scope.data.fetchingStatus = true
            var url = serverURL + 'insertUssdCode'
            if (angular.isDefined(ussdInfo.ussdCode)) {
                $http
                        .post(url, ussdInfo)
                        .success(function (data) {
                            $scope.data.fetchingStatus = false;
                            if (data.status == 1) {

                                $scope.data.showGritter(99, data.message);
                                $scope.data.sambaza = {}
                            } else {
                                $scope.data.showGritter(99, 'Request failed,please try ');
                                // $scope.data.inboxSMS = '';

                            }

                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }

    $scope.data.getInboxSMS = function () {

        var tableName = {};
        tableName.tableName = 'MessageIn';
        try {
            $scope.data.fetchingStatus = true
            var url = serverURL + 'getInboxMessages'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {
                            $scope.data.fetchingStatus = false;
                            if (data.status == 1) {

                                $scope.data.inboxSMS = data.data;

                            } else {
                                $scope.data.inboxSMS = '';

                            }

                        })
                        .error(function (error) {
                            $scope.data.fetchingStatus = false;
                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }

    $scope.data.charLength = 0;
    $scope.data.numberOfSMS = 1;
    $scope.data.messageLength = function (message) {
        if (message.length > 0) {
            $scope.data.charLength = message.length;
            $scope.data.numberOfSMS = Math.ceil((message.length / 160))


        }
    }
    $scope.data.sendSMS = {};
    $scope.data.add254 = function (num) {
        return '+254' + num.substr(1, 15);
    }
    $scope.data.trimNumber = function (number) {
        if (number.substr(0, 1) == '+') {
            return '0' + number.substr(4, 15);
        } else {
            return number;
        }
    }
    $scope.data.setReplynumber = function (phone) {
        $scope.data.sendSMS.MessageTo = $scope.data.trimNumber(phone);
        $scope.data.selected = $scope.data.trimNumber(phone);
    }
    $scope.data.contact = {};
    $scope.data.saveContact = function (contact) {
        var url = serverURL + 'saveContact'
        contact.createdBy = $cookieStore.get('id');
        $scope.data.showGritter(5)
        try {
            $http.post(url, contact)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.data.showGritter(6)
                            $scope.data.getContacts(0)
                            $scope.data.contact = {};
                        } else {
                            $scope.data.showGritter(99, data.message);
                        }
                    })
                    .error(function (data) {

                    })

        } catch (e) {

        }

    }
    $scope.data.selected = '';
    $scope.data.createnumber = function (str) {

        var phone = fetchAPIDataService.returnAfterHashTag(str);
        $scope.data.selected = phone;
        $scope.data.sendSMS.MessageTo = phone;
    }
    $scope.data.returnArrayContacts = function () {
        var tempArray = [];
        var contacts = dataStorage.contacts;
        try {
            if (contacts.length > 0) {

                for (var i = 0; i < contacts.length; i++) {
                    var cont = contacts[i]['name'] + '<br>#' + contacts[i]['mobile'];
                    tempArray.push(cont);
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }


    function checkIfExist(mobile) {

        var exists = false;
        var contacts = dataStorage.contacts;
        if (contacts.length > 0) {
            if (angular.isDefined(mobile)) {
                for (var i = 0; i < contacts.length; i++) {
                    if (mobile == contacts[i]['mobile']) {
                        exists = true;
                        break
                    }
                }
            }
        } else {
            exists = false;
        }
        if (!exists) {
            $scope.data.contact.mobile = mobile;
            $timeout(function () {
                $("#addNumberToContacts").modal("show");

            }, 2000)
        }
    }
    $scope.data.contacts = {};
    $scope.data.getContacts = function (num) {

        if (dataStorage.contacts.length > 0 && num == 1) {
            $scope.data.contacts = dataStorage.contacts;

        } else {
            $scope.data.showGritter(3)
            var tableName = {};
            tableName.tableName = 'TBL_CONTACTS';
            try {

                $scope.data.fetchingStatus = true
                var url = serverURL + 'getFetchData'
                if (tableName.tableName != '') {
                    $http
                            .post(url, tableName)
                            .success(function (data) {
                                console.log(data)
                                $scope.data.fetchingStatus = false;
                                $scope.data.showGritter(1)
                                if (data.status == 1) {

                                    $scope.data.contacts = data.data;
                                    dataStorage.ChangeContactData(data.data)


                                } else {
                                    $scope.data.contacts = '';

                                }

                            })
                            .error(function (error) {
                                $scope.data.fetchingStatus = false;
                            })
                }

            } catch (e) {
                $scope.modalData.createFailLogs(e);
            }
        }
    }
    $scope.data.sendSMS = function (sendData) {
        try {
            var smsData = {};
            var mobileCntct = {}
            mobileCntct.mobile = sendData.MessageTo;
            smsData.MessageTo = $scope.data.add254(sendData.MessageTo);
            smsData.MessageText = sendData.MessageText
            console.log(smsData);
            var url = serverURL + 'sendSMS'
            try {
                $http.post(url, smsData)
                        .success(function (data) {

                            if (data.status == 1) {
                                checkIfExist(mobileCntct.mobile);

                                $scope.data.showGritter(99, data.message);
                                $scope.data.sendSMS.MessageText = '';
                                $scope.data.sendSMS.MessageTo = '';
                                $scope.data.selected = '';
                            } else {
                                $scope.data.showGritter(99, data.msg);
                            }
                        })
                        .error(function (data) {

                        })

            } catch (e) {

            }


        } catch (e) {

        }
    }
    $scope.data.initializeAutoComplete = function () {
        $('.combobox').combobox();

    }

    $scope.data.allTicketsData = {};
    $scope.data.getCustomersPayments = function () {


    }

    $scope.data.getTrackingStatus = function (status, timer) {
        if (status == false) {
            return 'Has not Tracked More that ' + timer + '';
        } else {
            return 'Tracking OK';
        }
    }
    $scope.data.cutNumber = function (num, len) {
        console.log(num)
        if (!isNaN(num)) {
            return Number(num).toFixed(len)
        } else {
            return 0;
        }
    }
    $scope.data.cutNumberTotals = function (usertotal, allTickets, len) {

        if (usertotal > 0 && allTickets > 0) {
            var num = (usertotal / allTickets) * 100;
            return Number(num).toFixed(len)
        } else {
            return Number(0).toFixed(len)
        }

    }
    $scope.data.userTicketsReports = '';
    $scope.data.getUserTicketReport = function () {

        try {
            var url = serverURL + 'getUserTicketReport';

            $http.get(url)
                    .success(function (data) {

                        if (data.status == 1) {
                            console.log(data.data)
                            $scope.data.userTicketsReports = data.data;
                            $scope.data.TotalTickets(data.data)
                        } else {
                            $scope.data.userTicketsReports = '';
                        }
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0);
                    })

        } catch (e) {
            console.log(e)
        }

    }
    $scope.data.userDailyTickets = {};
    $scope.data.getUserDailyTickets = function (status) {

        try {
            var data = {};

            var date = $('#date').val().substring(0, 10);
            if (status == 1) {
                data.date = date;
            }

            $scope.data.showGritter(3);
            var url = serverURL + 'getUserDailyTicketReport';

            $http.post(url, data)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.data.showGritter(1)
                            $scope.data.userDailyTickets = data.data;

                        } else {
                            $scope.data.showGritter(2);
                            $scope.data.userDailyTickets = '';
                        }
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0)
                    })

        } catch (e) {
            console.log(e)
        }

    }
    $scope.data.getUserDailyTickets = function (status) {

        try {
            var data = {};

            var date = $('#date').val().substring(0, 10);
            if (status == 1) {
                data.date = date;
            }

            $scope.data.showGritter(3);
            var url = serverURL + 'getUserDailyTicketReport';

            $http.post(url, data)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.data.showGritter(1)
                            $scope.data.userDailyTickets = data.data;

                        } else {
                            $scope.data.showGritter(2);
                            $scope.data.userDailyTickets = '';
                        }
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0)
                    })

        } catch (e) {
            console.log(e)
        }

    }




    $scope.data.userDailyCerts = {};
    $scope.data.getUserDailyCerts = function (status) {

        try {
            var data = {};

            var date = $('#dateCert').val().substring(0, 10);
            if (status == 1) {
                data.date = date;
            }

            $scope.data.showGritter(3);
            var url = serverURL + 'getUserDailyCertReport';

            $http.post(url, data)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {

                            $scope.data.showGritter(1)
                            $scope.data.userDailyCerts = data.data;

                        } else {
                            $scope.data.showGritter(2);
                            $scope.data.userDailyCerts = {};
                        }
                    })
                    .error(function (error) {
                        console.log(error)
                        $scope.data.showGritter(0)
                    })

        } catch (e) {
            console.log(e)
        }

    }













    $scope.data.showSearchVehicles = function (div, searchString) {
        $scope.modalData.showDivSearch = div;
        var searchData = {};
        searchData.regNo = searchString;
        searchData.tableName = 'TBL_VEHICLES';
        if (angular.isDefined(searchString)) {
            var url = serverURL + 'getAllVehicles';

            try {
                $http.post(url, searchData)
                        .success(function (data) {
                            console.log(data);
                            if (data.status == 1) {
                                $scope.data.searchedVehicles = data.data;
                            } else {

                            }
                        })
                        .error(function (data) {

                        })

            } catch (e) {

            }

        } else {
            alert('Please enter a search value');
        }

    }








    $scope.data.getAllTickets = function (status) {
        var tableName = {};
        tableName.tableName = 'TBL_TICKETS';
        try {
            console.log($scope.data.allTicketsData.length)
            if (angular.isUndefined($scope.data.allTicketsData.length) || status == 1) {

                var url = serverURL + 'fetchAllTickets'
                if (tableName.tableName != '') {
                    $http
                            .post(url, tableName)
                            .success(function (data) {

                                if (data.status == 1) {

                                    $scope.data.allTicketsData = data.data;

                                } else {


                                }
                                //$scope.modalData.hideTableTillResponse = true;
                            })
                            .error(function (error) {

                            })
                }
            } else {
                console.log('array already has data');
            }
        } catch (e) {
            console.log(e)
            //$scope.modalData.createFailLogs(e);
        }
    }


    $scope.data.getGroups = function () {
        var tableName = {};
        tableName.tableName = 'TBL_USER_GROUPS';
        console.log(groups)

        try {

            var url = serverURL + 'getFetchData'

            $http
                    .post(url, tableName)
                    .success(function (data) {

                        if (data.status == 1) {

                            $scope.data.groups = data.data;

                        } else {


                        }

                    })
                    .error(function (error) {

                    })

        } catch (e) {

        }
    }
    $scope.data.getcrmModule = function (tableNm) {
        var tableName = {};
        tableName.tableName = tableNm;
        try {

            var url = serverURL + 'getFetchData'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {

                            if (data.status == 1) {

                                $scope.data.crmModule = data.data;

                            } else {


                            }

                        })
                        .error(function (error) {

                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }

    $scope.data.menuArray = [
        'customers', 'vehicles', 'insurance', 'financier', 'cv', 'certificates', 'reprint', 'company', 'profile', 'governor', 'approveCerts', 'calendar'
    ]
    $scope.data.nonAdminArray = ['cv', 'certificates', 'reprint', 'home', 'profile', 'tickets'];
    $scope.data.checkAllowedmenus = function () {
        var href = window.location.href.split("/").pop();
        var checkAllowed = $scope.data.confirmRight(href);

        if (checkAllowed != true) {
            $location.path("/profile");
        }
    }

    $scope.$watch(function () {
        return $location.path();
    }, function (value) {
        $scope.data.checkAllowedmenus();
    })


    $scope.data.confirmRight = function (Menu) {

        var groupId = $cookieStore.get('groupId');

        if (groupId == 1) {
            return true;

        } else {

//            for (var i = 0; i < $scope.data.nonAdminArray.length; i++) {
//                if ($scope.data.nonAdmin[i] == Menu) {

            return true;

//                }
//            }

        }

    }

    $scope.data.sortByColumn = 'id';
    $scope.data.sortByColumnFxn = function (column) {

        if ($scope.data.sortByColumn == column) {
            $scope.data.sortByColumn = '-' + column
        } else {
            $scope.data.sortByColumn = column;
        }
    }
    $scope.data.userShifts = {};
    $scope.data.getShifts = function (tableNm) {
        var tableName = {};
        tableName.tableName = tableNm;

        try {

            var url = serverURL + 'getUserShifts'
            if (tableName.tableName != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {

                            if (data.status == 1) {

                                $scope.data.userShifts = data.data;

                            } else {


                            }

                        })
                        .error(function (error) {

                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }


    $scope.data.ticketSettings = {};
    $scope.data.ticketSettings.code = '';
    $scope.data.generateRandomTicketCode = function () {

        $scope.data.ticketSettings.code = $scope.data.getRandomCode();
    }
// $scope.data.getCustomerNames('TBL_CUSTOMERS');
// $scope.data.getReasons('TBL_REASONS');
//$scope.data.getcrmModule('TBL_CRM_MODULES');
    $scope.data.custError = false;
    $scope.data.customerVehicles = {};
    $scope.data.getCustomerVehicles = function () {

        var tableName = {};
        tableName.tableName = 'TBL_VEHICLES';
        tableName.custId = $scope.data.ticketSettings.custId;

        try {
            if ($scope.data.ticketSettings.custId > 0) {

                var url = serverURL + 'fetchVehiclesCustomer'
                if (tableName.tableName != '') {
                    $http
                            .post(url, tableName)
                            .success(function (data) {
                                //  console.log(data)
                                if (data.status == 1) {

                                    $scope.data.customerVehicles = data.data;

                                } else {
                                    $scope.data.customerVehicles = '';

                                }

                            })
                            .error(function (error) {

                            })
                }
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }
    $scope.data.returnCustomerCode = function (id) {

        if (Number(id) > 0) {
            for (var i = 0; i < $scope.modalData.customerFilteredData.length; i++) {
                if ($scope.modalData.customerFilteredData[i]['id'] == id) {
                    return $scope.modalData.customerFilteredData[i]['code'];
                } else {
                    return id;
                }
            }
        } else {
            return id;
        }
    }


    $scope.data.allCustomersData = {};
    $scope.data.getAllCustomersData = function (allowed) {
        var tableName = {};
        tableName.idNo = $scope.modalData.searchText;


        tableName.tableName = 'TBL_CUSTOMERS';
        try {


            var url = serverURL + 'getCustomerWhere'
            if (tableName.tableName != '') {

                if (tableName.idNo != '') {
                    $rootScope.globalVariable = {
                        responseStyle: SERVER_CONSTANTS.STATUS_WARNING_1_THEME,
                        responseStatus: true,
                        responseMessage: SERVER_CONSTANTS.SERVER_ACTION
                    }
                    $http
                            .post(url, tableName)
                            .success(function (data) {

                                if (data.status == 1) {
                                    $scope.data.allCustomersData = data.data;
                                    $rootScope.globalVariable = {
                                        responseStyle: SERVER_CONSTANTS.STATUS_SUCCESS_1_THEME,
                                        responseStatus: false,
                                        responseMessage: SERVER_CONSTANTS.SERVER_ACTION
                                    }
                                } else {
                                    $rootScope.globalVariable = {
                                        responseStyle: SERVER_CONSTANTS.STATUS_ERROR_CODE_0_THEME,
                                        responseStatus: true,
                                        responseMessage: data.message
                                    }
                                }
                                $scope.modalData.hideTableTillResponse = true;
                            })
                            .error(function (error) {
                                $rootScope.globalVariable = {
                                    responseStyle: SERVER_CONSTANTS.STATUS_ERROR_CODE_0_THEME,
                                    responseStatus: true,
                                    responseMessage: SERVER_CONSTANTS.STATUS_ERROR_CODE_4
                                }
                            })
                } else {
                    alert('please enter the search field');
                }

            }
        } catch (e) {

        }
    }
    var todosd = []
    $scope.data.globalSettingsSave = function (globalData, tableName) {

        var arrayData = {}
        $scope.data.showGritter(5);
        globalData.createdBy = $cookieStore.get('id');
        arrayData.data = globalData;
        arrayData.tableName = tableName;
        //arrayData.whereColumn = whereColumn;

        try {
            var url = serverURL + 'saveGlobalData'
            $http.
                    post(url, arrayData)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.data.showGritter(6);

                            $scope.data.globalSettings = {};
                        } else {


                            $scope.data.showGritter(7, data.message);


                        }

                    })
                    .error(function (error) {

                        $scope.data.showGritter(0);
                    })

        } catch (e) {


            $scope.data.showGritter(0);
        }

    }
    $scope.data.addToList = function (todos) {
        console.log(todos)
        if (angular.isDefined(todos)) {
            if (todos != '') {
                var todo = [];
                var todoData = {};
                todoData.todo = todos.todo;
                todoData.assignedTo = todos.assignedTo;
                todoData.code = $scope.data.getRandomCode();
                $scope.data.globalSettingsSave(todoData, 'TBL_TODO');

                $scope.data.getTodolist();

            } else {
                $scope.data.showGritter(12);
            }
        } else {
            $scope.data.showGritter(12);
        }
    }

    $scope.data.returnToDoStatus = function (status) {
        if (status == 1) {
            return 'Undone';
        } else {
            return 'Done';
        }

    }

    $scope.data.todoListdata = {};
    $scope.data.getTodolist = function () {

        var todoListInfo = {}
        todoListInfo.assignedTo = $cookieStore.get('id');

        var url = serverURL + 'getTodoList'
        $http.
                post(url, todoListInfo)
                .success(function (data) {

                    if (data.status == 1) {
                        $scope.data.todoListdata = data.data;
                        console.log($scope.data.todoListdata)
                    } else {
                        $scope.data.todoListdata = [];
                    }

                })
    }
    $scope.data.mergeTicket = function (id, reason, regNo) {
        $scope.data.ticketId = id;
        $scope.data.ticketName = reason;
        $scope.data.regNo = regNo;
    }

    $scope.data.ticketMerged = function (id, data) {
        if (id > 0) {
            var saveData = {}
            var save = {}
            saveData.status = 2;
            saveData.mergeId = id;
            var tempArray = data;
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i]['id'] == id) {
                    tempArray.splice(i, 1)

                    $scope.data.saveUpdate(saveData, id, 'TBL_SIMPLE_TICKETS');


                    var Id2 = $scope.data.ticketId;
                    saveData = {}
                    saveData.mergeId = id;
                    $scope.data.saveUpdate(saveData, Id2, 'TBL_SIMPLE_TICKETS');
                    break;
                }
            }
        }
    }
    $scope.data.filterTicket = $cookieStore.get('username');
    $scope.data.returnFilter = function (filter) {
        if (filter == 1) {
            $scope.data.filterTicket = $cookieStore.get('username');
        } else {
            $scope.data.filterTicket = '';
        }
    }
    $scope.data.updateId = '';
    $scope.data.updateToId = function (id) {
        $scope.data.updateId = id;
    }
    $scope.data.saveAssignedTodo = function (assignedTo, feedback, id, type) {
        var saveData = {};
        for (var i = 0; i < $scope.data.todoListdata.length; i++) {
            if ($scope.data.todoListdata[i]['id'] == id) {
                $scope.data.todoListdata.splice(i, 1)
                break;
            }
        }

        saveData.feedback = feedback;
        if (type == 'r') {
            saveData.status = 0;
            saveData.feedback = feedback;

        }
        if (type == 'd') {
            saveData.status = 2;
        }
        console.log(id)

        $scope.data.saveUpdate(saveData, id, 'TBL_TODO');

    }

    $scope.data.accountVehicles = {};


    $scope.data.getAllVehiclesData = function (num) {

        var tableName = {};
        tableName.tableName = 'TBL_VEHICLES';
        try {

            if (dataStorage.allAppData.length > 0 && num == 1) {
                $scope.data.accountVehicles = dataStorage.allAppData;
            } else {
                $scope.data.showGritter(3);
                var url = serverURL + 'getAllVehicles'
                if (tableName.tableName != '') {



                    $http
                            .post(url, tableName)
                            .success(function (data) {
                                $scope.data.showGritter(1);
                                if (data.status == 1) {



                                    $scope.data.accountVehicles = data.data;

                                    dataStorage.ChangeData($scope.data.accountVehicles);

                                } else {
                                    $scope.data.showGritter(2);
                                }
                                $scope.modalData.hideTableTillResponse = true;
                            })
                            .error(function (error) {

                                $scope.data.showGritter(0);
                            })
                }



            }

        } catch (e) {

        }
    }
    $scope.data.custString = function (data, stringlength) {
        return fetchAPIDataService.cutString(data, stringlength);
    }




    $scope.data.customerName = '';
    $scope.data.payments.custId = '';
    $scope.data.validateCustomerDetails = function (custId) {
        //if (angular.isUndefined($scope.data.customersAllData)|| $scope.data.customersAllData.length==0){
        $scope.data.getCustomerNames('TBL_CUSTOMERS', custId)

        // }
        if (angular.isDefined(custId)) {

            if ($scope.data.customersAllData.length > 0) {
                console.log(custId);
                for (var i = 0; i < $scope.data.customersAllData.length; i++) {
                    $scope.data.customerName = '';
                    if ($scope.data.customersAllData[i]['idNo'] != custId) {
                        console.log('NOT FOUND')
                        $scope.data.custError = true;
                        $scope.data.customerVehicles = '';
                    } else {
                        $scope.data.custError = false;
                        $scope.data.customerName = $scope.data.customersAllData[i]['name'];

                        $scope.data.ticketSettings.custId = $scope.data.customersAllData[i]['id']
                        $scope.data.payments.custId = $scope.data.ticketSettings.custId;
                        $scope.data.getCustomerVehicles();
                        break;

                    }
                }
            } else {
                console.log('please wait')
                $scope.data.custError = true;
            }
        }
    }

}
)
