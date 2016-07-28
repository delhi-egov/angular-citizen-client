module.exports = function($state, backendClient, authInfo, applicationInfo, appConfig) {
    return {
        //Takes the user to the starting page for the given process type
        //Picks the initial stage from the appConfig
        newApplication: function(controller, processType) {
            var nextState = processType + '.' + appConfig[processType].nextState;
            var nextStage = appConfig[processType].firstStage;
            $state.go(nextState, {
                processType: processType,
                currentStage: nextStage,
                params: undefined
            });
        },
        //Takes user to the page where he left off last time
        //Picks the processType and currentStage from application
        //Picks the nextState and nextStage from the appConfig
        resumeApplication: function(controller, application) {
            applicationInfo.application = application;
            var processType = application.type.name;
            var currentStage = application.stage;
            var nextState = processType + '.' + appConfig[processType].stages[currentStage].nextState;
            var nextStage = appConfig[processType].stages[currentStage].nextStage;
            var params = appConfig[processType].stages[currentStage].params;
            $state.go(nextState, {
                processType: processType,
                currentStage: nextStage,
                params: params
            });
        },
        //Fetches all the applications by the logged in user
        //If the application status is progress, then fetches it's progress
        //Sets the applications field on the controller object with the data
        //Invokes the callbacks with the data/error
        getApplications: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.fetchError = undefined;
                backendClient.getApplications()
                .then(function(response) {
                    controller.applications = response.data;
                    controller.applications.forEach(function(item, index, arr) {
                        if(item.status === 'PROGRESS') {
                            backendClient.getStatus(item.id).then(function(response) {
                                controller.applications[index].progress = response.data[0];
                                resolve(controller.applications);
                            });
                        }
                    });
                })
                .catch(function(response) {
                    controller.fetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        }
    };
};
