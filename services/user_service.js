module.exports = function(backendClient, authInfoService) {
    return {
        //Does login of user
        //Stores user data in authInfoService
        //Set loginError on controller object in case of error
        //Calls the callback methods with the response/error data
        login: function(controller, credentials) {
            var promise = new Promise(function(resolve, reject) {
                controller.loginError = undefined;
                backendClient.login(credentials.phone, credentials.password)
                .then(function(response) {
                    authInfoService.user = response.data;
                    resolve(response.data);
                })
                .catch(function(response) {
                    controller.loginError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        //Does logout of user
        //Clears user data in authInfoService
        //Set logoutError on controller object in case of error
        //Calls the callback methods with the response/error data
        logout: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.logoutError = undefined;
                backendClient.logout()
                .then(function(response) {
                    authInfoService.user = {};
                    resolve(response.data);
                })
                .catch(function(response) {
                    controller.logoutError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        //Does registration of user
        //Stores user data in authInfoService
        //Set registerError on controller object in case of error
        //Calls the callback methods with the response/error data
        register: function(controller, credentials) {
            var promise = new Promise(function(resolve, reject) {
                controller.registerError = undefined;
                backendClient.register(credentials)
                .then(function(response) {
                    authInfoService.user = response.data;
                    resolve(response.data);
                })
                .catch(function(response) {
                    controller.registerError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        //Gets logged in user's information
        //Calls the callback methods with the response/error data
        me: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                backendClient.me()
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(response) {
                    reject(response.message);
                });
            });
            return promise;
        },
        //Send a OTP to user's mobile
        //Sets generateError on the controller object
        //Calls the callback methods with the response/error data
        generateOtp: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.generateError = undefined;
                backendClient.generateOtp()
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(response) {
                    controller.generateError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        //Checks if the OTP matches the one sent in the SMS
        //Sets verifyError on the controller object
        //If OTP match fails, then calls the error callback with error message
        //Calls the callback methods with the response/error data
        verifyOtp: function(controller, otp) {
            var promise = new Promise(function(resolve, reject) {
                controller.verifyError = undefined;
                backendClient.verifyOtp(otp)
                .then(function(response) {
                    if(response.data) {
                        resolve(response.data);
                    }
                    else {
                        var message = 'The provided OTP did not match the one sent in SMS';
                        controller.verifyError = message;
                        reject(message);
                    }
                })
                .catch(function(response) {
                    controller.verifyError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        }
    };
};
