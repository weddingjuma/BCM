angular.module('mainModule');
angular.module('mainModule').controller('TypeaheadCtrl', function ($scope, $cookieStore, $http, serverURL,
        SERVER_CONSTANTS, $rootScope, $location, serverURLGTS, fetchAPIDataService, $window, dataStorage, $timeout) {

    var _selected;
    $scope.Typeahead = {};
    $scope.selected = undefined;
    $scope.Typeahead.customers =
            ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
                'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
                'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
                'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
                'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.ngModelOptionsSelected = function (value) {

        if (arguments.length) {
            _selected = value;
        } else {
            return _selected;
        }
    };
    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };
    $scope.Typeahead.test = 'Search Customer or Registration ';
    $scope.governorData = {};
    $scope.governorData.governorInstallations = [];
    $scope.Typeahead.onSelected = function (selected) {
        var governor = dataStorage.governorData;
        var regNoStarts = selected.indexOf("#");
        var regNo = selected.substring(regNoStarts + 1);
        if (governor.length > 0) {
            var tempArray = [];
            for (var i = 0; i < governor.length; i++) {

                if (regNo == governor[i]['RegistrationNumber']) {
                    tempArray.push(governor[i]);
                }
            }

            $scope.governorData.governorInstallations = tempArray;
        }


    }
    var focused = document.activeElement;
    // alert(focused)
    $scope.Typeahead.name = [];
    $scope.Typeahead.createArrayCustomers = function () {
        var tempArray = [];
        var customerArray = dataStorage.governorData;
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                    var customer = customerArray[i]['CustomerName'] + ' #' + customerArray[i]['RegistrationNumber'];
                    tempArray.push(customer);
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
    $scope.governorData.custId = '';
    $scope.governorData.vehicleId = '';
    $scope.governorData.custId = '';
    function returnCustomerId(selected) {
        var governor = dataStorage.customersjoinVehicles;
        var regNoStarts = selected.indexOf("#");
        var regNo = selected.substring(regNoStarts + 1);
        var id;
        if (governor.length > 0) {
            var tempArray = [];
            for (var i = 0; i < governor.length; i++) {

                if (regNo == governor[i]['regNo']) {
                    id = governor[i]['id'];
                    $scope.governorData.vehicleId = id;
                    $scope.governorData.custId = governor[i]['custId'];
                    tempArray.push(governor[i]);


                    break;
                }
            }

            return tempArray;
        }
    }
    $cookieStore.put('governorType', 1);
    $scope.Typeahead.printGovernorCertificate = function (type, ticketId, governorType) {
     
        var data = {};
        if (angular.isUndefined(ticketId)) {
            $scope.data.showGritter(12);
        } else {
            $cookieStore.put('governorType', governorType);
            var startDate = $('#date').val();
            $scope.modalData.printCertificate(1, $scope.governorData.vehicleId, 0, startDate, type, ticketId);
        }
    }


    $scope.Typeahead.returnAllCustomers = function () {
        var tempArray = [];
        var customerArray = dataStorage.allCustomers;
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                    var customer = customerArray[i]['name'] + ' #' + customerArray[i]['id'];
                    tempArray.push(customer);
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
    
     $scope.Typeahead.returnAllUnlinkedVehicles = function () {
        var tempArray = [];
        var customerArray = dataStorage.unlinkedVehicles;
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                    var customer = customerArray[i]['regNo'] + ' #' + customerArray[i]['id'];
                    tempArray.push(customer);
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
    
    
    
        $scope.Typeahead.returnAllVehicles = function () {
        var tempArray = [];
        var customerArray = dataStorage.allAppData;
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                    var customer = customerArray[i]['regNo'] + ' #' + customerArray[i]['id'];
                    tempArray.push(customer);
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
    
    
    
    
    
    $scope.Typeahead.returnArrayCustomersJoinVehicles = function () {
        var tempArray = [];
        var customerArray = dataStorage.customersjoinVehicles;
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                    var customer = customerArray[i]['name'] + ' #' + customerArray[i]['regNo'];
                    tempArray.push(customer);
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
     $scope.Typeahead.returnDevices = function () {
        var tempArray = [];
        var customerArray = dataStorage.devices;
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                      if(customerArray[i]['type']=='TRACKER'){
                    var customer = customerArray[i]['imei'];
                    tempArray.push(customer);
                
                      
                      }
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
      $scope.Typeahead.returnDevicesGovernor = function () {
      
        var tempArray = [];
        var customerArray = dataStorage.devices;
        console.log(customerArray);
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                    if(customerArray[i]['type']=='GOVERNOR'){
                    var customer = customerArray[i]['imei'];
                    tempArray.push(customer);
                
                      
                      }
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
    
    
         $scope.Typeahead.returnDatalines = function () {
        var tempArray = [];
        var customerArray = dataStorage.simCards;
      
        try {
            if (customerArray.length > 0) {

                for (var i = 0; i < customerArray.length; i++) {
                    var customer = customerArray[i]['simNumber'];
                    tempArray.push(customer);
                }

            } else {
                tempArray = ['error'];
            }
            return tempArray;
        } catch (e) {
            console.log(e);
        }

    }
    
    
    
    
    
    $scope.Typeahead.pickGovernorCVehicle = function (selected) {

        $scope.governorData.customerJoinVehicles = returnCustomerId(selected);
        console.log($scope.governorData.customerJoinVehicles.regNo)

    }

    $scope.Typeahead.returnArrayCustomers = function (customerArray) {

//$timeout(function () {
        return  $scope.Typeahead.createArrayCustomers();
        //}, 3000)
    }
    $timeout(function () {

        $scope.Typeahead.getGovernorInstallations();
    }, 3000)

    $scope.Typeahead.getGovernorInstallations = function () {

        try {
            $scope.data.showGritter(3);
            var url = serverURL + 'fetchAllGovernorInstallations'
            $http
                    .post(url)
                    .success(function (data) {
                        $scope.data.showGritter(1);
                        if (data.status == 1) {
                            $scope.Typeahead.allSystemUsersResponse = true;
                            $scope.Typeahead.governorInstallations = data.data;
                            dataStorage.ChangeGovernorData(data.data)
                        } else {


                        }

                    })
                    .error(function (error) {

                    })
        } catch (e) {
            $scope.modalData.createFailLogs(e);
        }


    }



});