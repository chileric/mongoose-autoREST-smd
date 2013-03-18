# mongoose-autoREST-smd

## Overview
Mongoose-autoREST-smd is based off of [mongoose-autoREST](https://github.com/moonsspoon/mongoose-autoREST) by moonspoon.  It auto creates basic REST APIs for mongoose models that are generated from SMD files.

## Installation / Configuration
MongoDB must be installed and running before starting mongoose-autoREST-smd.  Default configuration settings can be modified in the config.js file.  To install and run mongoose-autoREST-smd, run the following commands:
````
npm install
npm start
````

## Usage

#### ExampleService.js
```javascript
define({
    "id": "Schema/SimpleTestBaseServiceSchema",
    "SMDVersion": "2.0",
    "$schema": "http://json-schema.org/draft-03/schema",
    "transport": "REST",
    "envelope": "PATH",
    "description": "Test Service Methods.",
    "contentType": "application/json",
    "target": "/exampleModels",
    "services": {
        "getModel": {
            "transport": "GET",
            "description": "get a Model.",
            "payload": "",
            "returns": {
                "$ref": "models/ExampleModel"
            }
        }
    }
});
```

#### ExampleModel.js
````javascript
define({
    "id": "schema/models/ExampleModel",
    "description": "A simple model for testing",
    "$schema": "http://json-schema.org/draft-03/schema",
    "type": "object",
    "properties": {
        "modelNumber": {
            "type": "string",
            "description": "The number of the model.",
            "required": true
        }
    }
});
````
Running mongoose-autoREST-smd with the two SMD files defined above, would auto create the following REST APIs:

```
GET   	/exampleModels
GET   	/exampleModels/:id
POST  	/exampleModels/:id
PUT   	/exampleModels/:id
DELETE	/exampleModels/:id 
```
