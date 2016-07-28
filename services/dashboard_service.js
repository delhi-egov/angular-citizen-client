module.exports = function($state, backendClient, authInfo, applicationInfo, appConfig) {
    return {
        //Takes the user to the starting page for the given process type
        //Picks the initial stage from the appConfig
        newApplication: function(controller, processType) {
            var nextState = processType + '.' + appConfig[processType].nextState;
            var nextStage = appConfig[processType].firstStage;
            $state.go(nextState, {
                processType: processType,
                currentStage: nextStage
            });
        },
        //Takes user to the page where he left off last time
        //Picks the processType and currentStage from application
        //Picks the nextState and nextStage from the appConfig
        resumeApplication: function(controller, application) {
            controller.fetchError = undefined;
            var processType = application.type.name;
            var currentStage = application.stage;
            var nextState = processType + '.' + appConfig[processType].stages[currentStage].nextState;
            var nextStage = appConfig[processType].stages[currentStage].nextStage;
            var params = appConfig[processType].stages[currentStage].params;
            backendClient.getForms(application.id)
            .then(function(response) {
                var forms = {};
                response.data.forEach(function(item, index, arr) {
                    forms[item.type] = JSON.parse(item.data);
                });
                backendClient.getDocuments(application.id)
                .then(function(response) {
                    var documents = {};
                    response.data.forEach(function(item, index, arr) {
                        documents[item.type] = item.path;
                    });
                    applicationInfo.application = application;
                    applicationInfo.forms = forms;
                    applicationInfo.documents = documents;
                    $state.go(nextState, {
                        processType: processType,
                        currentStage: nextStage
                    });
                })
                .catch(function(response) {
                    controller.fetchError = response.message;
                });
            })
            .catch(function(response) {
                controller.fetchError = response.message;
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
