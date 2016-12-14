angular.module("customModuleFilter", [])
        .filter("trackerFilter", function () {
            return function (data, propName) {


                if (angular.isArray(data) && angular.isString(propName)) {
                    var filteredProductsArray = [];
                    var keys = {}
                    for (var i = 0; i < data.length; i++) {

                        if (data[i]['tracker'] == propName) {
                            var searchCategory = data[i];

                            filteredProductsArray.push(searchCategory);

                        }

                    }
                    return data = filteredProductsArray;

                }


            }
        })
        .filter("filterExpiredCerts", function () {
            return function (data, timeLimit) {
                var d = Date.parse(new Date()) / 1000
                timeLimit = (timeLimit * 24 * 60 * 60);
                var validity = Number(d) + timeLimit;

                if (angular.isArray(data) && angular.isNumber(validity)) {
                    var filteredProductsArray = [];
                    var keys = {}
                    for (var i = 0; i < data.length; i++) {

                        if (data[i]['validEndOn'] > d && data[i]['validEndOn'] < validity) {
                            if (data[i]['generated'] == 1 && data[i]['approved'] == 1) {
                                var searchCategory = data[i];

                                filteredProductsArray.push(searchCategory);
                            }
                        }

                    }
                    return data = filteredProductsArray;

                }


            }
        })
        .filter("filterData", function () {
            return function (data, filter, column, column2) {

                if (angular.isDefined(filter)) {

                    if (angular.isArray(data) && angular.isString(filter)) {
                        console.log(filter + " " + column + " " + column2);
                        var filteredProductsArray = [];
                        var keys = {}
                        if (filter.length > 1) {
                            for (var i = 0; i < data.length; i++) {
                                var str = data[i][column].toLowerCase();
                                var str2 = data[i][column2].toLowerCase();
                                filter = filter.toLowerCase();
                                if (str.includes(filter) || str2.includes(filter)) {
                                    var searchCategory = data[i];

                                    filteredProductsArray.push(searchCategory);

                                }
                                if (filteredProductsArray.length >= 0 && filteredProductsArray.length == 30) {
                                    break;
                                }

                            }
                            data = filteredProductsArray;

                        }
                    }
                }
                return data;


            }
        })
        .filter("filterByRange", function () {
            return function (data, range, limit) {

                if (angular.isDefined(range)) {

                    if (angular.isArray(data) && angular.isNumber(Number(range))) {
                        var filteredProductsArray = [];
                        var keys = {}
                        if (range > 1) {
                            for (var i = 0; i < data.length; i++) {

                                if (i > range && i <= (range + limit)) {
                                    var searchCategory = data[i];

                                    filteredProductsArray.push(searchCategory);

                                }


                            }
                            data = filteredProductsArray;

                        }
                    }
                }
                return data;


            }
        })
        .filter("filterExpiredCertsAll", function () {
            return function (data, timeLimit) {
                var d = Date.parse(new Date()) / 1000
                timeLimit = (timeLimit * 24 * 60 * 60);
                var validity = Number(d) + timeLimit;

                if (angular.isArray(data) && angular.isNumber(validity)) {
                    var filteredProductsArray = [];
                    var keys = {}
                    for (var i = 0; i < data.length; i++) {

                        if (data[i]['validEndOn'] < d) {
                            var searchCategory = data[i];
                            if (data[i]['status'] == 1 && data[i]['approved'] == 1) {
                                filteredProductsArray.push(searchCategory);
                            }
                        }

                    }
                    return data = filteredProductsArray;

                }


            }
        })
        .filter("trackerFilterSelected", function () {
            return function (data, propName) {


                if (angular.isArray(data) && angular.isArray(propName)) {
                    var filteredProductsArray = [];
                    var keys = {}
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < propName.length; j++) {
                            if (data[i]['description'] == propName[j]) {
                                var searchCategory = data[i];

                                filteredProductsArray.push(searchCategory);

                            }
                        }
                    }

                    return data = filteredProductsArray;
                }


            }
        })
        .filter("trackerFilterSelectedOnMap", function () {
            return function (data, propName) {

                if (propName.length > 0) {
                    if (angular.isArray(data) && angular.isArray(propName)) {
                        var filteredProductsArray = [];
                        var keys = {}
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < propName.length; j++) {
                                if (data[i]['description'] == propName[j]) {
                                    var searchCategory = data[i];

                                    filteredProductsArray.push(searchCategory);

                                }
                            }
                        }

                        return data = filteredProductsArray;
                    }


                } else {
                    return data;
                }
            }
        })
        .filter("trackerFilterSelectedOnMapPage", function () {

            return function (data, currentPage, range) {
                var filteredProductsArray = [];
                var keys = {}
                var startPosition = 1;
                if (currentPage == 1) {
                    startPosition = 0;
                } else {
                    startPosition = ((Number(currentPage) - 1) * range);
                }

                if (angular.isArray(data)) {
                    var finishPosition = data.length < startPosition + range ? data.length : startPosition + range;

                    for (var j = startPosition; j < finishPosition; j++) {

                        var searchCategory = data[j];

                        filteredProductsArray.push(searchCategory);
                    }
                    return data = filteredProductsArray;
                    //  console.log('is an array');
                } else {
                    // console.log('is not an array');
                }
            }
        })
        .filter("trackerFilterSelectedOnHistoryPage", function () {

            return function (data, currentPage, itemsPerPage) {
                var filteredProductsArray = [];
                var keys = {}
                var startPosition = 1;
                if (currentPage == 1) {
                    startPosition = 0;
                } else {
                    startPosition = ((Number(currentPage) - 1) * itemsPerPage);
                }

                if (angular.isArray(data)) {
                    var finishPosition = data.length < startPosition + itemsPerPage ? data.length : startPosition + itemsPerPage;

                    for (var j = startPosition; j < finishPosition; j++) {

                        var searchCategory = data[j];

                        filteredProductsArray.push(searchCategory);
                    }
                    return data = filteredProductsArray;
                    //   console.log('is an array');
                } else {
                    // console.log('is not an array');
                }
            }
        })
        .filter('trackerFilterLastOnline', function () {
            return function (data, lastOnline) {
                try {
                    //  console.log(lastOnline);
                    if (angular.isNumber(Number(lastOnline))) {

                        //if (angular.isArray(data) && angular.isNumber(lastOnline)) {
                        var filteredProductsArray = [];
                        var keys = {}
                        if (lastOnline != 0) {

                            for (var i = 0; i < data.length; i++) {
                                if (lastOnline > 0) {
                                    if (data[i]['lastEventTimeStamp'] > lastOnline) {

                                        var searchCategory = data[i];

                                        filteredProductsArray.push(searchCategory);

                                    }
                                }
                                if (lastOnline < 0) {

                                    lastOnline = 0 - lastOnline

                                    if (data[i]['lastEventTimeStamp'] < lastOnline) {
                                        var searchCategory = data[i];

                                        filteredProductsArray.push(searchCategory);

                                    }
                                }

                            }
                            return filteredProductsArray;
                        } else {
                            return data;
                        }


                        //}


                    }
                    {
                        // console.log('not a number')
                        return data;
                    }



                } catch (e) {
                    console.log('ERROR ' + e)
                }
            }



        })

        .filter('filterReturnNumberOfPages', function () {
            try {
                return function (data, itemsPerPage) {
                    if (angular.isArray(data)) {
                        if (data.length != 0) {
                            return Math.ceil(data.length / itemsPerPage);
                        } else {
                            return 'Tracker List';
                        }
                    } else {
                        return 1;
                    }
                }
            } catch (e) {
                console.log(e);
            }
        })
        .filter('ceil', function () {
            return function (input) {
                return Math.ceil(input);
            };
        });