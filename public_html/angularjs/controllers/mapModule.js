var mapController = angular.module('mapController', ['ngMap']);
mapController

        .controller('mapController', function ($scope, $http, $rootScope, $q,
                NgMap, SERVER_CONSTANTS, fetchAPIDataService, SERVER_CONSTANTS, $cookieStore, $timeout) {
            var vm = this;

            var trial = '';
            $scope.mapData = {};
            $scope.mapData.trackerData = {};

            $scope.data.autoFocus = 'auto';
            $scope.useMakes = [];
            $scope.data.mapFocus = {};
            $scope.data.mapFocus.lat = -1.292067;
            $scope.data.mapFocus.lon = 36.8218526;
            $scope.data.mapFocus.zoom = 12;
            $scope.data.mapFocus.search = '';
            $scope.data.limitOnDisplay = SERVER_CONSTANTS.LIMIT_ON_DISPLAY;
            $scope.data.disabledLoad = false;
            $scope.data.lastOnlineCheck = 0;
            $scope.data.loadMore = function () {
                $scope.data.limitOnDisplay += SERVER_CONSTANTS.LIMIT_ON_DISPLAY;
                if ($scope.data.limitOnDisplay > $scope.mapData.trackerData.length) {
                    $scope.data.limitOnDisplay = $scope.mapData.trackerData.length;
                    $scope.data.disabledLoad = true;
                } else if ($scope.data.limitOnDisplay) {

                } else {
                    $scope.data.disabledLoad = false;
                }
            }



            $scope.data.returnStatus = function (unixDateTime) {
                alert('pam')
                return fetchAPIDataService.checkCarOnlineStatus(unixDateTime, SERVER_CONSTANTS.MAXIMUM_NONEACTIVITY_SECONDS)

            }
            //console.log($scope.mapData.returnStatus(1455281153,SERVER_CONSTANTS.MAXIMUM_NONEACTIVITY_SECONDS))
            $scope.data.mapFocus.options = {
                animation: google.maps.Animation.BOUNCE
            }, function () {
                return {
                    streetViewControl: true,
                    scrollwheel: false
                }
            };
//alert($scope.data.returnStatus(1446281291,600))

            var mapData = this;
            $scope.data.returnMarkerIcon = function (heading) {


                var iconUrl = fetchAPIDataService.getValidImageIcon(heading)

                vm.image = {
                    size: [40, 40],
                    scaledSize: [40, 40],
                    origin: [0, 0],
                    anchor: [10, 10]
                };
                return vm.image;
            }
            $scope.events = {
                "click": function (mapModel, eventName, originalEventArgs) {
                    alert()
                }
            }
            vm.options = {
                animation: google.maps.Animation.BOUNCE
            }, function () {
                return {
                    streetViewControl: true,
                    scrollwheel: true
                }
            };
            vm.shape = {coords: [1, 1, 1, 20, 18, 20, 18, 1], type: 'poly'};
            $scope.mapData.trackerData = '';
            $scope.data.mapFocus.description = '';
            $scope.data.mapFocus.showTraffic = false;
            $scope.data.toggleTrafficMode = function () {
                $scope.data.mapFocus.showTraffic = !$scope.data.mapFocus.showTraffic;
            }
            $scope.data.updateMapFocus = function (lat, lon, tracker) {

                $scope.data.mapFocus.lat = lat;
                $scope.data.mapFocus.lon = lon;
                $scope.data.mapFocus.zoom = 11;
                if (tracker != $scope.data.mapFocus.description) {
                    $scope.data.mapFocus.description = tracker;
                } else {
                    $scope.data.mapFocus.description = '';
                }
            }
            $scope.$watch('data.mapFocus.description', function () {
                $scope.data.mapFocus.animationType = '';
            })
            $scope.mapData.returnAnimation = function (tracker) {
                if (tracker == $scope.data.mapFocus.description) {
                    return  $scope.data.mapFocus.animationType = 'Animation.BOUNCE';
                } else {
                    return $scope.data.mapFocus.animationType = 'Animation.null';
                    ;
                }
            }

            $rootScope.username = $cookieStore.get('username');
            $scope.data.apiInfo = {};
            $scope.data.start = 1;

            $scope.data.returnCompleteUrl = function (requestDataType, limit) {
                var url = SERVER_CONSTANTS.URL + '' + $rootScope.username + '/' + $scope.data.start
                        + '/' + limit + '/' + requestDataType + '/' +
                        '?API_KEY=' + SERVER_CONSTANTS.API_KEY;
                return url;
            }
            $scope.data.convertUnixTime = function (UnixStamp) {
                return fetchAPIDataService.decodeUnixDate(UnixStamp);
            }
            $scope.data.showLoadingSideBar = true;
            $scope.data.requestDataType = 't';
            /** get tracker for a certain user**/
            $scope.mapData.getTrackerData = function () {
                $scope.data.limit = SERVER_CONSTANTS.LIMIT_ON_DEVICE;
                var defer = $q.defer();
                try {
                    $http
                            .get($scope.data.returnCompleteUrl('t', $scope.data.limit))
                            .success(function (mapData) {

                                $scope.mapData.trackerData = mapData.data;
                                $scope.data.showLoadingSideBar = false;
                                if ($scope.mapData.trackerData.length == 0) {
                                    $scope.data.autoFocus = 'false';
                                }

                                defer.resolve(mapData);
                            })
                            .error(function (error) {
                                $scope.data.noticeMessage = SERVER_CONSTANTS.STATUS_ERROR_CODE_4;
                                $timeout(function () {
                                    $scope.data.showLoadingSideBar = true;
                                }, SERVER_CONSTANTS.MAX_NOTIFICATION_TIME)
                            })
                } catch (e) {

                    console.log('unknown error occured' + e);

                }

                return defer.promise;
            }





            /** get Tracker History for the user for all devices **/
            $scope.$watch('data.showLoadingSideBar', function () {
                if ($scope.data.showLoadingSideBar == 10) {
                    $scope.mapData.getTrackerHistoryData();
                }
            })
            $scope.mapData.getTrackerHistoryData = function () {

                var defer = $q.defer();
                $scope.data.start = 1;
                $scope.data.limit = SERVER_CONSTANTS.LIMIT_ON_DEVICE;
                try {
                    $http
                            .get($scope.data.returnCompleteUrl('g', $scope.data.limit))
                            .success(function (mapData) {

                                $scope.mapData.trackerDataHistory = mapData.data;
                                defer.resolve(mapData);
                                $apply = function (fn) {
                                    try {
                                        fn();
                                    } catch (e) {
                                        $digest();
                                    }
                                }
                            })
                            .error(function (error) {
                                $scope.data.noticeMessage = SERVER_CONSTANTS.STATUS_ERROR_CODE_4;
                                $timeout(function () {
                                    $scope.data.showLoadingSideBar = true;
                                }, SERVER_CONSTANTS.MAX_NOTIFICATION_TIME)
                            })
                } catch (e) {
                    console.log('unknown error occured' + e);
                }

                return defer.promise;
            }

            /****/

            $scope.mapData.getTrackerData();



            try {
                // function updatePath() {
                $scope.update = setInterval(function () {
                    $scope.data.markerClicked();
                }, SERVER_CONSTANTS.REFRESHING_TIME);
                // }
            } catch (e) {
                console.log(e);
            }
//            google.maps.event.addDomListener(map, 'drag', function (e) {
//                google.maps.event.trigger(map, 'resize');
//                map.setZoom(map.getZoom());
//            });

            $scope.data.markerClicked = function () {
                $scope.data.noticeMessage = SERVER_CONSTANTS.REFRESHING;
                $scope.data.limit = SERVER_CONSTANTS.LIMIT_ON_DEVICE;
                $timeout(function () {
                    $scope.data.showLoadingSideBar = true;
                }, SERVER_CONSTANTS.MAX_NOTIFICATION_TIME)

                $http
                        .get($scope.data.returnCompleteUrl('t', $scope.data.limit))
                        .success(function (mapData) {
                            if ($scope.mapData.trackerData.length == 0) {
                                $scope.mapData.trackerData = mapData.data;
                            } else {
                                var newTrackerData = mapData.data;

                                for (var i = 0; i < newTrackerData.length; i++) {

                                    if (newTrackerData[i]['description'] == $scope.mapData.trackerData[i]['description']) {
//                                    $scope.mapData.trackerData[i]['description'] = 'mmmm '+i+(new Date());
                                        $scope.mapData.trackerData[i]['gps'] = newTrackerData[i]['gps'];
                                        $scope.mapData.trackerData[i]['lastTotalConnectTime'] = newTrackerData[i]['lastTotalConnectTime'];
                                        $scope.mapData.trackerData[i]['lastEventTimeStamp'] = new Date();//newTrackerData[i]['lastEventTimeStamp'];
                                        $scope.mapData.trackerData[i]['lastEventSpeedKPH'] = newTrackerData[i]['lastEventSpeedKPH'];
                                        $scope.mapData.trackerData[i]['lastOdometerKM'] = newTrackerData[i]['lastOdometerKM'];
                                        $scope.mapData.trackerData[i]['lastStartTIme'] = newTrackerData[i]['lastStartTIme'];
                                        $scope.mapData.trackerData[i]['lastValidLatitude'] = newTrackerData[i]['lastValidLatitude'];
                                        $scope.mapData.trackerData[i]['lastValidLongitude'] = newTrackerData[i]['lastValidLongitude'];
                                        $scope.mapData.trackerData[i]['lastEventSpeedKPH'] = newTrackerData[i]['lastEventSpeedKPH'];
                                        $scope.mapData.trackerData[i]['lastEventHeading'] = newTrackerData[i]['lastEventHeading'];
                                    }

                                    // $scope.$digest()

                                }
                            }


                            $scope.data.showLoadingSideBar = false;


                        })
                        .error(function (error) {
                            $scope.data.noticeMessage = SERVER_CONSTANTS.STATUS_ERROR_CODE_4;
                            $timeout(function () {
                                $scope.data.showLoadingSideBar = true;
                            }, SERVER_CONSTANTS.MAX_NOTIFICATION_TIME)
                        })

            }
            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof (fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);

                }
            };





            $scope.filterTracker = [];
            $scope.data.filterTracker = {};
            $scope.data.populateTrackerTable = function (tracker) {

                $scope.filterTracker.push(tracker)

            }

            $scope.data.mapFocus.mainCheckedMain = false;
            $scope.data.selected = [];
            $scope.data.mapFocus.mainCheckedFunction = function (checkedUsers) {

                if (checkedUsers) {
                    $scope.data.selected = [];
                    for (var i = 0; i < $scope.mapData.trackerData.length; i++) {

                        $scope.data.selected.push($scope.mapData.trackerData[i]['description']);
                    }
                    $scope.data.mapFocus.mainChecked = checkedUsers
                    //console.log($scope.data.mapFocus.mainChecked);
                } else {

                    $scope.data.mapFocus.mainChecked = checkedUsers;
                    $scope.data.selected = [];
                }

            }


            $scope.data.mapFocus.mainChecked = false;
            $scope.$watch('data.mapFocus.selectedlength', function () {
                if ($scope.data.mapFocus.selectedlength > 0) {
                    if ($scope.mapData.trackerData.length == $scope.data.selected.length) {
                        $scope.data.mapFocus.mainCheckedMain = true;
                    } else {
                        $scope.data.mapFocus.mainCheckedMain = false;
                    }
                }
                //console.log($scope.data.mapFocus.mainCheckedMain);
            })
            $scope.$apply

            $scope.mapData.returnStatus = function () {


            }


            $scope.data.showDiv = 'history';
            $scope.data.showDivOnHistory = function (whatToShow) {

                try {
                    if (whatToShow == 'map') {
                        $scope.data.showDiv = 'map';
                    } else if (whatToShow == 'history') {
                        $scope.data.showDiv = 'history';
                    }
                } catch (e) {
                    console.log(e)
                }

            }
            $scope.data.setTimeDisplayOut = function ()
            {
                $timeout(function () {
                    $scope.data.showLoadingSideBar = false;
                }, 3000
                        )
            }
            $scope.data.noticeMessage = SERVER_CONSTANTS.LOADER_DEFAULT_MESSAGE;
            $scope.data.getHistoryWhere = function (deviceId) {
                $scope.data.limit = SERVER_CONSTANTS.DEVICE_HISTORY_DB_LIMIT;
                try {
                    $scope.data.noticeMessage = SERVER_CONSTANTS.LOADER_TRACKER_HISTORY_MESSAGE
                    $scope.data.showLoadingSideBar = true;

                    $http
                            .get($scope.data.returnCompleteUrl('e/' + deviceId, $scope.data.limit))
                            .success(function (data) {
                                try {

                                    if (angular.isDefined($scope.mapData.trackerDataHistory)) {
                                        console.log(' just before ' + $scope.mapData.trackerDataHistory.length);
                                        try {
                                            var len = $scope.mapData.trackerDataHistory.length;
                                            var splitArray = [];
                                            for (var i = 0; i < len; i++) {
                                                //console.log(splitArray[i]['deviceID']+' '+deviceId);
                                                if ($scope.mapData.trackerDataHistory[i]['deviceID'] != deviceId) {
                                                    splitArray.push($scope.mapData.trackerDataHistory[i]);

                                                } else {

                                                }

                                            }
                                            $scope.mapData.trackerDataHistory = splitArray;
                                            console.log('after ' + $scope.mapData.trackerDataHistory.length);

                                            $scope.mapData.trackerDataHistory.push.apply($scope.mapData.trackerDataHistory, data.data);
                                            console.log(' after loop' + $scope.mapData.trackerDataHistory.length);

                                        } catch (e) {

                                            console.log(e);
                                        }

                                        console.log($scope.mapData.trackerDataHistory.length);
                                    } else {
                                        try {
                                            $scope.mapData.trackerDataHistory = data.data;
                                        } catch (e) {
                                            $scope.data.noticeMessage = data.data.length + 'Row(s) ' + SERVER_CONSTANTS.STATUS_ERROR_CODE_4;
                                            $timeout(function () {
                                                $scope.data.showLoadingSideBar = true;
                                            }, 3000
                                                    )
                                            console.log('timeout ' + e);

                                        }

                                        console.log('does not exist');
                                    }
                                    $rootScope.$broadcast('trackerHistory', {data: $scope.mapData.trackerDataHistory});
                                    $scope.data.noticeMessage = data.data.length + 'Row(s) ' + SERVER_CONSTANTS.LOADER_TRACKER_SUCCESS_MESSAGE;
                                    $timeout(function () {
                                        $scope.data.showLoadingSideBar = false;
                                    }, 3000
                                            )

                                } catch (e) {
                                    console.log('timeout 2nd' + e);
                                }

                            })
                            .error(function (error) {
                                $scope.data.noticeMessage = SERVER_CONSTANTS.STATUS_ERROR_CODE_4;
                                $timeout(function () {
                                    $scope.data.showLoadingSideBar = true;
                                }, SERVER_CONSTANTS.MAX_NOTIFICATION_TIME)
                                console.log(error)
                            })
                } catch (e) {


                }


            }
            $scope.data.selectedDeviceNo = [];
            $scope.data.mapFocus.selectedlength = $scope.data.selected.length;
            $scope.data.updateTrackerTable = function (tracker, deviceId, allowedType) {


                var filterArray = $scope.data.selected;
                var filterArrayDeviceNo = $scope.data.selectedDeviceNo;
                try {
                    var existing = true;
                    for (var i = 0; i < filterArray.length; i++) {

                        if (filterArray[i] == tracker) {
                            filterArrayDeviceNo.splice(i, 1)
                            filterArray.splice(i, 1);
                            existing = false;
                            break;
                        }


                    }


                    if (existing == true) {
                        if (allowedType == 1) {
                            $scope.data.getHistoryWhere(deviceId)
                        }
                        filterArray.push(tracker);
                        filterArrayDeviceNo.push(deviceId);
                    }


                    $scope.data.mapFocus.selectedlength = $scope.data.selected.length;
                    $scope.data.selected = filterArray;
                    $scope.data.selectedDeviceNo = filterArrayDeviceNo;

                } catch (e) {
                    console.log('Error : ' + e);
                }

            }
            var location = '';
            $scope.data.returnLocation = function (locationData) {

                var counter = 0;
                angular.forEach(locationData.results, function (value, key) {

//            angular.forEach(value.address_components, function (valueTwo, key) {
//                console.log((valueTwo.long_name[key]));
//            })
                    if (counter == 0) {
                        for (var i = 0; i < 1; i++) {
                            location = value.address_components[i]['long_name'];
                            console.log(value.address_components[i]['long_name'])
                            break;
                        }

                    }
                    counter++;
                }
                )
                return location;
            }





            $scope.testJquery = function (trackername, location, battery, rcv_time, direction) {
                //alert('mouse passed');
                $scope.data.mapFocus.trackerClicked = '';
                $scope.data.mapFocus.trackerClicked = trackername;
                $scope.data.mapFocus.location = location;
                $scope.data.mapFocus.battery = battery;
                $scope.data.mapFocus.Rcv_time = rcv_time;
                $scope.data.mapFocus.direction = direction;
                jQuery('.tracker').popover({
                    html: true,
                    content: function () {
                        return $('#popover_content_wrapper').html();
                    }
                });
            }
            $scope.data.showMoreHistory = function () {
                jQuery('.history').popover({
                    html: true,
                    placement: 'right',
                    content: function () {
                        return $('#popover_content_wrapper_history').html();
                    }
                });
            }
            $scope.data.panelLength = 400;
            $scope.data.panelWidth = 300;
            $scope.data.panelCount = 0;
            $scope.data.trackerOnFocus = '';
            var resize = function () {

                // okay, we've got a map and we need to resize it
                var center = map.getCenter();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
            }


            $scope.data.getLiveOnlineStatus = function () {


            }


            NgMap.getMap().then(function (map) {
                console.log('map displayed');
                vm.map = map;
            });
            vm.clicked = function () {

            };
            vm.showDetail = function (e, beach) {
                vm.beach = beach;
                vm.map.showInfoWindow('foo-iw', beach.description);
            };
            vm.hideDetail = function () {
                vm.map.hideInfoWindow('foo-iw');
            }
            ;
            vm.myOptions = {
                boxClass: "YOUR CSS CLASS",
                boxStyle: {
                    background: 'red'
                }

            }




            $scope.data.polyLinePoints = [];
            $scope.data.DrawPath = function (tracker) {
                var positionInfo = [];
                // $scope.mapData.trackerData 
//                if ($scope.data.polyLinePoints[0]['lat'] == '0') {
//                    $scope.data.polyLinePoints = [];
//                }
                for (var i = 0; i < $scope.mapData.trackerData.length; i++) {

                    if ($scope.mapData.trackerData[i]['description'] == tracker) {

                        $scope.data.polyLinePoints.push(
                                {lat: Number($scope.mapData.trackerData[i]['lastValidLatitude']),
                                    lng: Number($scope.mapData.trackerData[i]['lastValidLongitude'])})
                    }
                }
                console.log('total points ' + $scope.data.polyLinePoints.length)

            }
            $scope.data.testHttp = function () {

                var data = httpFactory.async().then(function (d) { //2. so you can use .then()
                    return d.name;
                });
                return data
            }
            //console.log($scope.data.testHttp());








            $scope.data.getLastOnline = function (lastTimeCheck) {

                var today = Math.floor(Date.now() / 1000);
                var secondsLast = 0
                var secondsLast = (lastTimeCheck * 60 * 60)
                var returnValue = 0

                if (lastTimeCheck > 0) {
                    returnValue = today - secondsLast
                } else if (lastTimeCheck < 0) {

                    returnValue = -(today + secondsLast)
                } else if (lastTimeCheck == 0) {
                    returnValue = 0
                }
                //convert to seconds//
                //$scope.data.lastOnlineCheck = returnValue;
                // $scope.$digest();
                return Number(returnValue);
            }
            google.maps.event.addListener(NgMap, 'click', function (event) {

                alert(event.latLng);
            });


