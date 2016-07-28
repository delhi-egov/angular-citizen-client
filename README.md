## angular-citizen-client

This is a client which can be used to develop client side applications in angular. It takes care of communication with the backend and provides essential services which take care of user navigation based on the config provided.

The config looks as follows:

        {
            GeneralPassportApplication : {
                nextState: 'create',
                firstStage: 'NEW',
                stages: {
                    'NEW' : {
                        nextState: 'fillForm',
                        nextStage:'FORM_FILLED',
                        params: {}
                    },
                    'FORM_FILLED': {
                        nextState: 'complete',
                        nextStage: 'COMPLETE',
                        previousState: 'create',
                        previousStage: 'NEW'
                        params: {
                            formType: 'Form-I'
                        }
                    },
                    'COMPLETE': {
                            previousState: 'fillForm',
                            previousStage: 'FORM_FILLED',
                            params: {}
                    }
                }
            },
            TatkalPassportApplication : {
                nextState: 'create',
                firstStage: 'NEW',
                stages: {
                    'NEW' : {
                        nextState: 'fillForm',
                        nextStage:'FORM_FILLED',
                        params: {}
                    },
                    'FORM_FILLED': {
                        nextState: 'uploadId',
                        nextStage: 'UPLOADED_ID',
                        previousState: 'create',
                        previousStage: 'NEW'
                        params: {
                            formType: 'Form-I'
                        }
                    },
                    'UPLOADED_ID': {
                        nextState: 'complete',
                        nextStage: 'COMPLETE',
                        previousState: 'fillForm',
                        previousStage: 'FORM_FILLED',
                        params: {
                            documentType: 'Photo ID Proof'
                        }
                    },
                    'COMPLETE': {
                            previousState: 'uploadId',
                            previousStage: 'UPLOADED_ID',
                    }
                }
            }
        }

GeneralPassportApplication and TatkalPassportApplication must be the names of the ApplicationType on the backend. They must also be the name of the parent states for ui-router. These parent states would have child states mentioned in nextState param in the config.

The first stage is always named NEW and last is always named COMPLETE.
