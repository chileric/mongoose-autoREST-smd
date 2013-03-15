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