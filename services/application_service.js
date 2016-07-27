module.exports = function($state, backendClient, authInfo, applicationInfo, appConfig) {
    return {
        createApplication: function(controller) {
            controller.createError = undefined;
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType][currentStage].nextState;
            var nextStage = appConfig[processType][currentStage].nextStage;
            var params = appConfig[processType][currentStage].params;
            backendClient.createApplication(processType)
            .then(function(response) {
                applicationInfo.application = response.data;
                $state.go(nextState, {
                    processType: processType,
                    currentStage: nextStage,
                    params: params
                });
            })
            .catch(function(response) {
                controller.createError = response.message;
            });
        },
        attachForm: function(controller, form) {
            controller.attachError = undefined;
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType][currentStage].nextState;
            var nextStage = appConfig[processType][currentStage].nextStage;
            var params = appConfig[processType][currentStage].params;
            backendClient.attachForm(applicationInfo.application.id, params.formType, form)
            .then(function(response) {
                backendClient.changeStage(applicationInfo.application.id, currentStage)
                .then(function(response) {
                    applicationInfo.application = response.data;
                    $state.go(nextState, {
                        processType: processType,
                        currentStage: nextStage,
                        params: params
                    });
                })
                .catch(function(response) {
                    controller.attachError = response.message;
                });
            })
            .catch(function(response) {
                controller.attachError = response.message;
            });
        },
        attachDocument: function(controller, file) {
            controller.attachError = undefined;
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType][currentStage].nextState;
            var nextStage = appConfig[processType][currentStage].nextStage;
            var params = appConfig[processType][currentStage].params;
            backendClient.attachDocument(applicationInfo.application.id, params.documentType, file)
            .then(function(response) {
                backendClient.changeStage(applicationInfo.application.id, currentStage)
                .then(function(response) {
                    applicationInfo.application = response.data;
                    $state.go(nextState, {
                        processType: processType,
                        currentStage: nextStage,
                        params: params
                    });
                })
                .catch(function(response) {
                    controller.attachError = response.message;
                });
            })
            .catch(function(response) {
                controller.attachError = response.message;
            });
        },
        skip: function(controller) {
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType][currentStage].nextState;
            var nextStage = appConfig[processType][currentStage].nextStage;
            var params = appConfig[processType][currentStage].params;
            $state.go(nextState, {
                processType: processType,
                currentStage: nextStage,
                params: params
            });
        },
        complete: function(controller) {
            this.completeError = undefined;
            backendClient.complete(applicationInfo.application.id)
            .then(function(response) {
                applicationInfo.application = response.data;
                $state.go('home');
            })
            .catch(function(response) {
                controller.completeError = response.message;
            });
        }
    };
};
