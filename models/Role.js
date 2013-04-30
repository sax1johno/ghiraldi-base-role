var _ = require('underscore'),
    registry = new require('ghiraldi-schema-registry')(),
    logger = require('ghiraldi-simple-logger');

var Role = {
    title: String
}

/** 
 * This Role plugin also modifies the user schema.
 **/
var User = registry.getSchema('User');

User.relations = {};

/** Set up relationship between role and user. **/
User.relations.hasMany = {
    Role:   {
        as: 'roles',  
        foreignKey: 'roleId'
    }
};

module.exports = {
    'Role': Role,
    'User': User
};