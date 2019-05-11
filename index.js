const Generator = require('./generator.js');
var mongoose = require('mongoose');
// var MongooseSchema = mongoose.MongooseSchema;


function MongooseGeneratorPlugin (schema, options) {

    /**
     * Default options for the plugin
     */
    let pluginOptions = {
        collection: "generators",
        name: undefined,
        startAt: 0,
        increment: 1,
        field: "_id"
    }

    if (typeof options == "string") {
        pluginOptions.name = options;
    } else {
        Object.assign(pluginOptions, options);
    }

    if (!pluginOptions.name) {
        throw `
            mongoose-generator plugin needs options object with properties "field" and "name" 
            or just string with generator name!
        `
    }

    schema.add({[pluginOptions.field]: Number});
    Generator.collection.name = pluginOptions.collection;

    schema.pre('save', function(next) {
        Generator.gen_id(pluginOptions.name, pluginOptions.startAt, pluginOptions.increment, (err, seq) => {
            if (!err && seq) {
                this[pluginOptions.field] = seq;
                next();
            } else {
                throw new Error(err);
            }
        });
    });

    // returns the current sequence value
    schema.statics.currentSequence = function(callback) {
        Generator.currentSequence(pluginOptions.name, callback);
    };

    // resets the sequence to the startAt value passed in the options object
    // or to 0 (default value). Beware of existing documents with that sequence!
    schema.statics.gen_id_reset = function(callback) {
        Generator.gen_id_reset(pluginOptions.name, pluginOptions.startAt, callback);
    }; 

}

module.exports = MongooseGeneratorPlugin;