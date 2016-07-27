var infoHolder = require('./holders/info_holder');
var backendClient = require('./helpers/backend_client');
var authenticationInterceptor = require('./interceptors/authentication_interceptor');

var userService = require('./services/user_service');
var dashboardService = require('./services/dashboard_service');
var applicationService = require('./services/application_service');

module.exports = {
    infoHolder: infoHolder,
    backendClient: backendClient,
    authenticationInterceptor: authenticationInterceptor,
    userService: userService,
    dashboardService: dashboardService,
    applicationService: applicationService
};
