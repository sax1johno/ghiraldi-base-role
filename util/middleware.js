var schemas = new require('ghiraldi-schema-registry')(),
    Role = schemas.getModel('Role');

var _ = require('underscore')

function restrictToAdmin(req, res, next) {
    if (req.session.user !== null && req.session.user !== undefined) {
        Role.findById(req.session.user.role, function(err, myRole) {
           if (myRole.title != 'admin') {
                req.flash('error', 'Not authorized for this action');
                res.redirect('/');
           } else {
              next();
           }
        });
    }  else {
            // req.flash('error', 'You are not logged in');
            res.redirect('/');
        }
};

function restrictToRoles(roles) {
    return function(req, res, next) {
        if (req.session.user !== null && req.session.user !== undefined) {
            var authorized = false;
            var index = roles.length;
            roles.forEach(function(err, role) {
                console.log('this role = ' + roles[role]);
                console.log("req role = " + req.session.role.title);
                if (req.session.role.title == roles[role]) {
                    authorized = true;
                }
                index--;
                if (index <= 0) {
                    if (authorized) {
                        next();
                    } else {
                        req.flash('error', "You don't have permission to access this resource");
                        res.redirect('/');
                    }
                }
            });
        } else {
            // req.flash('error', 'You are not logged in');
            res.redirect('/');
        }
    };
}

module.exports = {
    restrictToRoles: restrictToRoles,
    restrictToAdmin: restrictToAdmin,
};

