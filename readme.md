![alonso jr](https://img.shields.io/badge/Alonso%20Jr.-www.alonsojr.com.br-crimson.svg)

# @alonsojr1980/mongoose-generator
Plugin for generating sequential field values. It adds a `pre('save')` hook to the attached schema and some useful [static methods](#static-methods).


## Basic usage example

```javascript
const Generator = require('../index.js');
const mongoose = require('mongoose');                

const UserSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const nameOfTheGenerator = 'users';
UserSchema.plugin(Generator, nameOfTheGenerator);

const model = mongoose.model('User', UserSchema);
const user1 = model({name: "ALONSO"});
user1.save(() => {
    console.log(user1._id); //outputs 1
});
```
>> The following document will be added to a collection named **generators**:
**{"name": "users", "sequence": 1}**

## Default plugin options
```javascript
const pluginOptions = {
    collection: "generators", // name of the collection that'll hold generator docs
    name: undefined, // name of the doc in the generators' collection
    startAt: 100, // first sequence value, when the generator is created and saved or reseted with gen_id_reset()
    increment: 1, // increment of the generator
    field: "_id" // field of the model that'll receive the generator's sequence
}
```
## Custom options example

```javascript
const BusSchema = new mongoose.Schema({
    sequentialNumber: Number,
    licensePlate: String
});

const pluginOptions = {
    collection: "generators", 
    name: "buses",
    startAt: 100,
    increment: 1,
    field: "sequentialNumber"
}

BusSchema.plugin(Generator, pluginOptions);

const model = mongoose.model('Bus', BusSchema);
const bus1 = model({licensePlate: "BUS-7777"});

bus1.save(() => {
    console.log(bus1.sequentialNumber); //outputs 101
});
```
>> The following document will be added to a collection named **generators**:
**{"name": "buses", "sequence": 101}**

## Static methods added to the model <a id="static-methods"></a>
```javascript
// returns the current sequence value
currentSequence((err, sequence) => {});

// resets the sequence to the startAt value passed in the options object
// or to 0 (default value). Beware of existing documents with that sequence!
gen_id_reset((err, sequence) => {})
```
>> Remember that static methods are called in the model, not in the document instance.

## Static methods usage example
```javascript
const BusSchema = new mongoose.Schema({
    sequentialNumber: Number,
    licensePlate: String
});

const pluginOptions = {
    name: "buses",
    startAt: 0
}

BusSchema.plugin(Generator, pluginOptions);

const model = mongoose.model('Bus', BusSchema);
model.gen_id_reset((err, seq) => {
    console.log(seq); //outputs 0
});
```