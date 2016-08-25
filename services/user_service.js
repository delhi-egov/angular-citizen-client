module.exports = function($state, backendClient, authInfo) {
    return {
        //Does login of user
        //Stores user data in authInfo
        //Set loginError on controller object in case of error
        //Takes user to either verify or home page
        login: function(controller, credentials) {
            controller.loginError = undefined;
            backendClient.login(credentials.phone, credentials.password)
            .then(function(response) {
                authInfo.user = response.data;
                if(authInfo.user.role === 'UNVERIFIED') {
                    $state.go('user.verify');
                }
                else {
                    $state.go('dashboard.home');
                }
            },function(response) {
                controller.loginError = "Incorrect credentials";
            });
        },
        //Does logout of user
        //Clears user data in authInfo
        //Set logoutError on controller object in case of error
        //Takes the user to the login page
        logout: function(controller) {
            controller.logoutError = undefined;
            backendClient.logout()
            .then(function(response) {
                authInfo.user = {};
                $state.go('user.login');
            },function(response) {
                controller.logoutError = response.message;
            });
        },
        //Does registration of user
        //Stores user data in authInfo
        //Set registerError on controller object in case of error
        //Takes the user to verify page
        register: function(controller, credentials) {
            controller.registerError = undefined;
            backendClient.register(credentials)
            .then(function(response) {
                authInfo.user = response.data;
                $state.go('user.verify');
            },function(response) {
                controller.registerError = response.message;
            });
        },
        //Gets logged in user's information
        //Calls the callback methods with the response/error data
        me: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                backendClient.me()
                .then(function(response) {
                    resolve(response.data);
                },function(response) {
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
                },function(response) {
                    controller.generateError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        //Checks if the OTP matches the one sent in the SMS
        //Sets verifyError on the controller object in case of error or verification failure
        //Takes user to home page if verification succeeds
        verifyOtp: function(controller, otp) {
            controller.verifyError = undefined;
            backendClient.verifyOtp(otp)
            .then(function(response) {
                if(response.data) {
                    $state.go('dashboard.home');
                }
                else {
                    var message = 'The provided OTP did not match the one sent in SMS';
                    controller.verifyError = message;
                }
            },function(response) {
                controller.verifyError = response.message;
            });
        }
    };
};
