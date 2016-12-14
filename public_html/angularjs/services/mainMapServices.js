var fetchAPIData = angular.module('mainModule')
fetchAPIData.service('fetchAPIDataService', function ($http) {
    this.fetchAPIdataFunction = function (url, params, callback) {

//        if (jQuery.localStorage.isSet("username"))
//        {
//            params.user = jQuery.localStorage.get("username");
//            params.sess_id = jQuery.localStorage.get("sess_id");
//        }

        jQuery.ajax({
            url: url,
            type: 'POST',
            data: params,
            success: function (data)
            {
                console.log(data);
                try
                {
                    var results = $.parseJSON(data);
                    if (results.status_code !== "0")
                    {
                        return callback(results.status_msg);
                    }
                    return callback(results);
                } catch (e)
                {
                    console.log(e);
                    return callback(null);
                }
            },
            error: function (xhr, status, error)
            {
                if (xhr.responseText)
                {
                    console.log(xhr.responseText + ": " + error);
                }
                return callback(null);
            }});
    }
    this.decodeUnixDate = function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }
    this.returnAfterHashTag = function (selected) {

        var hashStarts = selected.indexOf("#");
        var string = selected.substring(hashStarts + 1);

        return string;

    }
    this.returnStringDate = function (dateString) {

        if (dateString != 0)
        {
            var d = Date.parse(dateString) / 1000

            return d;
        } else {
            return 1;
        }
    }
    this.watchOnScroll = function () {

        document.addEventListener('scroll', function (event) {
            if (document.body.scrollHeight ==
                    document.body.scrollTop +
                    window.innerHeight) {
                alert("Bottom!");
            }
        });
    }
    this.getRandomCode = function () {
        var text = "";
        alert();
        var possible = "0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        $scope.data.globalSettings.code = text;
        return text;
    }
    this.checkCarOnlineStatus = function (dateUnix, constant) {
        var today = Math.floor(Date.now() / 1000);
        var dif = today - dateUnix
        if (dif < constant) {
            return true;
        } else {
            return false;
        }
    }
    this.returnTimeInSec = function (timeInHours) {
        var time = 0;
        if (angular.isNumber(timeInHours)) {
            return time = (Math.floor(Date.now() / 1000)) - (timeInHours * 60 * 60);
        } else {
            return false;
        }

    }
    this.returnWhereArrayTime = function (arrayOfData, lastTime) {
        try {
            if (angular.isArray(arrayOfData)) {
                var returnArray = [];
                console.log(lastTime + ' ' + arrayOfData.length);
                if (angular.isNumber(lastTime)) {
                    if (arrayOfData.length > 0) {
                        for (var i = 0; i < arrayOfData.length; i++) {
                            var tempArray = [];
                            if (Number(arrayOfData[i]['timestamp']) >= lastTime) {
                                tempArray = arrayOfData[i];
                                returnArray.push(arrayOfData[i]);

                            }

                        }
                        console.log('Array length of ' + returnArray.length + '  lst' + lastTime);
                        return arrayOfData = returnArray;
                    } else {
                        console.log('Array length 0');
                        return arrayOfData
                    }

                } else {
                    console.log('lastine not a number ' + lastTime);
                    return arrayOfData
                }

            } else {
                console.log('not an array ' + arrayOfData);
                return arrayOfData;
            }
        } catch (e) {
            console.log(e);
        }

    }
    this.refreshTracker = function (functionName, timeMinutes) {
        var update = setInterval(function () {
            functionName();
        }, timeMinutes);
    }

    this.createAPIurl = function (SERVER_CONSTANTS) {
        try {
            var url = SERVER_CONSTANTS.URL_POST + '?API_KEY=' + SERVER_CONSTANTS.API_KEY;
            console.log(' from service ' + url);
            return url;
        } catch (e) {
            console.log(e);
        }
    }
    this.cutString = function (stringData, strLength) {
        var str = stringData;
        var res = str.substring(0, strLength);
        return res;
    }
    this.roundOffToDecimal = function (num, decimalPlaces) {
        try {
            if (angular.isNumber(decimalPlaces)) {
                if (angular.isNumber(Number(num))) {
                    return  parseFloat((parseFloat(num)).toFixed(decimalPlaces));
                } else {
                    return num;
                }

            } else {
                return num;
            }
        } catch (e) {
            console.log(e)
        }
    }
    this.returnFilteredArray = function (newArray, id) {

    }
    this.async = function (url) {
        return $http.get(url)
                .then(function (response) {
                    var data = response.data;
                    console.log(data);
                    return data;
                });


    };
    this.returnStringDate = function (dateString) {

        if (dateString != 0)
        {
            var d = Date.parse(dateString) / 1000

            return (d + (24 * 60 * 60));
        } else {
            return 1;
        }
    }





    this.getValidImageIcon = function (heading) {

        try {
            heading = Number(heading);
            var imagePath = '';
            if (heading > 0) {
                if (heading > 0 && heading <= 22.5 || heading > 337.5 && heading < 360) {
                    imagePath = 'images/images/N.png';
                }
                if (heading > 22.5 && heading <= 77.5) {
                    imagePath = 'images/images/NE.png';
                }
                if (heading > 77.5 && heading <= 112.5) {
                    imagePath = 'images/images/E.png';
                }
                if (heading > 112.5 && heading <= 157.5) {
                    imagePath = 'images/images/SE.png';
                }
                if (heading > 157.5 && heading <= 202.5) {
                    imagePath = 'images/images/S.png';
                }
                if (heading > 202.5 && heading <= 247.5) {
                    imagePath = 'images/images/SW.png';
                }
                if (heading > 247.5 && heading <= 292.5) {
                    imagePath = 'images/images/W.png';
                }
                if (heading > 292.5 && heading <= 337.5) {
                    imagePath = 'images/images/NW.png';
                }
            } else {
                imagePath = 'images/images/N.png';

            }
            return imagePath;
        } catch (e) {
            console.log(e);
        }

    }

})
        .factory('httpFactory', function ($http) {
            return {
                async: function () {
                    return $http.get('http://172.16.10.135:8081/flexTracker/public_html/angularjs/controllers/test.json');  //1. this returns promise
                }
            };
        })
        .factory('myService', function ($http, $q) {
            var myService = {};
            myService.async = function (url) {
                return $http.get(url)
                        .then(function (response) {
                            var data = response.data;
                            console.log(data);
                            return data;
                        });
            };

            return myService;
        })
        .factory('dataStorage', function () {
            var appStorage = {};

            appStorage.simCards = {};
            appStorage.devices = {};
            appStorage.allAppData = {};
            appStorage.allCustomers = {};
            appStorage.customersDetails = {};
            appStorage.vehicleDetails = {};
            appStorage.customersjoinVehicles = {};
            appStorage.governorData = {};
            appStorage.contacts = {}
            appStorage.tickets = {}
            appStorage.insurers = {}
            appStorage.financiers = {};
            appStorage.chatMessages = {}
            appStorage.unlinkedVehicles ={}
            appStorage.allCertData ={}
            appStorage.ChangeData = function (value) {

                appStorage.allAppData = value;

            };
            appStorage.ChangeCertData = function (value) {

                appStorage.allCertData = value;

            };
            appStorage.ChangeUnlinkedVehicles = function (value) {

                appStorage.unlinkedVehicles = value;

            };
            appStorage.ChangeChatMessages = function (value) {
                appStorage.chatMessages = value;

            }
            appStorage.ChangeCustomerDetails = function (value) {

                appStorage.customersDetails = value;
                console.log(appStorage.customersDetails);
            }
            appStorage.ChangeTicketsData = function (value) {

                appStorage.tickets = value;

            };
            appStorage.ChangeCustomerData = function (value) {

                appStorage.allCustomers = value;

            };
            appStorage.ChangeVehicleDetails = function (value) {

                appStorage.vehicleDetails = value;

            };
            appStorage.ChangeInsurersData = function (value) {
                appStorage.insurers = value;
            }
            appStorage.ChangeFinanciersData = function (value) {
                appStorage.financiers = value;
            }
            appStorage.ChangeCustomersjoinVehiclesData = function (value) {

                appStorage.customersjoinVehicles = value;

            };
            appStorage.ChangeDataLineData = function (value) {

                appStorage.simCards = value;

            };
            appStorage.ChangeDeviceData = function (value) {

                appStorage.devices = value;

            };
            appStorage.ChangeGovernorData = function (value) {

                appStorage.governorData = value;

            };
            appStorage.ChangeContactData = function (value) {
                appStorage.contacts = value;
            }





            return appStorage;
        });