var mapDataConstants = angular.module('mainModule');
mapDataConstants.constant('SERVER_CONSTANTS', {
    URL: 'http://172.16.10.135:8081/cira/API/getTrackerInfo/',
    URL_POST: 'http://172.16.10.135:8081/cira/API/getDeviceHistory/',
    API_KEY: 'AIzaSyDE7TBQhMAvtpClgGjvnQsOlfbcP9',
    SERVER_URL: 'http://172.16.10.135:8081/cira/API/',
    STATUS_ERROR_CODE_0: 'Wrong username or password',
    STATUS_ERROR_CODE_2: 'Invalid user request',
    STATUS_ERROR_CODE_3: 'Timeout Error, please try again',
    STATUS_ERROR_CODE_4: 'Server returned an error, please try later',
    SERVER_ACTION:'Contacting server...',
    STATUS_ERROR_CODE_5: 'Unknown error occured',
    STATUS_ERROR_CODE_0_THEME: 'btn-danger',
    STATUS_ERROR_CODE_2_THEME: 'btn-warning',
    STATUS_ERROR_CODE_3_THEME: 'info-warning',
    STATUS_ERROR_CODE_4_THEME: 'btn-warning',
    STATUS_ERROR_CODE_5_THEME: 'info-warning',
    STATUS_SUCCESS_1: 'Request successful',
    STATUS_SUCCESS_1_THEME: 'btn-success',
    STATUS_WARNING_1_THEME: 'btn-warning',
    LOADER_DEFAULT_MESSAGE: 'Loading data...',
    LOADER_DEFAULT_UPDATE: 'Updating data...',
    LOADER_TRACKER_HISTORY_MESSAGE: 'Loading tracker history...',
    LOADER_TRACKER_SUCCESS_MESSAGE: 'Data loaded successfully',
    TIMEOUT_ERROR: 'Request timed out,server not responding',
    REFRESHING: 'Refreshing data',
    DELETING: 'Deleting row . . .',
    DEACTIVATING: 'Deactivating row . . .',
    REFRESHING_TIME: 5000,
    MAX_NO_OF_GOOGLE_MAP_POINTS: 1,
    TIMEOUT_SECONDS: 10000,
    MAX_NOTIFICATION_TIME: 3000,
    LIMIT_DEVICE_FETCH: 500,
    OTHER_FETCH_LIMIT: 500,
    LIMIT_ON_DEVICE: 1000,
    LIMIT_ON_DISPLAY: 100,
    LIMIT_ON_HISTORY: 10000,
    LAST_ONLINE_SECONDS: 30,
    MAXIMUM_NONEACTIVITY_SECONDS: 500,
    LIMIT_ON_BELOW_TABLE: 3,
    LIMIT_ON_ALL_HISTORY_TABLE: 20,
    DEVICE_HISTORY_DB_LIMIT: 8560,
    REPORTS_DB_LIMIT: 100
})