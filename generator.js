// ALONSO JR. 
// https://github.com/alonsojr1980

// MONGOOSE SCHEMA FOR EASY SEQUENCIAL ID GENERATION

// USAGE EXAMPLE:

/*
var Generator = require('../models/generator.js');
Generator.gen_id("quotation_" + quotation.sp_id, 1, function (err, seq) {
    if (!err) {
        quote.sp_sequence = seq;                  
        quote.save(function(error){
            if (!error) {
                callback(null, quote);
            } else {
                callback(error, null);
            }
        });
    } else {
        callback(err, null);
    }
});
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeneratorSchema = new Schema({
    name: String,
    sequence: Number
}, { collection: 'generators' });

GeneratorSchema.methods = {
    incrementAndSave: function (increment, callback) {
        var that = this;
        that.sequence += increment;
        that.save(function(err) {
            if (!err) {
                callback(null, that.sequence);
            } else {
                callback(err, null);
            }
        });
    }
};

GeneratorSchema.statics = {

    getOrCreateGenerator: function (name, initial, callback) {
        let startAt = initial || 0;

        var gen = this.findOne({name: name}, function(err, generator){
            if (!err) {
                if (!generator) {
                    var model = mongoose.model('Generator', GeneratorSchema);
                    generator = model({name: name, sequence: startAt});
                    generator.incrementAndSave(0, function(err2) {
                        callback(err2, generator);
                    });
                } else {
                    callback(null, generator);
                }
            } else {
                callback(err, null);
            }
        });
    },

    getGenerator: function (name, callback) {
        this.findOne({name: name}, callback);
    },

    //sequence name, quantity to increment, callback function
    gen_id: function (name, initial, increment, callback) {
        this.getOrCreateGenerator(name, initial, function(err, generator) {
            if (!err) {
                generator.incrementAndSave(increment, callback);
            } else {
                callback(err, null);
            }
        });
    },

    currentSequence: function(name, callback) {
        this.getGenerator(name, function(err, generator) {
            callback(err, (generator ? generator.sequence : null))
        });
    },

    gen_id_reset: function(name, initial, callback) {
        this.getOrCreateGenerator(name, initial, function(err, generator) {
            if (!err) {
                generator.sequence = initial;
                generator.incrementAndSave(0, callback);
            } else {
                callback(err, null);
            }
        });
    }

}

module.exports = mongoose.model('Generator', GeneratorSchema);