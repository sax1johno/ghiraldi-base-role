var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    registry = require('mongoose-schema-registry'),
    _ = require('underscore'),
    logger = require('ghiraldi-simple-logger');

var Role = registry.getSchema('Role');

Role.add({
    title    : String
});

/** 
 * This Role plugin also modifies the user schema.
 **/
var User = registry.getSchema('User');

User.add({role : {type: ObjectId, ref: 'Role'}});

registry.add('User', User);

module.exports = {
    'Role': Role,
    'User': User
};