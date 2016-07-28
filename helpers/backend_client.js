module.exports = function($http, Upload) {
    return {
        login: function(phone, password) {
            var config = {
                headers: {
                    "Authorization" : "Basic " + window.btoa(phone + ":" + password)
                }
            };
            return $http.post('/api/user/login', {}, config);
        },
        logout: function() {
            return $http.post('/api/user/logout', {});
        },
        register: function(credentials) {
            return $http.post('/api/user/register', credentials);
        },
        me: function() {
            return $http.get('/api/user/me');
        },
        generateOtp: function() {
            return $http.get('/api/user/generateOtp');
        },
        verifyOtp: function(otp) {
            return $http.post('/api/user/verifyOtp', {otp: otp});
        },
        createApplication: function(type) {
            return $http.post('/api/application/create', {type: type});
        },
        changeStage: function(applicationId, stage) {
            return $http.post('/api/application/changeStage', {
                applicationId: applicationId,
                stage: stage
            });
        },
        attachForm: function(applicationId, type, form) {
            return $http.post('/api/application/attachForm', {
                applicationId: applicationId,
                type: type,
                form: form
            });
        },
        attachDocument: function(applicationId, type, file) {
            return Upload.upload({
                url: '/api/application/attachDocument',
                data: {
                    file: file,
                    form: JSON.stringify({
                        applicationId: applicationId,
                        type: type,
                    })
                }
            });
        },
        complete: function(applicationId) {
            return $http.post('/api/application/complete', {
                applicationId: applicationId
            });
        },
        getApplications: function() {
            return $http.get('/api/applications/');
        },
        getStatus: function(applicationId) {
            return $http.get('/api/application/' + applicationId + '/status');
        },
        getForms: function(applicationId) {
            return $http.get('/api/application/' + applicationId + '/forms');
        },
        getDocuments: function(applicationId) {
            return $http.get('/api/application/' + applicationId + '/documents');
        }
    };
};
