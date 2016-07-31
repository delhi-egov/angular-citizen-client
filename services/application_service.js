module.exports = function($state, backendClient, authInfo, applicationInfo, appConfig) {
    return {
        createApplication: function(controller) {
            controller.createError = undefined;
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType].stages[currentStage].nextState;
            var nextStage = appConfig[processType].stages[currentStage].nextStage;
            var params = appConfig[processType].stages[currentStage].params;
            backendClient.createApplication(processType)
            .then(function(response) {
                applicationInfo.application = response.data;
                applicationInfo.forms = {};
                applicationInfo.documents = {};
                $state.go(nextState, {
                    processType: processType,
                    currentStage: nextStage
                });
            },function(response) {
                controller.createError = response.message;
            });
        },
        attachForm: function(controller) {
            controller.attachError = undefined;
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType].stages[currentStage].nextState;
            var nextStage = appConfig[processType].stages[currentStage].nextStage;
            var params = appConfig[processType].stages[currentStage].params;
            backendClient.attachForm(applicationInfo.application.id, params.formType, controller.form)
            .then(function(response) {
                backendClient.changeStage(applicationInfo.application.id, currentStage)
                .then(function(response) {
                    applicationInfo.application = response.data;
                    $state.go(nextState, {
                        processType: processType,
                        currentStage: nextStage
                    });
                },function(response) {
                    controller.attachError = response.message;
                });
            },function(response) {
                controller.attachError = response.message;
            });
        },
        attachDocument: function(controller) {
            controller.attachError = undefined;
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType].stages[currentStage].nextState;
            var nextStage = appConfig[processType].stages[currentStage].nextStage;
            var params = appConfig[processType].stages[currentStage].params;
            backendClient.attachDocument(applicationInfo.application.id, params.documentType, controller.file)
            .then(function(response) {
                backendClient.changeStage(applicationInfo.application.id, currentStage)
                .then(function(response) {
                    applicationInfo.application = response.data;
                    applicationInfo.documents[params.documentType] = controller.file.name;
                    $state.go(nextState, {
                        processType: processType,
                        currentStage: nextStage
                    });
                },function(response) {
                    controller.attachError = response.message;
                });
            },function(response) {
                controller.attachError = response.message;
            });
        },
        skip: function(controller) {
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var nextState = processType + '.' + appConfig[processType].stages[currentStage].nextState;
            var nextStage = appConfig[processType].stages[currentStage].nextStage;
            var params = appConfig[processType].stages[currentStage].params;
            $state.go(nextState, {
                processType: processType,
                currentStage: nextStage
            });
        },
        back: function(controller) {
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var previousState = processType + '.' + appConfig[processType].stages[currentStage].previousState;
            var previousStage = appConfig[processType].stages[currentStage].previousStage;
            var params = appConfig[processType].stages[currentStage].params;
            if(previousStage !== 'NEW') {
                $state.go(previousState, {
                    processType: processType,
                    currentStage: previousStage
                });
            }
        },
        complete: function(controller) {
            this.completeError = undefined;
            backendClient.complete(applicationInfo.application.id)
            .then(function(response) {
                applicationInfo.application = undefined;
                applicationInfo.forms = undefined;
                applicationInfo.documents = undefined;
                $state.go('home');
            },function(response) {
                controller.completeError = response.message;
            });
        },
        initFormController: function(controller) {
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var params = appConfig[processType].stages[currentStage].params;
            if(!applicationInfo.forms) {
                applicationInfo.forms = {};
            }
            if(!applicationInfo.forms[params.formType]) {
                applicationInfo.forms[params.formType] = {};
            }
            controller.form = applicationInfo.forms[params.formType];
        },
        initDocumentController: function(controller) {
            var processType = $state.params.processType;
            var currentStage = $state.params.currentStage;
            var params = appConfig[processType].stages[currentStage].params;
            if(!applicationInfo.documents) {
                applicationInfo.documents = {};
            }
            controller.existingDocument = applicationInfo.documents[params.documentType];
        }
    };
};
