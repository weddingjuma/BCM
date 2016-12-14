var modalsController = angular.module('mainModule');
modalsController.controller('modalsController', function ($scope, $cookieStore, $http, serverURL,
        SERVER_CONSTANTS, $rootScope, $location, serverURLGTS, fetchAPIDataService, $window, dataStorage, $timeout, $interval, $filter) {
    $scope.modalData = {};
    $scope.data.globalSettings = {};
    $scope.data.vehicleSettings = {};
    $scope.modalData.hideTableTillResponse = false;
    $scope.data.showModal = function (color, headerTitle) {
        $scope.data.linkAdd = 'active';
        $scope.data.linkView = '';
        $scope.data.modalHeaderColor = color;
        $scope.data.modalHeader = headerTitle;
        $scope.modalData.clearGlobalData();
        $scope.modalData.getRandomCode();
        $rootScope.globalVariable = {
            responseStyle: '',
            responseStatus: false,
            responseMessage: ''
        }
    }

    $scope.data.showList = false;
    $scope.data.currentCustomerSearch = {};
    $scope.data.currentCustomerSearch.id = '';
    $scope.data.showExtraInfo = $scope.data.showList;
    $scope.modalData.holdOnClickedClient = function (id) {
        try {
            if ($scope.modalData.allCustomers.length > 0) {
                for (var i = 0; i < $scope.modalData.allCustomers.length; i++) {
                    if ($scope.modalData.allCustomers[i]['id'] == id) {
                        $scope.data.showList = false;
                        $scope.data.showExtraInfo = true;
                        $scope.data.currentCustomerSearch.mobile = $scope.modalData.allCustomers[i]['mobile_1'];
                        $scope.data.currentCustomerSearch.name = $scope.modalData.allCustomers[i]['name'];
                        $scope.data.currentCustomerSearch.idNo = $scope.modalData.allCustomers[i]['idNo'];
                        $scope.data.currentCustomerSearch.id = $scope.modalData.allCustomers[i]['id'];
                        break;
                    }

                }
            } else {
                $scope.data.showGritter(8);
            }
        } catch (e) {
            $scope.data.showGritter(10);
        }
    }
    $scope.modalData.assignPolicy = function (policyStatus) {

        if (policyStatus) {
            $scope.data.vehicleSettings.extras = 'CUSTOMERNAME';
        } else {
            $scope.data.vehicleSettings.extras = '';
        }

    }
    $scope.modalData.saveUserLogs = function (action, id) {
        var dataLogs = {};
        dataLogs.action = action;
        dataLogs.columnId = id;
        dataLogs.userId = $cookieStore.get('id');
        dataLogs.code = $scope.data.getRandomCodeSpec
        dataLogs.time = new Date();
        $scope.modalData.saveUserLogsDb(dataLogs, 'TBL_LOGS');
    }
    $scope.data.groups = {};
    $scope.data.returnUserGroup = function (id) {

        if ($scope.data.groups.length == 0) {
            $scope.data.getGroups();
        }
        var groups = $scope.data.groups;
        for (var i = 0; i < $scope.data.groups.length; i++) {

        }
        console.log($scope.data.groups.length);
    }
    $scope.modalData.newClient = {};
    function returnFullCustomer(name) {
        var info = {}
        name = name.substring(4);
        var indexSlash = name.indexOf('/');
        info.nameFull = name.substring(0, indexSlash);
        info.number = name.substring(indexSlash + 1);
        return info;
    }
    $scope.modalData.returnNewClients = function () {
        var returnArrays = [];
        $timeout(function () {
            if ($scope.modalData.tickets.length > 0) {
                var tempArrays = $scope.modalData.tickets;
                for (var i = 0; i < tempArrays.length; i++) {

                    if (tempArrays[i]['name'].substring(0, 4) == 'NEW-') {

                        var info = returnFullCustomer(tempArrays[i]['name']);
                        tempArrays[i]['names'] = info.nameFull;
                        tempArrays[i]['mobile_1s'] = info.number;
                        returnArrays.push(tempArrays[i]);
                    }
                }
                $scope.modalData.newClient = returnArrays;
            } else {
                console.log('no tickets yet ');
            }


        }, 1000)

    }





    $scope.modalData.returnStrength = function (data) {
        if (data.length > 0) {
            if (data.length < 5) {
                $scope.modalData.color = 'text-danger';
                $scope.modalData.changePasswordMessage = 'weak';
            }
            if (data.length > 5 && data.length < 7) {
                $scope.modalData.color = 'text-primary';
                $scope.modalData.changePasswordMessage = 'average';
            }
            if (data.length > 7) {
                $scope.modalData.color = 'text-success';
                $scope.modalData.changePasswordMessage = 'Strong';
            }
        } else {
            $scope.modalData.color = 'text-success';
            $scope.modalData.changePasswordMessage = '';
        }


    }



    $scope.modalData.saveUserLogsDb = function (dataLogs, tableName) {

        var arrayData = {}
        arrayData.createdBy = $cookieStore.get('id');
        arrayData.data = dataLogs;
        arrayData.tableName = tableName;
        try {
            var url = serverURL + 'saveGlobalData'
            $http.
                    post(url, arrayData)
                    .success(function (data) {

                        if (data.status == 1) {

                        } else {


                        }

                    })
                    .error(function (error) {

                    })

        } catch (e) {

            $scope.data.showGritter(0);
        }
    }
    function validateForm(email) {
        var x = email;
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            $scope.data.invalidModalEmail()
            return false;
        } else {
            $scope.data.showModalEmail()
            return true;
        }
    }
    $scope.data.emailData = {};
    $scope.modalData.email = {};
    $scope.data.email = {};
    $scope.data.email.subject = '';
    $scope.modalData.sendEmailToClient = function (cert) {

        $scope.data.emailData = cert;
        $scope.data.email.subject = 'Certificate No.' + cert.certNo + ' For REGNO. ' + cert.regNo;
        $scope.data.timer = 0;
        $scope.modalData.timeRightNow = '';
        $scope.data.sendingMessage = 'Sending Email';
        console.log($scope.data.email.subject);
        //$scope.data.showModalEmail();
        //validateForm(arrayInfo.email)
    }
    $scope.modalData.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    function returnEmailString(emailString) {
        var email = '';
        if (emailString.indexOf(';') > 0) {
            //  alert(emailData.to.indexOf(';'));
            var arraytemp = emailString.split(';');
            var counter = 0
            for (var i = 0; i < arraytemp.length; i++) {
                if (!$scope.modalData.emailFormat.test(arraytemp[i])) {
                    if (arraytemp[i].length > 0) {
                        alert('invalid email ' + arraytemp[i] + '.It will be omitted');
                    }
                } else {

                    if (counter > 0) {
                        email += ',' + arraytemp[i];
                    } else {
                        email += arraytemp[i];
                    }
                    counter++;
                }
            }
        } else {
            if (!$scope.modalData.emailFormat.test(emailString)) {
                alert('invalid email address')
            } else {

                email = emailString;
            }
        }
        return email;
    }

    $scope.data.ticketLogs = {};
    $scope.modalData.getTicketLogs = function (ticketId) {

        $scope.data.showGritter(3);
        var data = {};
        data.ticketId = ticketId;
        var url = serverURL + 'getTicketLogs'
        $http.
                post(url, data)
                .success(function (data) {
                    $scope.data.showGritter(1);
                    if (data.status == 1) {
                        $scope.data.showGritter(1);
                        $scope.data.ticketLogs = data.data;
                        console.log($scope.data.ticketLogs)
                    } else {
                        $scope.data.ticketLogs = {};
                        $scope.data.showGritter(2);
                    }

                })
                .error(function (error) {
                    $scope.data.showGritter(0);
                })



    }






    $scope.data.timer = 0;
    $scope.data.divProg = 'progress-bar-success';
    $scope.data.sendingMessage = 'Sending Email';
    $scope.modalData.sendEmailConfirm = function (emailData) {
        var timeRightNow = new Date();
        $scope.data.timer = 0;
        $scope.data.divProg = 'progress-bar-success';
        $scope.modalData.timeRightNow = '';
        $scope.data.sendingMessage = 'Sending Email';
        var stop = $interval(function () {
            if ($scope.data.timer < 100) {
                $scope.data.timer = Math.round((new Date() - timeRightNow) / 400, 0);
                console.log($scope.data.timer);
            } else {
                $scope.data.timer = 99;
                $interval.cancel(stop);
                $scope.data.sendingMessage = 'Mail Could not be sent';
                $scope.data.divProg = 'progress-bar-danger';
            }
        }, 400);
        emailData.certId = $scope.data.emailData.id;
        emailData.certNo = $scope.data.emailData.certNo;
        emailData.name = $scope.data.emailData.name;
        emailData.regNo = $scope.data.emailData.regNo;
        emailData.vehicleId = $scope.data.emailData.vehicleId;
        emailData.to = returnEmailString(emailData.to);
        if (angular.isDefined(emailData.cc) && emailData.cc !== '') {
            emailData.cc = returnEmailString(emailData.cc);
        }
        console.log(emailData);
        try {
            $scope.data.showGritter(4);
            var url = serverURL + 'receiveEmailFromClient'
            $http
                    .post(url, emailData)
                    .success(function (data) {

                        if (data.status == 1) {

                            $scope.data.timer = 100; //Math.round((new Date() - timeRightNow) / 50, 0);
                            $scope.data.divProg = 'progress-bar-success';
                            $interval.cancel(stop);
                            $scope.data.sendingMessage = 'Email Sent';
                            $scope.data.email = {};
                            $scope.modalData.savedCerts = data.data;
                        } else {
                            $scope.data.showGritter(21);
                            $scope.data.timer = 99;
                            $scope.data.sendingMessage = 'Mail Could not be sent';
                            $scope.data.divProg = 'progress-bar-danger';
                        }

                    })
                    .error(function (error) {
                        $scope.data.showGritter(0, 'Server Error : Please try again');
                    })

        } catch (e) {

            $scope.data.showGritter(0);
        }

    }
    $scope.modalData.getHttpRequest = false;
    $scope.modalData.crmMssagesBackUp = {};
    $scope.modalData.updateOnlineStats = function () {
        try {
            var myId = {};
            myId.userId = $cookieStore.get('id');
            myId.createdBy = myId.userId;
            myId.crmMessagesLength = dataStorage.chatMessages.length;
            myId.code = $scope.data.getRandomCode();
            var arrayData = {};
            arrayData = myId;
            // $scope.modalData.globalSettingsSave(myId, 'TBL_ONLINE_USERS');
            if (!$scope.modalData.getHttpRequest) {
                $scope.modalData.getHttpRequest = true;
                var url = serverURL + 'updateOnlineStatus'
                $http.
                        post(url, arrayData)
                        .success(function (data) {
                            $scope.modalData.getHttpRequest = false;
                            console.log(data.crmCount + ' ' + myId.crmMessagesLength)

                            if (data.crmCount > myId.crmMessagesLength) {
                                console.log('executed')
                                $scope.modalData.getCrmMessages();
                            }
                            $scope.modalData.getHttpRequest = false;
                            $scope.modalData.onlineUsers = data.data;
                            if (data.status == 1) {
                                $scope.modalData.st = true;
                            } else {
                                $scope.modalData.st = false;
                            }

                        })
                        .error(function (error) {
                            console.log(error)

                        })
            } else {
                $timeout(function () {
                    $scope.modalData.getHttpRequest = false;
                }, 500)
                console.log('HTTP already in progress');
            }
        } catch (e) {

            $scope.modalData.st = false;
        }

    }
    $scope.modalData.showSending = false;
    $scope.modalData.messageId = 0;
    function updateReadMessages(senderId) {
        var data = {};
        data.userId = $cookieStore.get('id');
        data.receiver = senderId;
        var url = serverURL + 'updateReadMessages';
        try {
            $http.post(url, data)
                    .success(function (data) {
                        console.log(data)
                    })
                    .error(function () {

                    })
        } catch (e) {

        }

    }


    $scope.modalData.getUserMessages = function (name, id, status, timimg) {

        if ($scope.modalData.messageId == id) {
            updateReadMessages(id)
        }

        $scope.modalData.messageUser = name;
        $scope.modalData.onlineUserStatus = status;
        $scope.modalData.onlineUserTiming = timimg;
//        document.getElementById("crmMessage").focus();
        $scope.modalData.userId = $cookieStore.get('id');
        var tempData = $scope.modalData.crmMssagesBackUp;
        if (tempData.length > 0) {
            var returnArray = [];
            for (var i = 0; i < tempData.length; i++) {
                if ((tempData[i]['receiver'] == id && tempData[i]['userId'] == $cookieStore.get('id')) ||
                        (tempData[i]['userId'] == id && tempData[i]['receiver'] == $cookieStore.get('id'))) {
                    returnArray.push(tempData[i]);
                }
            }

            $scope.modalData.showSending = false;
            $scope.modalData.crmMssages = returnArray;
        }
        $scope.modalData.messageId = id;
    }
    $rootScope.messageCounter = 0;
    function returnTotalUnread() {
        var tempData = $scope.modalData.crmMssagesBackUp;
        var counter = 0;
        var exist = false;
        if (tempData.length > 0) {
            for (var i = 0; i < tempData.length; i++) {
                if (tempData[i]['receiver'] == $cookieStore.get('id')) {
                    if (tempData[i]['readStatus'] == 0) {
                        exist = true;
                        if (tempData[i]['userId'] != $cookieStore.get('id')) {
                            counter++;
                        }

                    }
                }
            }

            $cookieStore.put('messagesCounter', counter++);
            $scope.modalData.messageCounter = counter++;
            $rootScope.messageCounter = counter++;
        }

    }
    $scope.modalData.getUnreadMessages = function (id) {

        var tempData = $scope.modalData.crmMssagesBackUp;
        var counter = 0;
        var exist = false;
        if (tempData.length > 0) {
            for (var i = 0; i < tempData.length; i++) {
                if (tempData[i]['userId'] == id && tempData[i]['receiver'] == $cookieStore.get('id')) {
                    if (tempData[i]['readStatus'] == 0) {
                        exist = true;
                        counter++;
                    }
                }
            }

        }
        returnTotalUnread();
        if (exist) {
            return counter;
        } else {
            return '';
        }
    }





    $scope.modalData.crmMssages = {};
    $scope.modalData.getUserLine = function (userId, receiver) {
        if (userId == $cookieStore.get('id')) {
            return 'right';
        }
        if (receiver == $cookieStore.get('id')) {
            return 'left';
        }
    }
    $scope.modalData.getUserImage = function (userId, receiver) {
        if (userId == $cookieStore.get('id')) {
            return 'pull-right';
        }
        if (receiver == $cookieStore.get('id')) {
            return 'pull-left';
        }
    }
    $scope.modalData.getCrmMessagesDirect = function () {
        if (!$scope.modalData.getHttpRequest) {
            var whereUser = {};
            whereUser.userId = $cookieStore.get('id');
            var url = serverURL + 'getCrmMssages'
            console.log('called')
            $scope.modalData.getHttpRequest = true;
            $http.
                    post(url, whereUser)
                    .success(function (data) {
                        $scope.data.showGritter(1);
                        if (data.status == 1) {
                            $scope.modalData.crmMssagesBackUp = data.data;
                            dataStorage.ChangeChatMessages(data.data);
                            $scope.modalData.getHttpRequest = false;
                        } else {
                            $scope.modalData.crmMssages = {};
                        }

                    })
                    .error(function (error) {
                        console.log(error);
                        // $scope.data.showGritter(0);
                    })
        }
    }
    $scope.modalData.getCrmMessages = function () {
        var whereUser = {};
        whereUser.userId = $cookieStore.get('id');
        if ($scope.modalData.crmMssagesBackUp != dataStorage.chatMessages) {
            $scope.modalData.crmMssagesBackUp = dataStorage.chatMessages
        }
        $timeout(function () {

            try {
                $scope.modalData.showRefreshing = false;
                var url = serverURL + 'getCrmMssages'
                if (!$scope.modalData.getHttpRequest) {
                    console.log('called')
                    $scope.modalData.getHttpRequest = true;
                    $http.
                            post(url, whereUser)
                            .success(function (data) {
                                $scope.data.showGritter(1);
                                if (data.status == 1) {
                                    $scope.modalData.crmMssagesBackUp = data.data;
                                    dataStorage.ChangeChatMessages(data.data);
                                    $scope.modalData.getHttpRequest = false;
                                } else {
                                    $scope.modalData.crmMssages = {};
                                }

                            })
                            .error(function (error) {
                                console.log(error);
                                // $scope.data.showGritter(0);
                            })
                } else {
                    $timeout(function () {
                        $scope.modalData.getHttpRequest = false;
                    }, 500)
                    console.log('HTTP already in progress...retrying...')

                }
            } catch (e) {

            }
        }, 500);
    }
    // $scope.modalData.getCrmMessages();
    $scope.data.crmMessage = '';
    $scope.modalData.clearAllFormData = function (action) {

        $("form input").val("");
        if (action == 'cv') {

            $scope.data.currentCustomerSearch = {};
            $scope.data.currentCustomerSearch.id = ''
        }
        // $(':input').val('');
        //  document.getElementById('form').reset();   
    }
    $scope.modalData.saveMessage = function (message) {
        var messageInfo = {};
        messageInfo.userId = $cookieStore.get('id');
        messageInfo.receiver = $scope.modalData.messageId;
        messageInfo.message = message;
        messageInfo.readStatus = 0;
        messageInfo.code = $scope.data.getRandomCode();
        var pushers = {};
        // $scope.modalData.crmMssages.push(pusher);

        $scope.data.crmMessage = '';
        $scope.modalData.globalSettingsSave(messageInfo, 'TBL_CRM_MESSAGES');
//        pushers.userId = $cookieStore.get('id');
//        pushers.receiver = $scope.modalData.messageId;
//        pushers.message = message;
//        pushers.readStatus = 0;
//        pushers.code = $scope.data.getRandomCode();
//        pushers.createdBy = messageInfo.userId;
//        pushers.dateCreated = 1478072989;
//        pushers.id = 1478072989;
//        pushers.readStatus = 0;
//        pushers.receiverName = $scope.modalData.messageUser;
//        pushers.senderName = $cookieStore.get('username');
//        pushers.sentTime = "now"
//        pushers.status = "1"
//        console.log(pushers);
//        $.extend($scope.modalData.crmMssages,pushers);


    }
    var stop;
    $scope.data.showDiv = 'inbox';
    stop = $interval(function () {
        if ($cookieStore.get("loggedStatus")) {
            if (!$scope.modalData.getHttpRequest) {
                //   $scope.modalData.getOnlineUsers();

            }
            $scope.modalData.updateOnlineStats();
        }
    }, 60000)

    stop = $interval(function () {
        if ($cookieStore.get("loggedStatus")) {
            if (!$scope.modalData.getHttpRequest) {
                $scope.modalData.getUserMessages($scope.modalData.messageUser, $scope.modalData.messageId, $scope.modalData.onlineUserStatus,
                        $scope.modalData.onlineUserTiming);
                $scope.modalData.showRefreshing = false;
            }

        }
    }, 10000)




    $scope.modalData.onlineUsers = {};
    $scope.modalData.getOnlineUsers = function () {
        try {
            console.log('called or not')
            if (!$scope.modalData.getHttpRequest) {
                $scope.modalData.getHttpRequest = true;
                var url = serverURL + 'getOnlineUsers'
                $http.
                        get(url)
                        .success(function (data) {
                            console.log(data)
                            $scope.modalData.getHttpRequest = false;
                            if (data.status == 1) {

                                $scope.modalData.onlineUsers = data.data;
                            } else {
                                $scope.modalData.onlineUsers = {};
                            }

                        })
                        .error(function (error) {
                            console.log(error);
                        })
            } else {
                console.log('HTTP already in progress');
            }
        } catch (e) {
            console.log(e)
        }
    }

    $scope.modalData.getOnlineUsers();
    $scope.modalData.approveCerts = {};
    $scope.modalData.getApproveCertificates = function (num, search) {

        var arrayData = {}
        arrayData.search = search;
        if (angular.isDefined(search)) {
            arrayData.search = search;
        } else {
            arrayData.search = '';
        }
        try {
            if (dataStorage.allCertData > 0 && num == 1) {
                $scope.modalData.approveCerts = dataStorage.allCertData
            } else {
                $scope.data.showGritter(3);
                var url = serverURL + 'getApproveCertificates'
                $http.
                        post(url, arrayData)
                        .success(function (data) {
                            console.log(data.data)
                            $scope.data.showGritter(1);
                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.modalData.approveCerts = data.data;
                                dataStorage.ChangeCertData(data.data)
                            } else {
                                dataStorage.allCertData = {};
                                $scope.modalData.approveCerts = {};
                                $scope.data.showGritter(2);
                            }

                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {

            $scope.data.showGritter(0);
        }



    }
    $scope.modalData.typeaheadtest = 'Call from typeahead';
    $scope.modalData.approveCertsForPrinting = function (id, approved) {

        var users = $scope.modalData.approveCerts;
        var removed = false;
        var status = 1;
        console.log($scope.modalData.approveCerts);
        for (var i = 0; i < users.length; i++) {

            if (users [i]['id'] == id) {

                if (approved == 0) {
                    users [i]['approved'] = 0;
                    //status = 0;
                    users [i]['approvalStatus'] = 'Unapproved';
                }
                if (approved == 3) {
                    approved = 0;
                    users [i]['approved'] = 0;
                    status = 3;
                    users [i]['status'] = 3;
                    users [i]['approvalStatus'] = 'Unapproved';
                    users.splice(i, 1);
                } else if (approved == 1) {

                    users [i]['approved'] = 1;
                    status = 1;
                    users [i]['approvalStatus'] = 'Approved';
                } else if (approved == 2) {
                    users [i]['approved'] = 2;
                    status = 1;
                    users [i]['approvalStatus'] = 'Held';
                } else {

                }
                removed = true;
                break;
            }

        }
        $scope.modalData.approveCerts = users;
        if (removed) {
            var approv = {};
            approv.approved = approved;
            if (approved == 1) {
                approv.creditedBy = $cookieStore.get('id');
                approv.paidFor = 1;
            } else {
                approv.creditedBy = '';
            }
            approv.status = status;
            $scope.data.saveUpdate(approv, id, 'TBL_CERTIFICATES');
        }



    }
    $scope.modalData.updatePassword = function (password) {
        var data = {};
        data.password = password;
        data.changedPassword = 1;
        var id = $cookieStore.get('id');
        $scope.data.saveUpdate(data, id, 'TBL_USERS');
        $cookieStore.put("changePassword", 1);
        $scope.data.confirmPassword = '';
        $scope.data.password = '';
        $location.path("/todo");
    }
    $scope.data.currentClickedCert = {};
    $cookieStore.put('certId', 0);
    $scope.modalData.certificateUpdates = function (cert, status) {

        $scope.data.currentClickedCert = cert;
        $scope.data.currentClickedCert.operationStatus = status;
        console.log($scope.data.currentClickedCert);
        if (status == 0) {
            $scope.data.currentClickedCert.heading = 'Cancelling';
        }
        if (status == 2) {
            $scope.data.currentClickedCert.heading = 'Holding';
        }
        if (status == 1) {
            $scope.data.currentClickedCert.heading = 'Re-Approving';
        }
        if (status == 3) {
            $scope.data.currentClickedCert.heading = 'Deleting';
        }


    }
    $scope.data.addPayment = {};
    $scope.data.addComment = {}
    function savepayment(dataArray) {
        var paymentData = {};
        try {
            paymentData.code = $scope.data.getRandomCode();
            paymentData.createdBy = $cookieStore.get('id');
            paymentData.certId = dataArray.id;
            paymentData.amount = dataArray.amount;
            paymentData.priceGroupId = dataArray.plan;
            var arrayData = {}
            $scope.data.showGritter(3);
            arrayData.data = paymentData;
            arrayData.tableName = 'TBL_SIMPLE_PAYMENTS';
            console.log(arrayData);
            var url = serverURL + 'saveGlobalData'
            $http.
                    post(url, arrayData)
                    .success(function (data) {


                        if (data.status == 1) {
                            $scope.data.showGritter(1);
                            $scope.data.addPayment = {}
                            $scope.data.addComment = {}
                        } else {
                            $scope.data.showGritter(7, data.message);
                        }
                    }).error(function (error) {
               $scope.data.showGritter(7,"Server error,try again");
            })
        } catch (e) {
            console.log(e);
        }


    }
    $scope.modalData.savePaymentUpdate = function (paymentData, status) {
        console.log(paymentData);
        var tempData = $scope.data.currentClickedCert;
        paymentData.certId = tempData.id;
        var tableName = '';
        if (status == 0 || status == 2) {
            tableName = 'TBL_CERTIFICATE_COMMENTS';
            paymentData.actionStatus = status;
        } else if (status == 1) {
            tableName = 'TBL_SIMPLE_PAYMENTS';
        } else {

        }
        paymentData.code = $scope.data.getRandomCode();
        var arrayData = {}
        $scope.data.showGritter(5);
        paymentData.createdBy = $cookieStore.get('id');
        arrayData.data = paymentData;
        arrayData.tableName = tableName;
        //arrayData.whereColumn = whereColumn;

        try {
            var url = serverURL + 'saveGlobalData'
            $http.
                    post(url, arrayData)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.modalData.approveCertsForPrinting(tempData.id, tempData.operationStatus);
                            $scope.data.addPayment = {}
                            $scope.data.addComment = {}
                        } else {
                            $scope.data.showGritter(7, data.message);
                        }
                    })
        } catch (e) {
            console.log(e);
        }







    }
    $scope.modalData.certApprovalRenewal = function (datas) {
        try {

            if (angular.isDefined(datas)) {

                console.log($scope.modalData.fetchCurrentData);
                for (var i = 0; i < $scope.modalData.fetchCurrentData; i++) {
                    if ($scope.modalData.fetchCurrentData[i]['id'] == datas.priceGroupId) {
                        var period = $scope.modalData.fetchCurrentData[i]['period'];
                        break;
                    }
                }
                var info = {};
                var savePayment = {};
                $scope.data.showGritter(5);
                info.id = $scope.data.renewalCertId;
                info.amount = datas.amount;
                info.date = returnStringDate($('#date').val());
                info.createdBy = $cookieStore.get('id');
                info.plan = datas.priceGroupId;
                var url = serverURL + 'renewCertificate';
                var id = datas;
                $http
                        .post(url, info)
                        .success(function (data) {
                            console.log(data)
                            if (data.status == 1) {
                                savepayment(info);
                                $scope.data.showGritter(6);
                            } else {
                                $scope.data.showGritter(99, 'Incorrect data consistency,please try again');
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(99, 'Could not save,server error occured,try again later');
                        })

            }
        } catch (e) {

        }
    }
    $scope.modalData.getSavedCertificates = function () {

        var arrayData = {}
        try {
            $scope.data.showGritter(4);
            var url = serverURL + 'getClientCertificates'
            $http.
                    get(url)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.data.showGritter(1);
                            $scope.modalData.savedCerts = data.data;
                        } else {
                            $scope.data.showGritter(2);
                        }

                    })
                    .error(function (error) {
                        $scope.data.showGritter(0);
                    })

        } catch (e) {

            $scope.data.showGritter(0);
        }
    }


    $scope.modalData.customerCert = {};
    $scope.modalData.getAllCustomerVehicleDtls = function (id) {
        try {
            $scope.data.showList = false;
            $scope.data.showExtraInfo = true;
            var tempArray = $scope.modalData.vehicleJoinCustomers;
            if (tempArray.length > 0) {
                for (var i = 0; i < tempArray.length; i++) {
                    if (tempArray[i]['id'] == id) {
                        console.log(tempArray[i]);
                        $scope.data.showList = false;
                        $scope.data.showExtraInfo = true;
                        $scope.modalData.customerCert = tempArray[i];
                        console.log($scope.modalData.customerCert)
                        break;
                    }
                }
            } else {
                $scope.data.showGritter(8);
            }


        } catch (e) {
            $scope.data.showGritter(10);
        }
    }



    $scope.modalData.vehiclePerCustomer = [];
    $scope.modalData.customerTicketInfo = {};
    $scope.modalData.showRegNo_Date = true;
    $rootScope.period = 30;
    $scope.modalData.showRecheck = function (id) {
        $scope.modalData.showRegNo_Date = true;
        $scope.modalData.returnTicketAssignment(id);
        if ($scope.data.reasons.length > 0) {
            for (var i = 0; i < $scope.data.reasons.length; i++) {
                if ($scope.data.reasons[i]['reason'] == id) {
                    $rootScope.period = $scope.data.reasons[i]['period'];
                }
            }
        }
        if (id == 'NEW') {
            $scope.modalData.newInstallationTrue = true;
        } else {
            if (id == 'GENERAL INQUIRY' || id == 'THANK YOU') {
                $scope.modalData.showRegNo_Date = false;
            }
            $scope.data.saveTickets.kind = 'Recheck';
            $scope.modalData.recheckTrue = true;
            $scope.modalData.newInstallationTrue = false;
        }
    }
    $scope.modalData.showNewInstallation = function () {

        $scope.modalData.newInstallationTrue = true;
        $scope.modalData.recheckTrue = false;
        $scope.modalData.showTicketCreation = false;
        $scope.data.saveTickets.issue = 'NEW INSTALLATION';
        $scope.data.saveTickets.kind = 'NEW INSTALLATION';
    }
    $scope.modalData.disableCheckBox = false;
    $scope.modalData.returnTicketAssignment = function (issue) {

        if (issue == 'RECHECK' || issue == 'NEW INSTALLATION' || issue == 'REPLACEMENT') {
            $scope.modalData.disableCheckBox = true;
            $scope.data.saveTickets.closedFlag = false;
            return true;
        } else {
            $scope.modalData.disableCheckBox = false;
            return false;
        }

    }



    $scope.data.filterReason = '';
    $scope.modalData.filterTicket = function (type) {

        $scope.data.filterReason = type;
    }
    $scope.data.filterCerts = '';
    $scope.modalData.filterCertsFxn = function (type) {

        $scope.data.filterCerts = type;
    }
    function returnCustomerId(selected) {
        var governor = dataStorage.customersjoinVehicles;
        var regNoStarts = selected.indexOf("#");
        var regNo = selected.substring(regNoStarts + 1);
        var id;
        var returnData = {};
        if (governor.length > 0) {
            var tempArray = [];
            for (var i = 0; i < governor.length; i++) {

                if (regNo == governor[i]['regNo']) {
                    id = governor[i]['id'];
                    returnData.vehicleId = id;
                    returnData.custId = governor[i]['custId'];
                    break;
                }
            }

            return returnData;
        }
    }

    function returnTheCustomerId(selected) {
        var customer = dataStorage.allCustomers;
        var regNoStarts = selected.indexOf("#");
        var id = selected.substring(regNoStarts + 1);
        var id;
        var returnData = {};
        if (customer.length > 0) {
            var tempArray = [];
            for (var i = 0; i < customer.length; i++) {

                if (id == customer[i]['id']) {
                    returnData.custId = customer[i]['id'];
                    break;
                }
            }

            return returnData;
        }
    }
    function returnTheVehicleId(selected) {
        var vehicles = dataStorage.allAppData;
        var regNoStarts = selected.indexOf("#");
        var id = selected.substring(regNoStarts + 1);
        var id;
        var returnData = {};
        if (vehicles.length > 0) {
            var tempArray = [];
            for (var i = 0; i < vehicles.length; i++) {

                if (id == vehicles[i]['id']) {
                    returnData.vehicleId = vehicles[i]['id'];
                    break;
                }
            }

            return returnData;
        }
    }

    $scope.modalData.pickVehicle = function (selected) {

        var Vehicles = returnTheVehicleId(selected);
        $scope.modalData.holdOnClickedVehicle(Vehicles.vehicleId);
    }


    $scope.modalData.pickCustomer = function (selected) {

        var customerJoinVehicles = returnTheCustomerId(selected);
        $scope.modalData.holdOnClickedClient(customerJoinVehicles.custId);
    }
    $scope.data.invoice = {}
    $scope.modalData.pickInvCustomer = function (selected) {

        var customerJoinVehicles = returnTheCustomerId(selected);
        $scope.data.invoice.custId = customerJoinVehicles.custId;
    }



    $scope.modalData.pickGovernorCVehicle = function (selected, type) {

        var customerJoinVehicles = returnCustomerId(selected);
        if (type == 1) {
            $scope.modalData.getAllCustomerVehicleDtls(customerJoinVehicles.vehicleId)
        } else {
            $scope.modalData.getAllCustomerDtls(customerJoinVehicles.custId);
        }

    }



    $timeout(function () {
        $scope.modalData.getAllInsurers('1');
        $scope.modalData.getAllFinancierNew('1');
    }, 4000)





    $scope.data.showList = true;
    function returnFinancierName(financierId) {
        var name = 'NONE';
        console.log()
        if (dataStorage.financiers.length > 0) {
            var tempArray = dataStorage.financiers;
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i]['id'] == financierId) {
                    name = tempArray[i]['financierName'];
                    break;
                }
            }
        }
        return name;
    }

    function returnInsuranceName(financierId) {

        var name = 'NONE';
        if (dataStorage.insurers.length > 0) {
            var tempArray = dataStorage.insurers;
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i]['id'] == financierId) {
                    name = tempArray[i]['insuranceName'];
                    break;
                }
            }
        }
        return name;
    }



    $scope.modalData.getAllCustomerDtls = function (custId) {

        $scope.data.showList = false;
        $scope.data.showExtraInfo = true;
        $scope.modalData.vehiclePerCustomer = [];
        var tempArray = $scope.modalData.vehicleJoinCustomers;
        if (tempArray.length > 0) {
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i]['custId'] == custId) {
                    console.log(tempArray[i]);
                    $scope.data.showList = false;
                    $scope.data.showExtraInfo = true;
                    tempArray[i]['financierName'] = returnFinancierName(tempArray[i]['financierName']);
                    tempArray[i]['insurorName'] = returnInsuranceName(tempArray[i]['insurorName']);
                    tempArray[i]['expiryDate'] = $scope.data.convertToHumanTime(tempArray[i]['validityEndOn']);
                    tempArray[i]['expiryGvDate'] = $scope.data.convertToHumanTime(tempArray[i]['validityGvEndOn']);
                    $scope.modalData.vehiclePerCustomer.push(tempArray[i]);
                }
            }
        } else {
            $scope.data.showGritter(8);
        }

        $scope.modalData.customerTicketInfo = $scope.modalData.vehiclePerCustomer[0];
    }

    $scope.$watch('modalData.customerTicketInfo', function () {
        $scope.modalData.customerDetails.id = $scope.modalData.customerTicketInfo.custId;
    })






    $scope.modalData.editPayments = function () {

        $scope.modalData.makeLinkActive('account');
        console.log($scope.modalData.activeLink);
    }
    $scope.data.userSettings = {};
    $scope.data.userSettings.code = $scope.data.getRandomCode();
    $scope.modalData.returnStatusStore = function (status) {
        if (status == 7) {
            return 'Unpaid'
        } else if (status == 1) {
            return 'Active';
        } else {
            return status;
        }
    }
    $scope.modalData.deactivateRecord = function (id, tableName, status, side) {

        try {
            var removed = false;
            var url = serverURL + 'deactivateRecord';
            var data = {};
            data.id = id;
            data.status = status;
            data.tableName = tableName;
            if (Number(id) > 0) {

                if (tableName == 'TBL_USERS') {

                    var users = $scope.data.allUsers;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.data.allUsers = users;
                    }
                } else if (tableName == 'TBL_DATALINES') {

                    var users = $scope.modalData.datalinesData;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.modalData.datalinesData = users;
                    }
                } else if (tableName == 'TBL_ASSIGNED_DEVICES') {

                    var users = $scope.modalData.assignedDevices;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.modalData.assignedDevices = users;
                    }
                } else if (tableName == 'TBL_VEHICLES') {

                    var users = $scope.data.accountVehicles;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.data.accountVehicles = users;
                    }
                } else if (tableName == 'TBL_CUSTOMERS') {

                    var users = $scope.modalData.allCustomers;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.modalData.allCustomers = users;
                    }
                } else if (tableName == 'TBL_SIMPLE_TICKETS') {
                    if (angular.isDefined(side)) {
                        var users = $scope.modalData.storeTickets;
                    } else {
                        var users = $scope.modalData.tickets;
                    }
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                //users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        if (angular.isDefined(side)) {
                            $scope.modalData.storeTickets = users;
                        } else {
                            $scope.modalData.allCustomers = users;
                        }
                    }
                } else if (tableName == 'TBL_SIMPLE_PAYMENTS') {

                    var users = $scope.data.allPaymentsData;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.data.allPaymentsData = users;
                    }
                } else if (tableName == 'TBL_USER_GROUPS') {
                    var users = $scope.data.groups;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.data.groups = users;
                    }
                } else if (tableName == 'TBL_INSURANCES') {

                    var users = $scope.modalData.insurers;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.modalData.insurers = users;
                    }
                } else if (tableName == 'TBL_FINANCIER') {

                    var users = $scope.modalData.financiers;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.modalData.financiers = users;
                    }
                } else if (tableName == 'TBL_ALLOWED_MACHINES') {
                    var users = $scope.modalData.machineIps;
                    for (var i = 0; i < users.length; i++) {

                        if (users [i]['id'] == id) {
                            if (status == 0) {
                                users [i]['status'] = 0;
                            } else if (status == 1) {
                                users [i]['status'] = 1;
                            } else {
                                users.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                        $scope.modalData.machineIps = users;
                    }
                } else {
                    for (var i = 0; i < $scope.modalData.fetchCurrentData.length; i++) {

                        if ($scope.modalData.fetchCurrentData[i]['id'] == id) {
                            if (status == 0) {
                                $scope.modalData.fetchCurrentData[i]['status'] = 0;
                            } else if (status == 1) {
                                $scope.modalData.fetchCurrentData[i]['status'] = 1;
                            } else {
                                $scope.modalData.fetchCurrentData.splice(i, 1);
                            }
                            removed = true;
                            break;
                        }
                    }
                }

                if (removed) {

                    if (status == 0) {
                        $scope.modalData.saveUserLogs('Deactivated a record on ' + tableName.substring(4, 15), id);
                    } else if (status == 1) {
                        $scope.modalData.saveUserLogs('Activated a record on ' + tableName.substring(4, 15), id);
                    } else {
                        $scope.modalData.saveUserLogs('Deleted a record on ' + tableName.substring(4, 15), id);
                    }
                    $http
                            .post(url, data)
                            .success(function (data) {
                                if (data.status == 1) {


                                    $scope.data.showGritter(13);
                                } else {
                                    $scope.data.showGritter(0);
                                }


                            })
                            .error(function (error) {
                                $scope.data.showGritter(0);
                            })
                }
            }
        } catch (e) {
            console.log(e)
            // $scope.modalData.createFailLogs(e);
        }
    }
    $scope.data.userDetails = {};
    $scope.data.getUserDetails = function () {
        $scope.data.id = $cookieStore.get('id')
        $scope.data.userDetails.groupId = $cookieStore.get('groupId')
        $scope.data.userDetails.fullnames = $cookieStore.get('fullnames')
        $scope.data.userDetails.password = '12345'
        $scope.data.userDetails.username = $cookieStore.get('username')

    }
    $scope.data.dataline = {};
    $scope.modalData.genSimCode = function () {
        $scope.data.dataline.code = $scope.data.getRandomCode();
    }
    $scope.modalData.counter = [];
    $scope.modalData.counterFcn = function () {
        var tempArr = [];
        for (var i = 1; i < 31; i++) {
            $scope.modalData.counter.push(i);
        }

    }
    $scope.modalData.delayDeviceCall = function (tableName, num) {
        $timeout(function () {
            $scope.modalData.getDevices(tableName, num)
        }, 1000)

    }
    $scope.modalData.delayDatalineCall = function (tableName, num) {
        $timeout(function () {
            $scope.modalData.getDataLines(tableName, num)
        }, 2000)

    }

    $scope.modalData.getDataLines = function (tableName, num) {
        try {
            var url = serverURL + 'getFetchData'
            var table = {}

            if (dataStorage.simCards.length > 0 && num == 1) {

                $scope.modalData.datalinesData = dataStorage.simCards;
            } else {

                $scope.data.showGritter(3);
                table.tableName = tableName;
                $http
                        .post(url, table)
                        .success(function (data) {
                            if (data.status == 1) {

                                $scope.data.showGritter(1);
                                $scope.modalData.datalinesData = data.data;
                                dataStorage.ChangeDataLineData($scope.modalData.datalinesData);
                            } else {
                                $scope.data.showGritter(2);
                            }
                            $scope.modalData.hideTableTillResponse = true;
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })

            }
        } catch (e) {
            console.log(e);
        }
    }
    $scope.modalData.devices = {};
    $scope.data.assignUserResources = {};
    $scope.modalData.deviceExists = true;
    $scope.modalData.validateImei = function (imei) {
        $scope.modalData.deviceExists = true;
        if (angular.isDefined(imei)) {
            if (imei.length > 2) {
                console.log(imei)
                for (var i = 0; i < $scope.modalData.devices.length; i++) {
                    if ($scope.modalData.devices[i]['imei'] == imei) {

                        $scope.data.assignUserResources.deviceId = $scope.modalData.devices[i]['id'];
                        $scope.modalData.deviceExists = false;
                        break;
                    }
                }
            }
        }
        console.log(imei)

    }
    $scope.modalData.datalinesData = {};
    $scope.modalData.datalineExists = true;
    $scope.modalData.validateDataLine = function (simNumber) {
        $scope.modalData.datalineExists = true;
        if (angular.isDefined(simNumber)) {
            if (simNumber.length > 2) {

                for (var i = 0; i < $scope.modalData.datalinesData.length; i++) {
                    if ($scope.modalData.datalinesData[i]['simNumber'] == simNumber) {
                        $scope.data.assignUserResources.dataLineId = $scope.modalData.datalinesData[i]['id'];
                        $scope.modalData.datalineExists = false;
                        break;
                    }
                }
            }
        }
        console.log(simNumber)
    }


    $scope.modalData.getDevices = function (tableName, num) {
        try {

            if (dataStorage.devices.length > 0 && num == 1) {

                $scope.modalData.devices = dataStorage.devices;
            } else {
                var url = serverURL + 'getFetchData'
                var table = {}

                table.tableName = tableName;
                $http
                        .post(url, table)
                        .success(function (data) {

                            if (data.status == 1) {

                                $scope.data.showGritter(1);
                                $scope.modalData.devices = data.data;
                                dataStorage.ChangeDeviceData($scope.modalData.devices);
                            } else {
                                $scope.modalData.devices = {};
                                $scope.data.showGritter(2);
                            }
                            $scope.modalData.hideTableTillResponse = true;
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }
    $scope.modalData.getUnlinkedDelay = function () {
        $timeout(function () {
            $scope.modalData.getAllUnlinkedVehicles();
        }, 2000)

    }

    $scope.modalData.getAllUnlinkedVehicles = function (num) {
        try {
            if (dataStorage.unlinkedVehicles.length > 0 && num == 1) {

                $scope.modalData.unlinkedVehicles = dataStorage.unlinkedVehicles;
            } else {
                var url = serverURL + 'unLinkedVehicles'
                var table = {}
                $scope.data.showGritter(3);
                $http
                        .get(url)
                        .success(function (data) {
                            console.log(data)
                            if (data.status == 1) {

                                $scope.data.showGritter(1);
                                $scope.modalData.unlinkedVehicles = data.data;
                                dataStorage.ChangeUnlinkedVehicles(data.data);
                            } else {
                                $scope.modalData.unlinkedVehicles = {};
                                $scope.data.showGritter(2);
                            }
                            $scope.modalData.hideTableTillResponse = true;
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }
    $scope.modalData.storeTickets = {};
    $scope.modalData.getShoppedItems = function () {
        try {

            var url = serverURL + "getTicketsFromCart"
            $http
                    .get(url)
                    .success(function (data) {

                        $scope.modalData.storeTickets = data.data;
                    })
                    .error(function (error) {
                       $scope.data.showGritter(0);
                    })
        } catch (e) {
            console.log(e)
        }
    }
    $scope.modalData.showImei = false;
    $scope.modalData.updateVehicleImei = function (imei, vehicleId) {
        $scope.modalData.vehicleDetailsWhere.deviceSerial = imei;
        $scope.modalData.showImei = false;
        var update = {};
        update.imei = imei;
        update.vehicleId = vehicleId.id;
        update.regNo = vehicleId.regNo;
        $scope.data.showGritter(3);
        var url = serverURL + 'updateVehicleDetails';
        if (angular.isDefined(imei)) {
            $http.post(url, update)
                    .success(function (data) {
                        if (data.status == 1) {
                            $scope.data.showGritter(6);
                        } else {
                            $scope.data.showGritter(0);
                        }
                    })
                    .error(function () {
                        $scope.data.showGritter(2);
                    })
        }
    }
     $scope.modalData.showDataline = false;
    $scope.modalData.updateVehicleDataline = function (dataline, vehicleId) {
        $scope.modalData.vehicleDetailsWhere.simCard = dataline;
        $scope.modalData.showDataline = false;
        var update = {};
        update.dataline = dataline;
        update.vehicleId = vehicleId.id;
        update.regNo = vehicleId.regNo;
        $scope.data.showGritter(3);
        var url = serverURL + 'updateVehicleDetailsDataline';
        if (angular.isDefined(dataline)) {
            $http.post(url, update)
                    .success(function (data) {
                        if (data.status == 1) {
                            $scope.data.showGritter(6);
                        } else {
                            $scope.data.showGritter(2);
                        }
                    })
                    .error(function () {
                        $scope.data.showGritter(2);
                    })
        }
    }
    $scope.modalData.getClosedTickets = function (tableName) {
        try {
            var url = serverURL + 'getClosedTickets'
            var table = {}

            table.tableName = tableName;
            $http
                    .get(url)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {

                            $scope.data.showGritter(1);
                            $scope.modalData.closedTickets = data.data;
                        } else {
                            $scope.modalData.closedTickets = {};
                            $scope.data.showGritter(2);
                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }





    $scope.modalData.hidePieces = function (id) {
        if (angular.isDefined(id)) {
            return false
        } else {
            return true;
        }

    }



    $scope.modalData.gactiveLink = 'addGroup';
    $scope.modalData.editFunction = function (id, tableName, status) {
        try {

            if (angular.isString(tableName)) {
                $scope.modalData.saveUserLogs('Tried to edit a record on ' + tableName.substring(4, 15), id)
            }

            if (Number(id)) {
                if (tableName == 'TBL_USERS') {
                    for (var i = 0; i < $scope.data.allUsers.length; i++) {
                        if ($scope.data.allUsers[i]['id'] == id) {

                            $scope.data.userSettings = $scope.data.allUsers[i];
                            break;
                        }
                    }
                } else if (tableName == 'TBL_VEHICLES') {
                    for (var i = 0; i < $scope.data.accountVehicles.length; i++) {
                        if ($scope.data.accountVehicles[i]['id'] == id) {

                            $scope.data.vehicleSettings = $scope.data.accountVehicles[i];
                            break;
                        }
                    }
                } else if (tableName == 'TBL_USER_GROUPS') {
                    for (var i = 0; i < $scope.data.groups.length; i++) {
                        if ($scope.data.groups[i]['id'] == id) {
                            $scope.modalData.gactiveLink = 'addGroup';
                            $scope.data.company = $scope.data.groups[i];
                            break;
                        }
                    }
                } else if (tableName == 'TBL_DATALINES') {
                    for (var i = 0; i < $scope.modalData.datalinesData.length; i++) {
                        if ($scope.modalData.datalinesData[i]['id'] == id) {

                            $scope.data.dataline = $scope.modalData.datalinesData[i];
                            break;
                        }
                    }
                } else if (tableName == 'TBL_DEVICES') {

                    var customers = $scope.modalData.devices;
                    for (var i = 0; i < customers.length; i++) {
                        if (customers[i]['id'] == id) {

                            $scope.data.globalSettings = customers[i];
                            console.log($scope.data.globalSettings);
                            break;
                        }
                    }
                } else if (tableName == 'TBL_FINANCIER') {

                    var customers = $scope.modalData.financiers;
                    for (var i = 0; i < customers.length; i++) {
                        if (customers[i]['id'] == id) {

                            $scope.data.globalSettings = customers[i];
                            console.log($scope.data.globalSettings);
                            break;
                        }
                    }
                } else if (tableName == 'TBL_INSURANCES') {

                    var customers = $scope.modalData.insurers;
                    for (var i = 0; i < customers.length; i++) {
                        if (customers[i]['id'] == id) {

                            $scope.data.globalSettings = customers[i];
                            console.log($scope.data.globalSettings);
                            break;
                        }
                    }
                } else if (tableName == 'TBL_CUSTOMERS') {
                    var customers = $scope.modalData.allCustomers;
                    for (var i = 0; i < customers.length; i++) {
                        if (customers[i]['id'] == id) {

                            $scope.data.globalSettings = customers[i];
                            console.log($scope.data.globalSettings);
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.modalData.fetchCurrentData.length; i++) {
                        if ($scope.modalData.fetchCurrentData[i]['id'] == id) {

                            $scope.data.globalSettings = $scope.modalData.fetchCurrentData[i];
                            console.log($scope.data.globalSettings)
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }


    }

    $scope.modalData.vehicleJoinCustomers = {};
    $scope.modalData.getAllVehiclesJoinCustomerKeyUp = function (customerSearch) {
        try {
            // $scope.modalData.saveUserLogs('searched for a vehicle/customer beginning with' + customerSearch, 'XX')
            var tableName = {};
            $scope.data.showGritter(3);
            var data = {};
            $scope.modalData.vehicleJoinCustomers = {}
            data.search = customerSearch;
            var url = serverURL + 'getVehiclesJoinCustomers';
            $http.post(url, data)
                    .success(function (datas) {
                        $scope.data.showGritter(1);
                        if (datas.status == 1) {
                            $scope.data.showGritter(1);
                            $scope.modalData.vehicleJoinCustomers = datas.data
                        } else if (datas.status == 1) {
                            $scope.data.showGritter(2);
                            $scope.modalData.vehicleJoinCustomers = {};
                        } else {
                            $scope.data.showGritter(2);
                        }
                    })
                    .error(function (error) {

                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            $scope.data.showGritter(10);
        }
    }
    $scope.modalData.unlinkCustomerVehicle = function (id) {

        var tempData = $scope.modalData.vehicleJoinCustomers;
        try {
            console.log($scope.modalData.vehicleJoinCustomers)
            for (var i = 0; i < tempData.length; i++) {
                if (tempData[i]['id'] == id) {
                    console.log(tempData[i]['id']);
                    tempData.splice(i, 1);
                    break;
                }
            }
            $scope.modalData.vehicleJoinCustomers = tempData;
            var data = {};
            data.custId = null;
            $scope.data.saveUpdate(data, id, 'TBL_VEHICLES');
        } catch (e) {

        }
    }
    $scope.modalData.approveCts = {};
    $scope.modalData.updateUnlink = function (id) {
        $scope.modalData.approveCts.id = id;
        $("#invalidEmail").modal();
        $("#invalidEmail").modal("show");
    }
    $scope.modalData.printOnPopWindow = function (path) {
        var printWindow = window.open(path, "", "width=1000,height=600");
    }

    function returnStringDate(dateString) {

        if (dateString != 0)
        {
            var d = Date.parse(dateString) / 1000

            return (d + (24 * 60 * 60));
        } else {
            return 1;
        }
    }

    $scope.modalData.sendEmail = function () {

    }



    $scope.data.showModalEmail = function () {
        //  alert()
        //  $("#invalidEmail").modal();
        // $("#invalidEmail").modal("show");
    }

    $scope.data.invalidModalEmail = function () {
        $("#invalidEmail").modal();
        $("#invalidEmail").modal("show");
    }


    $scope.modalData.getBasicVehicleDtls = function (custId) {

        try {
            var tableName = {};
            $scope.data.showGritter(3);
            var searchData = {};
            searchData.id = custId;
            var url = serverURL + 'fetchVehiclesWhereId';
            $http.post(url, searchData)
                    .success(function (data) {

                        console.log(data)
                        if (data.status == 1) {
                            $scope.data.showGritter(1);
                            $scope.modalData.vehicleDetails = data.data
                            $scope.modalData.noVehicle = false;
                        } else {
                            $scope.data.showGritter(2);
                            $scope.modalData.noVehicle = true;
                            $scope.modalData.vehicleDetails = '';
                        }
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0);
                    })

        } catch (e) {

        }
    }


    $scope.modalData.ticketStatus = '';
    $scope.modalData.filterTickets = function (status) {
        $scope.modalData.ticketStatus = status;
        $scope.modalData.myIdFilter = '';
    }
    $scope.modalData.myIdFilter = '';
    $scope.modalData.myTickets = function () {
        $scope.modalData.myIdFilter = $cookieStore.get('id');
        $scope.modalData.ticketStatus = '';
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


    $scope.modalData.returnDisabledClass = function (id) {
        if (Number(id) > 0) {
            return false;
        } else {
            return true;
        }


    }
    $scope.modalData.activeLink = 'vehicles';
    $scope.modalData.makeLinkActive = function (link) {

        $scope.modalData.activeLink = link;
    }
    $scope.modalData.returnActiveLink = function (link) {
        if ($scope.modalData.activeLink == link) {
            return 'active'
        }
    }
    $scope.data.makeActive = function (link, tableName) {
        $scope.data.linkChecker = link;
        $scope.data.tablename = tableName;
        $scope.data.linkAdd = ''
        $scope.data.linkView = ''
        $scope.modalData.getGlobalData(tableName);
        if (link == 'add') {
            $scope.data.linkAdd = 'active'
        } else {
            $scope.data.linkView = 'active'
        }
//        if ($scope.modalData.currentTable != tableName) {
//            $scope.modalData.currentTable = tableName;
//            //$scope.modalData.getGlobalData(tableName)
//        }
        // $scope.modalData.getGlobalData(tableName)
    }
    $scope.modalData.tickets = {};
    $scope.modalData.getTickets = function (num) {
        try {

            var url = serverURL + 'getTickets';
            if (dataStorage.tickets.length > 0 && num == 1) {
                $scope.modalData.tickets = dataStorage.tickets
            } else {
                $scope.data.showGritter(3);
                $http.get(url)
                        .success(function (data) {

                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.modalData.tickets = data.data
                                $scope.data.tickets = data.data

                                dataStorage.ChangeTicketsData(data.data);
                                $scope.modalData.noData = false;
                            } else {
                                $scope.data.showGritter(2);
                                $scope.modalData.tickets = '';
                                $scope.modalData.customerDetails = '';
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })

            }
        } catch (e) {

        }
    }
    $scope.modalData.searchVehicles = {};
    $scope.modalData.inDepthSearch = function (regNo) {
        try {
            $scope.data.showGritter(3);
            var search = {};
            search.regNo = regNo;
            var url = serverURL + 'getInDepthSearch';
            if (angular.isDefined(regNo)) {
                $http
                        .post(url, search)
                        .success(function (data) {
                            $scope.data.showGritter(1);
                            if (data.status == 1) {
                                $scope.modalData.searchVehicles = data.data;
                            } else {
                                $scope.data.showGritter(2, data.message);
                            }
                        })
                        .error(function (data) {
                            $scope.data.showGritter(0, 'Server Error,Try again');
                        })
            } else {
                $scope.data.showGritter(0, 'Incorrect search data');
            }
        } catch (e) {

        }
    }
    $scope.modalData.getUserDetails = function (searchUser) {
        try {

            var url = serverURL + 'getClientInfo';
            var usernameDetails = {};
            usernameDetails.userName = searchUser;
            $scope.data.showGritter(3);
            $http.post(url, usernameDetails)
                    .success(function (data) {

                        console.log(data.data)
                        if (data.status == 1) {

                            $scope.data.showGritter(1);
                            $scope.modalData.usernameDetails = data.data
                            console.log($scope.modalData.usernameDetails)
                        } else {
                            $scope.data.showGritter(0)
                            $scope.modalData.usernameDetails = '';
                        }
                    })
                    .error(function (error) {
                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            console.log(e)
        }

    }
    $scope.modalData.composePasswordMessage = function (userInfo) {

        $scope.data.sendSMS.MessageTo = userInfo.user_cellphone;
        $scope.data.selected = userInfo.user_cellphone;
        $scope.data.sendSMS.MessageText = 'Dear ' + userInfo.user_name + ', Your login credentials for flex tracking system are, Username : '
                + userInfo.user_account + ' and password : ' + userInfo.user_cellphone + '.';
    }
    $scope.modalData.SaveTicketAssignee = function (userId, currentTicketId) {
        var status = $scope.modalData.checkUserTodaysTickets(userId, currentTicketId);
        console.log('status ' + status);
        if (status < 5) {
            $scope.data.saveUpdate(userId, currentTicketId, 'TBL_SIMPLE_TICKETS');
            $scope.modalData.getTickets();
        } else {
            $scope.data.showGritter(23);
        }
    }
    $scope.modalData.activateForSmsSending = function (validTill) {
        var dateStringStartToday = $scope.data.returnDateToday();
        if ((validTill - dateStringStartToday) < (60 * 24 * 60 * 60)) {

            return false
        } else {
            return true;
        }
    }

    $scope.modalData.checkUserTodaysTickets = function (userId, currentTicketId) {

        var dateStringStartToday = $scope.data.returnDateToday();
        var dateStringEndToday = Number($scope.data.returnDateToday()) + (24 * 60 * 60);
        var tempArray = $scope.data.tickets;
        var ticketCount = 0;
        if (tempArray.length > 0) {

            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i]['assignedToId'] == userId.assignedTo) {

                    if (Number(tempArray[i]['dateDue']) > dateStringStartToday && Number(tempArray[i]['dateDue']) < dateStringEndToday) {
                        if ($scope.modalData.returnTicketAssignment(tempArray[i]['issue'])) {
                            ticketCount++;
                            console.log(ticketCount)
                        }

                    }


                }
            }

            console.log(ticketCount);
        }


        return ticketCount;
    }







    $scope.modalData.separateData = {};
    $scope.modalData.priceGroups = function (tablenam) {

        try {
            console.log('clicked')
            var tableName = {};
            tableName.tableName = tablenam;
            var url = serverURL + 'getFetchData';
            $http.
                    post(url, tableName)
                    .success(function (data) {

                        if (data.status == 1) {
                            console.log(data.data);
                            $scope.modalData.separateData = data.data;
                        }
                    })
                    .error(function (data) {

                    })
        } catch (e) {

        }

    }
    $scope.modalData.userLogs = {};
    $scope.modalData.getUserLogs = function (tablenam) {

        try {
            $scope.data.showGritter(3);
            var tableName = {};
            tableName.tableName = tablenam;
            var url = serverURL + 'getUserLogs';
            $http.
                    post(url, tableName)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.data.showGritter(1);
                            console.log(data.data);
                            $scope.modalData.userLogs = data.data;
                        } else {
                            $scope.data.showGritter(2);
                            $scope.modalData.userLogs = {};
                        }
                    })
                    .error(function (data) {

                    })
        } catch (e) {

        }

    }






    $scope.modalData.searchCustomer = function (searchText) {
        try {
            if (searchText == '' || angular.isUndefined(searchText)) {
                $scope.data.showGritter(12);
            } else {
                var tableName = {};
                $scope.data.showGritter(3);
                var searchData = {};
                searchData.searchData = searchText;
                var url = serverURL + 'searchCustomerDetails';
                $http.post(url, searchData)
                        .success(function (data) {

                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.modalData.customerDetails = data.data
                                console.log(data.data)
                                $scope.modalData.getBasicVehicleDtls($scope.modalData.customerDetails.id)
                                $scope.modalData.noData = false;
                                $scope.data.custError = false;
                            } else {
                                $scope.data.showGritter(2);
                                $scope.modalData.noData = true;
                                $scope.data.custError = true;
                                $scope.modalData.customerDetails = '';
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }

        } catch (e) {

        }

    }

    $scope.modalData.showReprint = false;
    $scope.modalData.noData = true;
    $scope.data.pdfUrl = '';
    $scope.modalData.reprintCertificate = function (vehicleId, duration, marker, id) {

        $cookieStore.put('certId', id);
        $scope.data.showList = false;
        if (marker == 0) {
            $cookieStore.put('certId', id);
            $scope.modalData.printCertificate(Number(duration), vehicleId, 200, 0);
        } else {
            $("#approvedBy").modal();
            $("#approvedBy").modal("show");
            $scope.data.clickedDuration = Number(duration);
            $scope.data.clickedvehicleId = vehicleId;
            $scope.data.certid = id;
            // $scope.modalData.printCertificate(Number(duration), vehicleId, 400, 0);

        }



    }
    //
//    $scope.modalData.unlinkCustomerVehicle = function (id) {
//        var tempData = $scope.modalData.vehicleJoinCustomers;
//        try {
//            console.log(tempData)
//            for (var i = 0; i < tempData.length; i++) {
//                if (tempData[i]['id'] == id) {
//
//                    tempData.splice(i, 1);
//                    break;
//                }
//            }
//            $scope.modalData.vehicleJoinCustomers = tempData;
//        } catch (e) {
//
//        }
//    }
    $scope.modalData.saveDevice = function (deviceData) {
        try {
            if (angular.isDefined(deviceData)) {
                $scope.data.globalSettings.serialNumber = 'SYSTEM GENERATED';
                deviceData.createdBy = $cookieStore.get("id");
                console.log(deviceData);
                var url = serverURL + 'saveDevice';
                $http.
                        post(url, deviceData).
                        success(function (data) {
                            if (data.status == 1) {
                                $scope.data.showGritter(6);
                            } else {
                                $scope.data.showGritter(0, data.message);
                            }
                        }).error(function (error) {
                    console.log(error);
                })

            }
        } catch (e) {

            console.log(e)
        }
    }





    $scope.modalData.saveApproved = function (assignUser, type, table) {

        assignUser.generated = 1;
        if ($scope.data.saveUpdate(assignUser, $scope.data.certid, 'TBL_CERTIFICATES')) {
            console.log($scope.data.clickedvehicleId);
            $scope.modalData.printCertificate($scope.data.clickedDuration, $scope.data.clickedvehicleId, 400, 0);
        } else {
             $scope.data.showGritter(0, 'could not print');
        }
    }
    $scope.data.sendSMS = {};
    $scope.data.sendSMS.MessageText = '';
    $scope.modalData.smsClientExpiry = function (cert) {
        $scope.data.sendSMS.MessageText = 'Dear ' + cert.name + ',Please note that you subscription for '
                + cert.regNo + ' is due expiry on ' + $scope.data.convertToHumanTime(cert.validEndOn) + '.Kindly renew to continue enjoy Flex services'
    }
    $scope.data.renewalCertId = '';
    $scope.modalData.certId = function (id) {

        $scope.data.renewalCertId = id;
    }
    $scope.modalData.returnDeviceType = function (devicetype) {
        if (devicetype == 0) {
            return 'GOVERNOR';
        } else {
            return 'TRACKER';
        }
    }
    $scope.modalData.addCustomer = function (name, mobile) {
        $scope.data.globalSettings.name = name;
        $scope.data.globalSettings.mobile_1 = mobile;
        $scope.data.globalSettings.nextOfKinMobile_1 = mobile;
    }
    $scope.modalData.printCertificate = function (duration, id, month, date, type, ticketNo) {
        $scope.modalData.showReprint = false;
        try {
            if (angular.isDefined(id)) {
                var certId = $cookieStore.get('certId');
                // if (angular.isNumber(duration)) {
                var url = serverURL + 'tcpdfGen'
                var data = {};
                data.certId = certId;
                data.duration = duration;
                $scope.data.showGritter(3);
                data.startDate = 1;
                data.type = type;
                console.log(data);
                if (month < 12) {
                    data.startDate = returnStringDate($('#date').val());
                    data.duration = Number(duration) + Number(month);
                }
                console.log(data.startDate);
                data.id = id;
                data.fullnames = $cookieStore.get('fullnames');
                data.userId = $cookieStore.get('id');
                data.ticketNo = ticketNo;
                data.governorType = $cookieStore.get('governorType');
                console.log(data)
                $cookieStore.put('certId', 0);
                if (data.duration > 0) {
                    $http
                            .post(url, data)
                            .success(function (data) {

                                $scope.data.showGritter(1);
                                if (data.status == 1) {

                                    //$scope.data.showModalEmail();

                                    if (Number(month) <= 12) {
                                        $scope.data.showGritter(11, data.message);
                                        $scope.modalData.saveUserLogs('Printed certificate saved to ' + data.data, 'XX')
                                        //$scope.modalData.getApproveCertificates();

                                    } else {
                                        console.log(data.data)
                                        if (Number(month) > 200) {

                                            $scope.data.pdfUrlNew = data.data;
                                        } else {
                                            $scope.data.pdfUrl = data.data;
                                        }
                                        $scope.modalData.showReprint = true;
                                        $scope.data.showGritter(54);
                                        $scope.modalData.printOnPopWindow(data.data);
                                        $scope.modalData.saveUserLogs('Re-Printed certificate saved to ' + data.data, 'XX');
                                    }


                                    // $scope.modalData.getGlobalData('TBL_CERTIFICATES');


                                } else {
                                    $scope.data.showGritter(0, data.message);
                                }
                                $scope.modalData.hideTableTillResponse = true;
                            })
                            .error(function (error) {
                                $scope.data.showGritter(0);
                            })
//                } else {
//                    $scope.data.showGritter(12);
//                    }
                } else {
                    $scope.data.showGritter(12);
                }
            } else {

                $scope.data.showGritter(8);
            }
        } catch (e) {

        }

    }
    $scope.modalData.names = [];
    $scope.data.showListVehicle = false;
    $scope.data.showExtraInfoVehicle = false;
    $scope.data.showExtraInfoVehicleStyle = 'alert-success'
    $scope.data.currentCustomerSearch.vehicleId = '';
    $scope.modalData.holdOnClickedVehicle = function (id) {
        try {
            if ($scope.modalData.allCustomers.length > 0) {
                for (var i = 0; i < $scope.data.accountVehicles.length; i++) {
                    if ($scope.data.accountVehicles[i]['id'] == id) {
                        $scope.data.showListVehicle = false;
                        $scope.data.showExtraInfoVehicle = true;
                        $scope.data.currentCustomerSearch.model = $scope.data.accountVehicles[i]['model'];
                        $scope.data.currentCustomerSearch.make = $scope.data.accountVehicles[i]['make'];
                        $scope.data.currentCustomerSearch.regNo = $scope.data.accountVehicles[i]['regNo'];
                        $scope.data.currentCustomerSearch.vehicleId = $scope.data.accountVehicles[i]['id'];
                        $scope.data.currentCustomerSearch.deviceType = $scope.data.accountVehicles[i]['deviceType'];
                        $scope.data.currentCustomerSearch.simCard = $scope.data.accountVehicles[i]['simCard'];
                        $scope.data.currentCustomerSearch.simSerial = $scope.data.accountVehicles[i]['simSerial'];
                        $scope.data.currentCustomerSearch.deviceImei = $scope.data.accountVehicles[i]['deviceImei'];
                        // alert($scope.data.accountVehicles[i]['custId'])
                        if ($scope.data.accountVehicles[i]['custId'] > 0) {
                            $scope.data.showExtraInfoVehicleStyle = 'alert-danger';
                        }
                        break;
                    }
                }
            } else {
                $scope.data.showGritter(8);
            }
        } catch (e) {

        }
    }
    $scope.modalData.searchDataFxn = function (arg, arg1, arg2, dataSet, certFilter)
    {

        if (dataSet == 'vehicles') {

            var data = dataStorage.allAppData;
            $scope.data.accountVehicles = $filter('filterData')(data, arg, arg1, arg2);
        }
        if (dataSet == 'customers') {

            var data = dataStorage.allCustomers;
            $scope.modalData.allCustomers = $filter('filterData')(data, arg, arg1, arg2);
        }
        if (dataSet == 'cv') {
            var data = dataStorage.customersjoinVehicles;
            $scope.modalData.vehicleJoinCustomers = $filter('filterData')(data, arg, arg1, arg2);
        }

        if (dataSet == 'certs') {
            $scope.modalData.getApproveCertificates(2, arg);
            var data = dataStorage.allCertData;
            //   $scope.modalData.approveCerts = $filter('filterData')(data, arg, arg1, arg2);


        }
        if (dataSet == 'devices') {

            var data = dataStorage.devices;
            $scope.modalData.devices = $filter('filterData')(data, arg, arg1, arg2);
        }
        if (dataSet == 'tick') {


        }

        if (dataSet == 'datalines') {

            var data = dataStorage.datalines;
            $scope.data.datalines = $filter('filterData')(data, arg, arg1, arg2);
        }
        if (dataSet == 'tickets') {

            var data = dataStorage.tickets;
            $scope.modalData.tickets = $filter('filterData')(data, arg, arg1, arg2);
        }




    }
    $scope.modalData.currentClickedRow = -1;
    $scope.modalData.returnRowClass = function (id, status, allow) {

        if (id == $scope.modalData.currentClickedRow) {


            if (status == 0) {
                return 'alert btn-danger'
            } else if (status == 1) {
                return 'alert btn-info'
            } else if (status == 2) {
                return 'alert btn-warning'
            } else {
                return 'alert btn-error'
            }

        } else {
            if (allow == 1) {
                if (status == 0) {
                    return 'alert alert-danger'
                } else if (status == 1) {
                    return 'alert alert-info'
                } else if (status == 2) {
                    return 'alert alert-warning'
                } else {
                    return 'alert alert-error'
                }
            }
        }
    }
    $scope.modalData.userDailyCertsSumm = {};
    $scope.modalData.userDailyTicketsSumm = {};
    $scope.modalData.UserDayCerts = {};
    $scope.modalData.userDayTickets = {};
    $scope.modalData.getUserDayCerts = function () {
        console.log('Successful called');
        try {
            var url = serverURL + 'getUserDayCerts'
            var data = {};
            data.userId = $cookieStore.get('id');
            $http
                    .post(url, data)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {

                            $scope.modalData.UserDayCerts = data.data;
                        } else {
                            $scope.data.showGritter(2);
                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        //alert(error)
                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            console.log(e)
            //  $scope.modalData.createFailLogs(e);
        }
    }

    $scope.modalData.actionMenu = 1;
    $scope.modalData.exportToExcel = function (filename, id) {
        $scope.modalData.actionMenu = 0;
        var date = new Date();
        $timeout(function () {


            filename += '-' + date;
            $("#" + id).table2excel({
                exclude: ".noExl",
                name: "Excel Document Name",
                filename: filename,
                fileext: ".xls",
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
            $scope.modalData.actionMenu = 1;
        }, 500)

    }


    $scope.modalData.getUserDayTickets = function () {
        console.log('Successful called');
        try {
            var url = serverURL + 'getUserDayTickets'
            var data = {};
            data.userId = $cookieStore.get('id');
            $http
                    .post(url, data)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {

                            $scope.modalData.userDayTickets = data.data;
                        } else {
                            $scope.data.showGritter(2);
                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        //alert(error)
                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            console.log(e)
            //  $scope.modalData.createFailLogs(e);
        }
    }




    $scope.modalData.getUserDailyTickets = function () {
        console.log('Successful called');
        try {
            var url = serverURL + 'getDailyTicket'
            var data = {};
            data.userId = $cookieStore.get('id');
            $http
                    .post(url, data)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {

                            $scope.modalData.userDailyTicketsSumm = data.data;
                        } else {
                            $scope.data.showGritter(2);
                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        //alert(error)
                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            console.log(e)
            //  $scope.modalData.createFailLogs(e);
        }
    }







    $scope.modalData.getUserDailyCerts = function () {
        console.log('Successful called');
        try {
            var url = serverURL + 'getDailyCerts'
            var data = {};
            data.userId = $cookieStore.get('id');
            $http
                    .post(url, data)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {

                            $scope.modalData.userDailyCertsSumm = data.data;
                        } else {
                            $scope.data.showGritter(2);
                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        //alert(error)
                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            console.log(e)
            //  $scope.modalData.createFailLogs(e);
        }
    }





    $scope.modalData.returnRowClasstodo = function (id, status) {

        if (id == $scope.modalData.currentClickedRow) {


            if (status == 0) {
                return 'alert btn-primary'
            } else if (status == 1) {
                return 'alert btn-danger'
            } else if (status == 2) {
                return 'alert btn-warning'
            } else {
                return 'alert btn-error'
            }

        } else {
            if (status == 0) {
                return ''
            } else if (status == 1) {
                return 'alert alert-danger'
            } else if (status == 2) {
                return 'alert alert-warning'
            } else {
                return 'alert alert-error'
            }
        }
    }



    $scope.modalData.returnDoneColor = function (status) {

    }
    $scope.modalData.scroll = function () {

//        $(window).keyup(function (evt) {
//            if (evt.keyCode == 38) {
//               alert('up')
//            } else if (evt.keyCode == 40) {
//               alert('down')
//            }
//        });
    }
    $scope.modalData.currentClickedRow = 0;
    $scope.modalData.makeRowActive = function (id) {


        $scope.modalData.currentClickedRow = id;
        $scope.modalData.selectedTicket(id);
    }
    $scope.modalData.clickedTicket = {}
    $scope.modalData.showExtraTicketInfo = false;
    $scope.modalData.selectedTicket = function (id) {
        $scope.modalData.showExtraTicketInfo = true;
        try {

            if ($scope.modalData.tickets.length > 0) {

                var tempArray = $scope.modalData.tickets;
                for (var i = 0; i < tempArray.length; i++) {
                    if (tempArray[i]['id'] == id) {

                        $scope.modalData.clickedTicketFlag = true;
                        $scope.modalData.clickedTicket = tempArray[i];
                        console.log(tempArray[i]);
                        break;
                    } else {
                        $scope.modalData.clickedTicketFlag = false;
                    }
                }

            }
        } catch (e) {

        }
    }


    $scope.data.checkIfOkay = false;
    $scope.modalData.assignUser = function (id) {
        $scope.data.currentTicketId = id;
    }
    $scope.modalData.getGlobalData = function (tableNm) {
        $scope.modalData.hideTableTillResponse = false;
        var tableName = {};
        tableName.tableName = tableNm;
        if (tableNm == 'TBL_CERTIFICATES') {

        } else {
            $scope.data.showGritter(3);
        }
        try {
            var url = serverURL + 'getFetchData'
            $http
                    .post(url, tableName)
                    .success(function (data) {
                        console.log(data)
                        if (data.status == 1) {
                            if (tableNm == 'TBL_CERTIFICATES') {

                            } else {
                                $scope.data.showGritter(1);
                            }
                            $scope.modalData.fetchCurrentData = data.data;
                        } else {
                            $scope.data.showGritter(2);
                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {
                        //alert(error)
                        $scope.data.showGritter(0);
                    })
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }
    $scope.modalData.insurers = {};
    $scope.modalData.getAllInsurers = function (num) {
        try {

            var tableName = {};
            tableName.tableName = 'TBL_INSURANCES';
            if (dataStorage.insurers.length > 0 && num == 1) {
                $scope.modalData.insurers = dataStorage.insurers;
            } else {
                $scope.data.showGritter(3);
                var url = serverURL + 'getFetchData';
                $http.post(url, tableName)
                        .success(function (data) {

                            $scope.data.showGritter(1);
                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.modalData.insurers = data.data
                                dataStorage.ChangeInsurersData(data.data);
                            } else {
                                $scope.data.showGritter(2);
                                $scope.modalData.insurers = {};
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            console.log(e)
            $scope.data.showGritter(10);
        }


    }
    $scope.modalData.financiers = {};
    $scope.modalData.getAllFinancierNew = function (num) {
        try {

            var tableName = {};
            tableName.tableName = 'TBL_FINANCIER';
            if (dataStorage.financiers.length > 0 && num == 1) {
                $scope.modalData.financiers = dataStorage.financiers;
            } else {
                $scope.data.showGritter(3);
                var url = serverURL + 'getFetchData';
                $http.post(url, tableName)
                        .success(function (data) {

                            $scope.data.showGritter(1);
                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.modalData.financiers = data.data
                                dataStorage.ChangeFinanciersData(data.data);
                            } else {
                                $scope.data.showGritter(2);
                                $scope.modalData.insurers = {};
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            console.log(e)
            $scope.data.showGritter(10);
        }


    }







    $scope.modalData.returnMachineStatus = function (status) {
        if (status == 1) {
            return 'Allowed';
        } else {
            return 'Blocked';
        }
    }
    $scope.modalData.machineIps = {};
    $scope.modalData.getAllAccounts = function () {
        try {
            $scope.data.showGritter(3);
            var url = serverURL + '/getFetchData';
            var tableName = {};
            tableName.tableName = 'TBL_ALLOWED_MACHINES';
            $http
                    .post(url, tableName)
                    .success(function (data) {
                        if (data.status == 1) {
                            $scope.data.showGritter(1);
                            $scope.modalData.machineIps = data.data;
                        } else {
                            $scope.data.showGritter(2);
                            scope.modalData.machineIps = {};
                        }

                    })
                    .error(function (e) {

                    })

        } catch (e) {
            $scope.data.createFailLogs(e)
        }

    }
    $scope.modalData.getAllMachineIps = function () {
        try {
            var url = serverURL + '/getAllPortfolio';
            $http.
                    get(url)
                    .success(function (data) {
                        if (data.status == 1) {
                            $scope.modalData.allPortfolioData = data.data;
                            console.log($scope.modalData.allPortfolioData)
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

    $scope.modalData.paymentAmount = {};
    $scope.modalData.paymentAmount.minAmount = 0;
    $scope.modalData.getPaymentAmounts = function (id) {
        console.log(id);
        var tempData = $scope.modalData.fetchCurrentData;
        try {

            for (var i = 0; i < tempData.length; i++) {
                if (tempData[i]['id'] == id) {
                    $scope.modalData.paymentAmount = tempData[i];
                    break;
                }
            }

            console.log($scope.modalData.paymentAmount);
        } catch (e) {
            console.log(e);
        }

    }





    $scope.data.getAllVehiclesJoinCustomer = function (num) {
        try {

            var tableName = {};
            if (dataStorage.allAppData.length > 0 && num == 1) {
                $scope.modalData.vehicleJoinCustomers = dataStorage.customersjoinVehicles;
            } else {
                $scope.data.showGritter(3);
                var url = serverURL + 'getVehiclesJoinCustomers';
                $http.post(url, '')
                        .success(function (data) {

                            $scope.data.showGritter(1);
                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.modalData.vehicleJoinCustomers = data.data
                                dataStorage.ChangeCustomersjoinVehiclesData(data.data);
                            } else {
                                $scope.data.showGritter(2);
                                $scope.modalData.vehicleJoinCustomers = '';
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            $scope.data.showGritter(10);
        }


    }


    $scope.modalData.getAllVehiclesJoinCustomer = function (num) {
        try {
            var tableName = {};
            if (dataStorage.customersjoinVehicles.length > 0 && num == 1) {
                $scope.modalData.vehicleJoinCustomers = dataStorage.customersjoinVehicles;
            } else {
                var tableName = {};
                $scope.data.showGritter(3);
                var url = serverURL + 'getVehiclesJoinCustomers';
                $http.post(url, '')
                        .success(function (data) {

                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.modalData.vehicleJoinCustomers = data.data
                                dataStorage.ChangeCustomersjoinVehiclesData(data.data);
                            } else {
                                $scope.data.showGritter(2);
                                $scope.modalData.vehicleJoinCustomers = '';
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(0);
                        })
            }
        } catch (e) {
            $scope.data.showGritter(10);
        }


    }




    $scope.data.saveTickets = {};
    $scope.modalData.customerDetails = {};
    $scope.modalData.feedBack = {};
    $scope.modalData.feedBacks = {};
    $scope.modalData.feedBacks = {};
    $scope.modalData.showPopFeedBack = function (data, id, dateDue) {
        $scope.modalData.feedBack.data = data;
        $scope.modalData.feedBack.id = id;
        if (data == 1) {
            $scope.modalData.feedBacks.dataLineId = $scope.modalData.clickedTicket.dataLineId;
            $scope.modalData.feedBacks.deviceId = $scope.modalData.clickedTicket.deviceId;
        }
    }
    $scope.modalData.saveUserFeedBack = function (feedBack) {

        var finalData = {};
        finalData = feedBack;
        finalData.closedFlag = $scope.modalData.feedBack.data;
        $scope.modalData.updateTicket(finalData, finalData.closedFlag, $scope.modalData.feedBack.id, 'TBL_SIMPLE_TICKETS')
    }

    $scope.modalData.updateTicket = function (data, status, id, tableName, dateDue) {

        var dTwo = {};
        var removed = false;
        dTwo.closedFlag = status;
//        if (dTwo.closedFlag == 1 && returnStringDate(new Date()) < dateDue) {
//            $scope.data.showGritter(30);
//        } else {
//alert(data)
        if ($scope.modalData.tickets.length > 0) {
            var users = $scope.modalData.tickets;
            for (var i = 0; i < users.length; i++) {

                if (users [i]['id'] == id) {
                    if (status == 0) {
                        users [i]['closedFlag'] = 0;
                        data['ticketUsed'] = 0;
                    } else if (status == 1) {
                        users [i]['closedFlag'] = 1;
                    } else if (status == 2) {
                        users [i]['closedFlag'] = 2;
                    } else if (status == 3) {
                        users [i]['closedFlag'] = 3;
                    } else {
                        users.splice(i, 1);
                    }
                    removed = true;
                    break;
                }


            }
            $scope.modalData.tickets = users;
            if (removed) {

                $scope.modalData.clickedTicket = users [i];
                $scope.data.saveTicketUpdate(data, id, tableName, dateDue);
            }


        }

        // }
    }
    $scope.data.company = {};
    $scope.modalData.generateGroupCode = function () {
        $scope.data.company.code = $scope.data.getRandomCode();
    }

    $scope.modalData.saveAssignedMenus = function (groupId) {
        try {
            if ($scope.modalData.selectedMenus.length > 0 && Number(groupId) > 0) {

                var arrayData = {};
                var url = serverURL + 'saveMenus'
                arrayData.groupId = groupId;
                arrayData.createdBy = $cookieStore.get('id');
                $scope.data.showGritter(3)
                arrayData.menus = $scope.modalData.selectedMenus;
                console.log(arrayData.menus)
                $http.
                        post(url, arrayData)
                        .success(function (data) {
                            if (data.status == 1) {
                                $scope.data.showGritter(6)
                            } else {
                                $scope.data.showGritter(0)
                            }
                        })
                        .error(function (error) {

                        })
            } else {

            }

        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }
    $(document).ready(function () {
        if (window.location.href.indexOf("Menus") > -1) {
            $scope.modalData.getGlobalData('TBL_USER_GROUPS');
            $scope.data.getAllMenus();
            //    $scope.data.getUserMenus();

        }
        if (window.location.href.indexOf("globalSettings") > -1) {
            $scope.data.getUserMenus();
        } else {
            $scope.data.getUserMenus();
        }

    });
    $scope.modalData.menus = {}
    $scope.$on('menusEvent', function (event, args) {

        $scope.modalData.menus = args.data;
    });
    $scope.modalData.returnMenuFlag = function (id) {

        try {

            var existing = false;
            if (angular.isDefined(id)) {

                for (var i = 0; i < $scope.modalData.menus.length; i++) {


                    if ($scope.modalData.menus[i]['id'] == id) {

                        existing = true;
                        break;
                    }

                }
            }
            // console.log(id+' '+existing);
            return existing;
        } catch (e) {
            console.log(e)
        }
    }
    $scope.modalData.saveUserShifts = function (shiftId, days) {
        try {
            if ($scope.modalData.selectedShift.length > 0 && Number(shiftId) > 0) {
                $scope.data.showGritter(3)
                var arrayData = {};
                var url = serverURL + 'saveShifts'
                arrayData.shiftId = shiftId;
                arrayData.days = days;
                arrayData.createdBy = $cookieStore.get('id');
                arrayData.users = $scope.modalData.selectedShift;
                $http.
                        post(url, arrayData)
                        .success(function (data) {

                            if (data.status == 1) {
                                $scope.data.showGritter(6)
                            } else {
                                $scope.data.showGritter(2)
                            }
                        })
                        .error(function (error) {
                            $scope.data.showGritter(8)
                        })
            } else {
                $scope.data.showGritter(99, 'Please select atleast one person')
            }

        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }

    $scope.modalData.getMenusPerGroup = function (id) {

        try {

            var groupId = {};
            groupId.groupId = id;
            var url = serverURL + 'fetchMenus';
            $http.
                    post(url, groupId)
                    .success(function (data) {
                        $scope.modalData.selectedMenus = [];
                        if (data.status == 1) {

                            $scope.modalData.currentSelectedGroup = data.data;
                            $scope.modalData.selectedMenus = $scope.modalData.loopObjectReturnArray(data.data);
                        } else {

                        }

                    })
                    .error(function (data) {

                    })
        } catch (e) {

        }

    }
    $scope.modalData.assignedDevices = {};
    $scope.modalData.getAllAssignedDevices = function (id) {

        try {
            var groupId = {};
            groupId.groupId = id;
            var url = serverURL + 'getAllAssignedDevices';
            $http.
                    get(url)
                    .success(function (data) {
                        $scope.modalData.selectedMenus = [];
                        if (data.status == 1) {

                            $scope.modalData.assignedDevices = data.data;
                        } else {
                            $scope.modalData.assignedDevices = {};
                        }

                    })
                    .error(function (data) {

                    })
        } catch (e) {

        }

    }

    $scope.modalData.selectedShift = [];
    $scope.modalData.addToSelectedShift = function (item) {
        try {
            if (angular.isDefined(item)) {
                for (var x = 0; x < $scope.modalData.selectedShift.length; x++) {
                    if ($scope.modalData.selectedShift[x] == item) {
                        $scope.modalData.selectedShift.splice(x, 1);
                        var existing = true;
                        break
                    }
                }
                if (!existing) {
                    $scope.modalData.selectedShift.push(item);
                }


            }
            console.log($scope.modalData.selectedShift.length);
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }




    $scope.modalData.selectedMenus = {};
    $scope.modalData.returnAssignedStatus = function (id) {
        try {
            var status = false;
            if (angular.isDefined(Number(id)) > 0) {
                if ($scope.modalData.selectedMenus.length > 0) {
                    for (var i = 0; i < $scope.modalData.selectedMenus.length; i++) {
                        if ($scope.modalData.selectedMenus[i] == id) {

                            status = true
                            break;
                        } else {
                            // console.log('should return false' +i);
                            status = false;
                        }

                    }

                } else {
                    // console.log('nothing selected')
                    //  status=false;
                }

            } else {
                // console.log('sid undefined')
                //status= false;
            }
            return status;
        } catch (e) {

            console.log(e)
        }
    }

    $scope.modalData.addToSelectedMenus = function (item) {
        try {
            if (angular.isDefined(item)) {
                for (var x = 0; x < $scope.modalData.selectedMenus.length; x++) {
                    if ($scope.modalData.selectedMenus[x] == item) {
                        $scope.modalData.selectedMenus.splice(x, 1);
                        var existing = true;
                        break
                    }
                }
                if (!existing) {
                    $scope.modalData.selectedMenus.push(item);
                }


            }
            console.log($scope.modalData.selectedMenus.length);
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }

    }

    $scope.modalData.editTicket = function (id) {
        $scope.modalData.noData = true;
        if ($scope.modalData.tickets.length > 0) {
            var arrayTemp = $scope.modalData.tickets;
            for (var i = 0; i < arrayTemp.length; i++) {

                if (arrayTemp[i]['id'] == id) {
                    $scope.data.globalSettings.customerSearch = arrayTemp[i]['idNo'];
                    $scope.modalData.searchCustomer(arrayTemp[i]['idNo']);
                    $scope.data.saveTickets.issue = arrayTemp[i]['issue'];
                    $scope.data.saveTickets.desc = arrayTemp[i]['desc'];
                    $scope.data.saveTickets.id = arrayTemp[i]['id'];
                    $scope.data.saveTickets.type = arrayTemp[i]['type'];
                    $scope.data.saveTickets.vehicleId = arrayTemp[i]['vehicleId'];
                    $scope.data.saveTickets.regNo = arrayTemp[i]['regNo'];
                    $scope.modalData.customerDetails.id = arrayTemp[i]['custId'];
                    $scope.modalData.customerDetails.name = arrayTemp[i]['name'];
                    console.log($scope.data.saveTickets)
                }
            }
        } else {
            console.log('array does not have data');
        }
    }

    $scope.data.genPaymentCode = function () {

        $scope.data.payments.code = $scope.modalData.getRandomCode();
    }

    $scope.modalData.returnStatus = function (status) {

        if (status == 1) {
            return 'Valid';
        } else if (status == 0) {
            return 'Cancelled'
        }
    }
    $scope.modalData.showTicketCreation = false;
    $scope.data.saveNewClientTickets = {};
    $scope.data.saveNewClientTickets.name = 'New Customer Name';
    $scope.data.saveNewClientTickets.vehicleId = '';
    $scope.data.saveNewClientTickets.mobile_1 = '07XXXXXXXX';
    $scope.data.saveNewClientTickets.lon = '36.79857029999994';
    $scope.data.saveNewClientTickets.lat = '-1.2644446';
    $scope.modalData.saveTicket = function (dataTicket) {

        try {
            var tableName = {};
            $scope.data.showGritter(3);
            var searchData = {};
            dataTicket.custId = $scope.modalData.customerDetails.id;
            dataTicket.createdBy = $cookieStore.get('id');
            searchData = dataTicket;
            if (angular.isUndefined(dataTicket.custId)) {
                dataTicket.custId = '';
            }
            searchData.dateDue = $('#date').val();
            if (dataTicket.issue == 'GENERAL INQUIRY') {
                dataTicket.vehicleId = '';
            }
            var url = 'saveTicket';
            console.log((searchData))
            if (angular.isUndefined(dataTicket.id)) {
                if (angular.isDefined(searchData.issue)) {
                    var url = serverURL + url;
                    try {
                        $http.post(url, searchData)

                                .success(function (data) {
                                    //  alert(data)
                                    if (data.status == 1) {

                                        $scope.modalData.newInstallationTrue = '';
                                        $scope.data.showGritter(6);
                                        $scope.data.saveTickets = {};
                                        $scope.data.saveNewClientTickets = {};
                                        $scope.data.saveTickets.lon = '36.79857029999994'
                                        $scope.data.saveTickets.lat = '-1.2644446';
                                    } else {

                                        $scope.data.showGritter(2);
                                    }
                                })
                                .error(function (error) {

                                    $scope.data.showGritter(8);
                                })
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    $scope.data.showGritter(12);
                }
            } else {
                var updatedata = {};
                updatedata.issue = dataTicket.issue;
                updatedata.type = dataTicket.type;
                updatedata.desc = dataTicket.desc;
                updatedata.dateDue = fetchAPIDataService.returnStringDate($('#date').val());
                updatedata.closedFlag = 0;
                $scope.data.saveUpdate(updatedata, dataTicket.id, 'TBL_SIMPLE_TICKETS');
                $scope.modalData.getTickets()
            }
        } catch (e) {

        }


    }
    $scope.modalData.returnUsed = function (status) {

        if (status == 1) {
            return 'Used';
        } else {
            return 'Unused';
        }
    }

    ///**********************************////
    $scope.modalData.keyIput = "/^[a-zA-Z0-9 ]*$/";
    $('[data-toggle=popover]').popover({
        content: $('#myPopoverContent').html(),
        html: true

    }).click(function () {
        $(this).popover('show');
    });
    $scope.data.saveTickets.lon = '36.79857029999994'
    $scope.data.saveTickets.lat = '-1.2644446';
    $scope.data.saveTickets.location = 'In-House';
    $scope.modalData.assignClickedLocation = function (location) {
        var Location = $('#us3-address').val();
        var lon = $('#us3-lon').val();
        var lat = $('#us3-lat').val();
        $scope.data.saveTickets.location = Location;
        $scope.data.saveTickets.lon = lon;
        $scope.data.saveTickets.lat = lat;
        console.log($scope.data.saveTickets)

    }

    //////////////////*************************////
    $scope.modalData.returnAssigned = function (status) {

        if (status == 1) {
            return 'Assigned';
        } else {
            return 'Unassigned';
        }
    }
    $scope.modalData.globalSettingsSave = function (globalData, tableName) {


        //var whereColumn='osoro';
        console.log(globalData)
        if (tableName == 'TBL_PAYMENTS') {
            globalData.date = $('#date').val()
            globalData.custId = $scope.modalData.customerDetails.id;
        }
        if (tableName == 'TBL_INVOICES') {
            globalData.dateIssued = $('#date').val();
        }
        if (tableName == 'TBL_ASSIGNED_DEVICES') {
            $scope.data.assignUserResources.code = $scope.data.getRandomCode();
        }
        if (tableName == 'TBL_CRM_MESSAGES') {
            $scope.modalData.showSending = true;
        }
        $scope.modalData.st = false;
        var st = false;
        var arrayData = {}
        $scope.data.showGritter(5);
        globalData.createdBy = $cookieStore.get('id');
        arrayData.data = globalData;
        arrayData.tableName = tableName;
        //arrayData.whereColumn = whereColumn;

        console.log(arrayData)
        try {
            var url = serverURL + 'saveGlobalData'
            $http.
                    post(url, arrayData)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.modalData.st = true;
                            $scope.data.showGritter(6);
                            if (tableName != 'TBL_CUSTOMERS') {
                                $scope.modalData.getRandomCode();
                            }
                            if (tableName == 'TBL_PAYMENTS') {

                                $scope.data.payments = {};
                                $scope.modalData.getRandomCode();
                            }
                            if (tableName == 'TBL_ASSIGNED_DEVICES') {
                                $scope.data.assignUserResources = {};
                                $scope.data.assignUserResources.code = $scope.data.getRandomCode();
                            }
                            if (tableName == 'TBL_CRM_MESSAGES') {

                                $scope.modalData.getCrmMessages();
                            }
                            if (tableName == 'TBL_INVOICES') {
                                $scope.data.invoice = {};
                            }
                            if (tableName == 'TBL_USERS') {
                                $scope.data.userSettings = {};
                                $scope.data.userSettings.code = $scope.data.getRandomCode();
                            }
                            if (tableName == 'TBL_USER_GROUPS') {
                                $scope.data.company = {};
                                $scope.data.company.code = $scope.data.getRandomCode();
                            }
                            if (tableName == 'TBL_DATALINES') {
                                $scope.data.dataline = {};
                                $scope.data.dataline.code = $scope.data.getRandomCode();
                            }
                            if (tableName == 'TBL_VEHICLES') {
                                $scope.data.saveTickets.vehicleId = $scope.data.vehicleSettings.regNo;
                                $scope.data.vehicleSettings = {};
                                $scope.data.vehicleSettings.code = $scope.data.getRandomCode();
                                $scope.modalData.showTicketCreation = true;
                            }
                            $scope.data.globalSettings = {};
                        } else {
                            $scope.modalData.st = false;
                            $scope.data.showGritter(7, data.message);
                        }

                    })
                    .error(function (error) {
                      
                        $scope.data.showGritter(0);
                    })

        } catch (e) {
            $scope.modalData.st = false;
            $scope.data.showGritter(0);
        }
        return true;
    }
    $scope.data.vehicleSettings.insurorId = 0;
    $scope.modalData.getCustomersWhereAccountId = function (tableNm, accountId) {
        $scope.modalData.hideTableTillResponse = false;
        var tableName = {};
        tableName.tableName = tableNm;
        tableName.accountId = accountId;
        try {
            var url = serverURL + 'fetchCustomersWhere'
            if (tableName.accountId != '') {
                $http
                        .post(url, tableName)
                        .success(function (data) {

                            if (data.status == 1) {

                                $scope.modalData.customersData = data.data;
                            } else {
                                $scope.modalData.customersData = '';
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
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }
    $scope.data.limit = 12;
    $scope.data.byRange = function (fieldName, minValue, maxValue) {
        if (minValue === undefined)
            minValue = Number.MIN_VALUE;
        if (maxValue === undefined)
            maxValue = Number.MAX_VALUE;
        return function predicateFunc(item) {
            return minValue <= item[fieldName] && item[fieldName] <= maxValue;
        }
    };
    $scope.modalData.getAllFinanciers = function () {
        try {
            var tableName = {};
            tableName.tableName = 'TBL_FINANCIER';
            var url = serverURL + 'getFetchData';
            $http.post(url, tableName)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.modalData.financiers = data.data
                        } else {
                            $scope.modalData.financiers = '';
                        }
                    })
                    .error(function (error) {

                    })
        } catch (e) {

        }
    }
    $scope.modalData.getAllInsurors = function () {
        try {
            var tableName = {};
            tableName.tableName = 'TBL_INSURANCES';
            var url = serverURL + 'getFetchData';
            $http.post(url, tableName)
                    .success(function (data) {
                        console.log(data.data)
                        if (data.status == 1) {
                            $scope.modalData.insurors = data.data
                        } else {
                            $scope.modalData.insurors = '';
                        }
                    })
                    .error(function (error) {

                    })
        } catch (e) {

        }
    }
    $scope.modalData.vehicleDetailsWhere = {}
    $scope.modalData.vehicleId = '';
    $scope.$watch('modalData.vehicleId', function (newValue, oldValue) {

        $scope.modalData.getvehicleInfo(newValue);
    }, true)
    $scope.data.vehicleDetailsWherePanel = 'panel-green';
    $scope.modalData.changePanelColor = function (todayDay, validEndOnTimeStamp) {
        // alert(todayDay + '==' + validEndOnTimeStamp)
        if (todayDay < validEndOnTimeStamp) {
            $scope.data.vehicleDetailsWherePanel = 'panel-green';
        } else {
            $scope.data.vehicleDetailsWherePanel = 'panel-red';
        }
        // alert($scope.data.vehicleDetailsWherePanel)
    }
    $scope.modalData.getVehicleDetails = function (id) {
        $scope.modalData.vehicleId = id;
        $cookieStore.put('vehicleId', id);
    }
    $scope.modalData.specificCustomerDetails = {};
    $scope.modalData.getCustomerDetails = function (id) {
        $scope.modalData.customerId = id;
        $timeout(function () {
            $scope.modalData.specificCustomerDetails = dataStorage.customersDetails;
        }, 100);
        $cookieStore.put('customerId', id);
    }



    $scope.modalData.getNextVehicleDetails = function (step) {
        var id = $cookieStore.get('vehicleId');
        if (angular.isDefined(id) && id > 0) {

            if ($scope.data.accountVehicles.length > 0) {
                $scope.data.accountVehicles = dataStorage.allAppData;
                for (var i = 0; i < $scope.data.accountVehicles.length; i++) {
                    if ($scope.data.accountVehicles[i]['id'] == id) {
                        if (step == '0') {
                            var next = i - 1;
                        } else {
                            var next = i + 1;
                        }

                        $scope.modalData.getVehicleDetails($scope.data.accountVehicles[next]['id'])


                    }
                }
            }
        } else {
            $scope.data.showGritter(2);
        }


    }
    $scope.data.currentLon = 0;
    $scope.data.currentLat = 0;
    function displayPoints() {
        $('#us3-lat').val($scope.data.currentLat);
        $('#us3-lon').val($scope.data.currentLon);
        // 
        $('#us3').locationpicker({
            location: {
                latitude: $scope.data.currentLat,
                longitude: $scope.data.currentLon
            },
            radius: 0,
            locationName: $scope.modalData.vehicleLocation,
            inputBinding: {
                latitudeInput: $('#us3-lat'),
                longitudeInput: $('#us3-lon'),
                locationNameInput: $('#us3-address')
            },
            enableReverseGeocode: true,
            enableAutocomplete: true,
            onchanged: function (currentLocation, radius, isMarkerDropped) {

                var addressComponents = $(this).locationpicker('map').location.addressComponents;
                updateControls(addressComponents);
            }
        });
        $('#us6-dialog').on('shown.bs.modal', function () {
            $('#us3').locationpicker('autosize');
        });
    }
    $scope.modalData.vehicleLocation = '';
    $scope.modalData.disablelocation = false;
    $scope.modalData.showMapWithLocations = function (type, id) {

        $('#us3-address').hide();
        $('#pickLocation').hide();
        if (type == 1) {
            $('#us3-address').show();
            $('#pickLocation').show();
            $('#us3-written').hide();
            $('#loader').hide();
            $scope.modalData.disablelocation = false;
            $scope.data.currentLon = 36.7985703;
            $scope.data.currentLat = -1.2644446;
            displayPoints()
        } else {
            $('#us3-address').hide();
            $('#pickLocation').hide();
            $('#us3-written').show();
            $scope.modalData.getLocationWithLocationName(id);
        }

    }
    $scope.modalData.getLocationWithLocationName = function (id) {
        try {
            $('#loader').html('Reasolving Location...');
            if (angular.isDefined(id)) {
                $scope.data.currentLat = 0;
                $scope.data.currentLon = 0;
                displayPoints();
                var data = {};
                data.id = id;
                try {
                    var url = serverURL + 'getLastLocation';
                    $http.post(url, data)
                            .success(function (data) {

                                if (data.status == 1) {
                                    $('#loader').html('<b>' + data.data.regNo + ' | </b>Last Time Online : ' + data.data._l_datetime + ' Location : ' + data.data.location);
                                    $scope.data.currentLat = data.data._latitude;
                                    $scope.data.currentLon = data.data._longitude;
                                    $scope.modalData.vehicleLocation = data.data.location;
                                    $('#us3-address').hide();
                                    $('#us3-written').html($scope.modalData.vehicleLocation);
                                    $scope.modalData.disablelocation = true;
                                    displayPoints();
                                } else {
                                    $('#loader').show()
                                    $('#loader').html('No Location Found,please try again later');
                                    $('#us3-written').html(data.message);
                                    console.log(data);
                                    $scope.data.currentLat = 0;
                                    $scope.data.currentLon = 0;
                                    displayPoints();
                                }
                            })
                            .error(function (error) {

                            })
                } catch (e) {

                }


            }
        } catch (e) {

        }
    }

    $scope.modalData.customerDetailsId = {};
    $scope.modalData.getCustomerInfo = function (id) {
        try {

            if (angular.isDefined(id)) {

                var data = {};
                data.id = id;
                $scope.data.showGritter(3)

                try {

                    data.tableName = 'TBL_CUSTOMERS';
                    var url = serverURL + 'getCustomer';
                    $http.post(url, data)
                            .success(function (data) {

                                if (data.status == 1) {
                                    $scope.modalData.customerDetailsId = data.data
                                    dataStorage.ChangeCustomerDetails(data.data);
                                    console.log($scope.modalData.customerDetailsId)
                                    $location.path("/viewCustomerDetails");
                                } else {
                                    $scope.modalData.customerDetailsId = {};
                                }
                            })
                            .error(function (error) {

                            })
                } catch (e) {

                }


            }
        } catch (e) {

        }
    }
    urlChecker = 0;
    $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
        if (urlChecker < 3) {

            $scope.modalData.crmMssagesBackUp = dataStorage.chatMessages;
            console.log($scope.modalData.crmMssagesBackUp);
            returnTotalUnread();
            $scope.modalData.messageCounter = $cookieStore.get('messagesCounter');
            console.log($rootScope.messageCounter);
        }
    });
    $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
        if ($cookieStore.get('vehicleId') > 0) {
            $scope.modalData.getvehicleInfo()
        }
    });
    $rootScope.loadVehicle = false;
    $scope.modalData.callVI = function () {

        //$timeout(function () {
        $scope.modalData.vehicleDetailsWhere = dataStorage.vehicleDetails;
        // }, 2000);


    }
    $scope.modalData.getvehicleInfo = function (inPut) {
        try {
            var id = $cookieStore.get('vehicleId');
            if (angular.isDefined(id)) {

                var data = {};
                data.id = id;
                try {
                    if (inPut == id) {

                        $scope.data.showGritter(3)
                        data.tableName = 'TBL_VEHICLES';
                        var url = serverURL + 'fetchDataWhereVehicleId';
                        $http.post(url, data)
                                .success(function (data) {
                                    console.log(data)
                                    $scope.data.showGritter(1)
                                    if (data.status == 1) {
                                        $rootScope.loadVehicle = true;
                                        $scope.modalData.vehicleDetailsWhere = data.data
                                        $scope.modalData.changePanelColor(data.data.timeToday, data.data.validEndOnTimeStamp);
                                        console.log($scope.modalData.vehicleDetailsWhere)
                                        dataStorage.ChangeVehicleDetails(data.data)
                                    } else {
                                        alert()
                                        $scope.data.showGritter(0)
                                        $scope.modalData.vehicleDetailsWhere = '';
                                    }
                                })
                                .error(function (error) {
                                   console.log(error);
                                    $scope.data.showGritter(2)
                                })
                    }
                } catch (e) {

                }


            }
        } catch (e) {

        }
    }








    $scope.modalData.calculations = {};
    $scope.modalData.calculateBalance = function (id) {

        try {
            if (Number(id) > 0) {
                console.log(id)
                for (var i = 0; i < $scope.modalData.separateData.length; i++) {
                    console.log($scope.modalData.separateData[i]);
                    if ($scope.modalData.separateData[i]['id'] == id) {
                        $scope.modalData.calculations.amountMin = $scope.modalData.separateData[i]['minAmount'];
                        $scope.modalData.calculations.price = $scope.modalData.separateData[i]['price'];
                        $scope.data.payments.balance = $scope.modalData.calculations.price - $scope.data.payments.amountPaid;
                        $scope.data.payments.period = $scope.data.cutNumber((($scope.data.payments.amountPaid / $scope.modalData.separateData[i]['minAmount'])
                                * $scope.modalData.separateData[i]['period']) * 365.5, 2);
                        break;
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }


    }
    $scope.modalData.calculateActualServiceAmount = function (id, pieces) {

        try {
            if (Number(id) > 0) {

                for (var i = 0; i < $scope.modalData.separateData.length; i++) {
                    console.log($scope.modalData.separateData[i]);
                    if ($scope.modalData.separateData[i]['id'] == id) {
                        $scope.data.invoice.actualServiceAmount = $scope.modalData.separateData[i]['minAmount'] * pieces;
                        console.log($scope.data.invoice.actualServiceAmount);
                        break;
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }


    }
    $scope.data.vehicleExists = true;
    $scope.data.currentVehicle = '';
    $scope.modalData.showSearchVehicles = function (div, searchString) {
        $scope.data.vehicleExists = true;
        $scope.modalData.showDivSearch = div;
        var searchData = {};
        searchData.regNo = searchString;
        searchData.tableName = 'TBL_VEHICLES';
        $scope.modalData.currentVehicle = searchString;
        $scope.data.ticketSettings.vehicleId = searchString;
        if (searchString.length != '') {
            var url = serverURL + 'getAllVehicles';
            try {
                $http.post(url, searchData)
                        .success(function (data) {
                            console.log(data);
                            if (data.status == 1) {
                                $scope.data.vehicleExists = false;
                                $scope.data.searchedVehicles = data.data;
                                $rootScope.globalVariable = {
                                    responseStyle: SERVER_CONSTANTS.STATUS_ERROR_CODE_0_THEME,
                                    responseStatus: false,
                                    responseMessage: data.message
                                }
                                $scope.data.getTicketsPerVehicle(searchString);
                            } else {
                                $rootScope.globalVariable = {
                                    responseStyle: SERVER_CONSTANTS.STATUS_ERROR_CODE_0_THEME,
                                    responseStatus: true,
                                    responseMessage: data.message
                                }
                            }
                        })
                        .error(function (data) {

                        })

            } catch (e) {

            }

        } else {
             $scope.data.showGritter(2,'Please enter a search value');
        }
    }



    $scope.modalData.currentSelectedGroup = {};
    $scope.modalData.loopObjectReturnArray = function (obj) {
        var newArray = [];
        if (obj.length > 0) {
            for (var i = 0; i < obj.length; i++) {
                newArray.push(obj[i]['id']);
            }
            return newArray;
        } else {
            return obj;
        }
    }





    $scope.modalData.customerFilteredData = {};
    $scope.modalData.getDataWhereId = function (id, tableNm) {
        $scope.modalData.hideTableTillResponse = false;
        var tableName = {};
        tableName.tableName = tableNm;
        tableName.id = id;
        try {
            var url = serverURL + 'fetchDataWhereId'
            $http
                    .post(url, tableName)
                    .success(function (data) {

                        if (data.status == 1) {

                            $scope.modalData.customerFilteredData = data.data;
                        } else {

                        }
                        $scope.modalData.hideTableTillResponse = true;
                    })
                    .error(function (error) {

                    })
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }
    $scope.modalData.allCustomers = {};
    $scope.data.checkProgress = 0;
    $scope.modalData.getAllCustomers = function (num) {

        try {

            if (dataStorage.allCustomers.length > 0 && num == 1) {
                $scope.modalData.allCustomers = dataStorage.allCustomers;
                $scope.modalData.allCustomers = dataStorage.allCustomers;
            } else {

                if ($scope.data.checkProgress == 0) {
                    $scope.data.checkProgress = 1;
                    $scope.data.showGritter(3)
                    var url = serverURL + 'fetchAllCustomers'
                    $http.post(url, '')
                            .success(function (data) {

                                if (data.status == 1) {

                                    $scope.data.showGritter(1)
                                    $scope.data.allCustomers = data.data;
                                    $scope.modalData.allCustomers = data.data;
                                    dataStorage.ChangeCustomerData($scope.modalData.allCustomers);
                                } else {
                                    $scope.data.showGritter(2)
                                    $scope.modalData.allCustomers = '';
                                }
                                $scope.data.checkProgress = 0;
                            })
                            .error(function () {
                                $scope.data.checkProgress = 0;
                                $scope.data.showGritter('Failure', 'Server Error')
                            })
                } else {
                    $scope.data.showGritter(4)
                }
            }
        } catch (e) {
            $scope.data.checkProgress = 0;
            $scope.data.showGritter(0)

        }
    }

//    $scope.modalData.unlinkCustomerVehicle = function (id) {
//        var tempData = $scope.modalData.vehicleJoinCustomers;
//
//        try {
//            console.log($scope.modalData.vehicleJoinCustomers)
//            for (var i = 0; i < tempData.length; i++) {
//                if (tempData[i]['id'] == id) {
//
//                    tempData.splice(i, 1);
//                    break;
//                }
//            }
//            $scope.modalData.vehicleJoinCustomers = tempData;
//        } catch (e) {
//
//        }
//    }
    $scope.data.vehicleSettings.code = $scope.data.getRandomCode();
    $scope.modalData.getVehiclesWhere = function (id, tableNm) {
        $scope.modalData.hideTableTillResponse = false;
        var tableName = {};
        tableName.tableName = tableNm;
        tableName.id = id;
        try {
            if (angular.isDefined(id)) {
                var url = serverURL + 'fetchVehiclesWhereId'
                $http
                        .post(url, tableName)
                        .success(function (data) {

                            if (data.status == 1) {

                                $scope.modalData.customerVehicles = data.data;
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
            }
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }
    }

    $scope.modalData.allSystemUsers = {};
    $scope.modalData.allSystemUsersResponse = false;
    $scope.modalData.getAllUsers = function (tblUsers) {
        var tableName = {};
        tableName.tableName = tblUsers;
        try {
            var url = serverURL + 'getFetchData'
            $http
                    .post(url, tableName)
                    .success(function (data) {

                        if (data.status == 1) {
                            $scope.modalData.allSystemUsersResponse = true;
                            $scope.modalData.allSystemUsers = data.data;
                        } else {


                        }

                    })
                    .error(function (error) {

                    })
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }


    }




    $scope.modalData.endDayOperation = function () {
        var userId = {};
        userId.userId = $cookieStore.get('id');
        userId.timeLoggedIn = $cookieStore.get('timeLoggedIn');
        $scope.data.showGritter(3);
        try {

            if (userId.userId > 0) {

                var url = serverURL + 'saveEndOfDay';
                $http
                        .post(url, userId)
                        .success(function (data) {

                            if (data.status == 1) {
                                $scope.data.showGritter(1);
                                $scope.data.logout();
                                $scope.modalData.allSystemUsersResponse = true;
                                $scope.modalData.allSystemUsers = data.data;
                            } else {
                                $scope.data.showGritter(99, 'Error Logging Out');
                                $rootScope.globalVariable = {
                                    responseStyle: SERVER_CONSTANTS.STATUS_ERROR_CODE_0_THEME,
                                    responseStatus: true,
                                    responseMessage: data.message
                                }
                            }
                        })
                        .error(function (error) {
                            $rootScope.globalVariable = {
                                responseStyle: SERVER_CONSTANTS.STATUS_ERROR_CODE_0_THEME,
                                responseStatus: true,
                                responseMessage: SERVER_CONSTANTS.STATUS_ERROR_CODE_4
                            }
                        })
            }
        } catch (e) {
            $scope.data.showGritter(0);
        }


    }


    $scope.modalData.getRandomCode = function () {
        var text = "";
        var possible = "0123456789";
        for (var i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        $scope.data.globalSettings.code = text;
        return text;
    }

    $scope.data.payments = {};
    $scope.data.payments.code = $scope.data.globalSettings.code;
    $scope.modalData.phoneNumberPattern = (function () {
        var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
        return {
            test: function (value) {
                if ($scope.requireTel === false) {
                    return true;
                }
                return regexp.test(value);
            }
        };
    })();
    $scope.data.vehicleSettings.code = $scope.data.globalSettings.code;
}
).controller('datePicker', function ($scope) {


    function returnDateToday() {

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
        return today;
    }
    $(function () {

        $('input[name="date"]').daterangepicker({
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            },
            singleDatePicker: true,
            timePicker: true,
            timePickerIncrement: 1,
            minDate: returnDateToday(),
            showDropdowns: true
        },
                function (start, end, label) {

                    var years = moment().diff(start, 'years');
                    dater(start);
                });
        function dater(start) {
            $scope.data.date = start;
            $scope.$emit('selectedDate', {data: $scope.data.date});
        }
    });
}
).controller('datePickerMax', function ($scope, $rootScope) {


    function returnDateToday() {

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
        return today;
    }
    $(function () {
        $('input[name="daterange"]').daterangepicker({
            timePicker: false,
            locale: {
                format: 'MM/DD/YYYY'
            }
        });
    });
    $(function () {

        $('input[name="date"]').daterangepicker({
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            },
            singleDatePicker: true,
            timePicker: true,
            timePickerIncrement: 1,
            maxDate: returnDateToday(),
            showDropdowns: true
        },
                function (start, end, label) {

                    var years = moment().diff(start, 'years');
                    dater(start);
                });
        function dater(start) {
            $scope.data.date = start;
            $scope.$emit('selectedDate', {data: $scope.data.date});
        }
    });
}
)
        .directive('capitalize', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    var capitalize = function (inputValue) {
                        if (inputValue == undefined)
                            inputValue = '';
                        var capitalized = inputValue.toUpperCase();
                        if (capitalized !== inputValue) {
                            modelCtrl.$setViewValue(capitalized);
                            modelCtrl.$render();
                        }
                        return capitalized;
                    }
                    modelCtrl.$parsers.push(capitalize);
                    capitalize(scope[attrs.ngModel]); // capitalize initial value
                }
            };
        }).filter("returnPrintingStatus", function () {
    return function (data, printingStatus) {
        var filteredProductsArray = [];
        var keys = {}
        if (data.length > 0) {
            if (angular.isArray(data) && angular.isNumber(printingStatus)) {

                for (var i = 0; i < data.length; i++) {

                    if (data[i]['PrintingStatus'] == printingStatus) {
                        var searchCategory = data[i];
                        filteredProductsArray.push(searchCategory);
                    }

                }

                return data = filteredProductsArray;
            } else {
                for (var i = 0; i < data.length; i++) {

                    if (data[i]['PrintingStatus'] != 1) {
                        var searchCategory = data[i];
                        filteredProductsArray.push(searchCategory);
                    }

                }
                return data = filteredProductsArray;
            }
        } else {
            return data;
        }

    }
})
