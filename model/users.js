var mongoose = require("mongoose");

exports.findOrCreate = function findOrCreate(profile, done,  callback){
    var User = mongoose.model("User");

    User.find({"facebookId":profile.id}, function(err, user){

        if(user.length > 0){
            console.log(user);
            callback("", user[0]);
            done(null, user[0]);
        } else {
            var newUser = new User();
            console.log(profile.name);
            newUser.facebookId = profile.id;
            newUser.username = profile.name.givenName + " " + profile.name.familyName;
            newUser.save(function(err){
                if(err){ console.log(err); }
                else {
                    callback("", user);
                    done(null, newUser);
                }
            });
        }
    });
}

exports.userlist = function userlist(callback){
    var User = mongoose.model("User");

    User.find({}, function(err, users){
        if(err) console.log(err);
        else {
            callback("",users);
        }
    });
}
