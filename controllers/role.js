var mongoose = require('mongoose'),
    logger = require('ghiraldi-simple-logger');

// require('../models/User.js');
var Role = mongoose.model('Role');
var _ = require('underscore');

function get(id, fn) {
    Role.findById(id, fn);
}

var index = function(req, res){
    Role.find({}, function(err, users) {
        if (err) {
            logger.log('error', err);
            res.send(err);
        } else {
            // res.render('../views/index.jade', {users: users, title: 'Users', selected: 'users'});
            res.send(users);            
        }
    });
};

var add = function(req, res) {
    // res.render('../views/add.jade', {title: 'Add a User', selected: 'users'});
    res.send({'message': 'Add page for users. This should be overridden'});
};

var show = function(req, res, next){
    get(req.params.id, function(err, user){
        if (err) return next(err);
        // res.render('../views/show.jade', {user: user, title: 'User View', selected: 'users'});
        res.send(user);
    });
};

var edit = function(req, res, next){
    get(req.params.id, function(err, user) {
        if (err) return next(err);
        // res.render('../views/edit.jade', {user: user, title: 'Edit User', selected: 'users'});
        res.send({'message': 'Edit page for a user.  This should be overridden.'});
    });
};

var update = function(req, res, next){
    var id = req.params.id;
    get(id, function(err, role) {
        if (err) {
            req.session.messages = {'error': 'Unable to update: ' + err};
            return next(err);
        }
        var thisRole = req.body.role;
        _.extend(role, thisRole);
        role.save(function(error) {
            if (!error) {
                res.send({'success': 'Successfully updated role  ' + role.title});
            } else {
                res.send({'error': 'Unable to update: ' + error});
            }
        });
    }
    );
};

var create = function(req, res, next) {
        var thisRole = req.body.role;
        var addedRole = new Role();
        _.extend(addedRole, thisRole);
        addedRole.save(function(error) {
            if (!error) {
                req.session.messages = {'success': 'Successfully created new role  ' + addedRole.title};
            } else {
                req.session.messages = {'error': 'Unable to create: ' + error};
            }
        res.redirect('/users');
        });
}; 

var destroy =  function(req, res, next) {
    var id = req.params.id;
    get(id, function(err, role) {
        if (err) return next(err);
        if (role.title == 'admin') {
            req.session.messages = {'error': 'Unable to delete the root admin role'};
            return res.redirect('back');
        }
        var deleted = role;
        role.remove(function(err) {
            if (!err) {
                req.session.messages = {'success': 'Successfully deleted  ' + deleted.title};
                res.redirect('back');
            }
        });
    });
};

module.exports = {
  // /users
  routes: [
    {
        method: index,
        verb: 'get',
        route: '/role'
    },
    {
        method: show,
        verb: 'get',
        route: '/role/show/:id.:format?'
    },
    {
        method: add,
        verb: 'get',
        route: '/role/add'
    },
    {
        method: create,
        verb: 'post',
        route: '/role/create'
    },
    {
        method: edit,
        verb: 'get',
        route: '/role/edit/:id'
    },
    {
        method: update,
        verb: 'put',
        route: '/role/:id'
    },
    {
        method: destroy,
        verb: 'del',
        route: '/role/:id'
    }
  ]
};