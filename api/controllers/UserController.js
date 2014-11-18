/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

function updateUser(id, user, res){
    User.update(id, user, function(err, user){
        res.json(user);
    });
}

module.exports = {
    update: function(req,res) {
        User.findOne(req.user.id).exec(function(err, user){
            if(err)
                return res.negotiate(err);
            else {
                if(req.body.oldPwd === undefined)
                    res.json({"error": "Parameter missing: oldPwd"}, 400);
                else
                    bcrypt.compare(req.body.oldPwd, req.user.hashedPassword, function (err, match){
                        if(err) return res.negotiate(err);
                        if(match) {
                            var newUser = {};
                            if(req.body.name)
                                newUser.name = req.body.name;
                            if(req.body.email)
                                newUser.email = req.body.email;
                            if(req.body.phone)
                                newUser.phone = req.body.phone;
                            if(req.body.fbId)
                                newUser.fbId = req.body.fbId;
                            if(req.body.newPwd)
                                bcrypt.hash(req.body.newPwd, 10, function(err, hash) {
                                    newUser.hashedPassword = hash;
                                    updateUser(req.user.id, newUser, res);
                                });
                            else
                                updateUser(req.user.id, newUser, res);

                        }
                        else
                            res.json({"error": "Wrong password"}, 403);
                    });
            }
        });
    }
};



