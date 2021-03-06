/**
 * A Node.js rest server implementation.
 */
var config = require('./config'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    router = require('./router'),
    generator = require('mongoose-gen'),
    fs = require('fs'),
    requirejs = require('requirejs'),
    servicesDirFullPath = __dirname + '/' + config.servicesDir;

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

var ZypSMDReader = requirejs('node_modules/circuits-js/src/main/ZypSMDReader'),
    mongooseConnection = mongoose.connect('mongodb://' + config.mongoHost + '/' + config.mongoDatabase);

// Resolver for ZypSMDReader.
var smdResolver = function (smd) {
    return requirejs(config.servicesDir.substr(0, config.servicesDir.lastIndexOf('/'))  + '/' + smd);
}

generator.setConnection(mongooseConnection);

// Generate Mongoose schema for each SMD file in 'services' directory
fs.readdir(servicesDirFullPath, function(err, files) {
    files.filter(function(file) { return file.substr(-3) == '.js'; })
        .forEach(function(file) { fs.readFile(servicesDirFullPath + '/' + file, 'UTF-8', function(err, data) {
            if (err) throw err;
            var smd = requirejs(config.servicesDir + '/' + file.split('.')[0]),
                reader = newReader(smd),
                methodNames = reader.getMethodNames();
            for (var i = 0; i < methodNames.length; i++) {
                var methodName = methodNames[i],
                    responseSchema = reader.getResponseSchema(methodName),
                    modelName = responseSchema.id.split('/').pop(),
                    serviceUrl = reader.getServiceUrl(methodName),
                    collectionName = serviceUrl.split('/').pop();

                try {
                    generator.schema(modelName, responseSchema.properties);
                    router(modelName, collectionName, true, app, [express.bodyParser()]);
                } catch (exception) {
                    throw exception;
                }
            }
        })
    })
});

/**
 * Retrieves a reader capable of handling the passed service descriptor.
 *
 * @param {Object} smd - the service descriptor to retrieve a reader for.
 */
function newReader(smd) {
    // zyp format by default.
    var ret = new ZypSMDReader(smd, smdResolver);
    if (!smd.SMDVersion) {
        //not zyp then fail.
        throw new InvalidArgErr();
    }
    return ret;
}

app.listen(config.port);