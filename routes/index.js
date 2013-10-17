
/*
 * GET home page.
 */
var users = require("../model/users");

exports.index = function(req, res){
  users.userlist(function(err, userlist){
      console.log(req.user);
      res.render('index', { 
        user: req.user,
        title: 'People are using Coleta!',
        pagetitle: 'Home | Coleta',
        users: userlist
      });
  });
};
