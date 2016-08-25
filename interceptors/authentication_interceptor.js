module.exports = function($q, $location) {
    return {
            response: function(response){
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $location.path('/user/login');
                }
                return $q.reject(rejection);
            }
        };
};