//            var bounds = new google.maps.LatLngBounds();
//            for (var i = 0; i < 100; i++) {
//                var latlng = new google.maps.LatLng($scope.mapData.trackerDataHistory[i]['lastValidLatitude'], 
//                $scope.mapData.trackerDataHistory[i]['lastValidLongitude']);
//                bounds.extend(latlng);
//            }
//
//            NgMap.getMap().then(function (map) {
//                map.setCenter(bounds.getCenter());
//                map.fitBounds(bounds);
//            });

        })

        .run(function ($rootScope, NgMap) {
            NgMap.getMap().then(function (map) {
                google.maps.event.trigger(map, 'resize');
            });
        })
 
        .directive('onlineStatusTracker', function () {

            return {
                template: "<button type='button'  class='btn btn-sm btn-success btn-circle'>\n\
                       <i class=''></i></button><button type='button' ng-show='mapData.returnStatus()' \n\
                      class='btn btn-sm btn-danger btn-circle'><i class=''></i></button>"
            }
        })
        .filter('unique', function () {
            return function (input, key) {
                var unique = {};
                var uniqueList = [];
                for (var i = 0; i < input.length; i++) {
                    if (typeof unique[input[i][key]] == "undefined") {
                        unique[input[i][key]] = "";
                        uniqueList.push(input[i]);
                    }
                }
                return uniqueList;
            };
        })
        .filter('filterClicked', function () {
            return function (input, filterArray) {
                var unique = {};
                var uniqueList = [];
                for (var j = 0; j < filterArray.length; j++) {
                    for (var i = 0; i < input.length; i++) {

                        if (unique[input[i]['description']] == filterArray[j]) {

                            uniqueList.push(input[i]);
                        }
                    }
                }
                return uniqueList;
            };
        });