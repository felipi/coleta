
/*
 * GET dashboard.
 */
var users = require("../model/users");

exports.dashboard = function(req, res){
  users.userlist(function(err, userlist){
      res.render('dashboard', { 
        user: req.user,
        title: 'This is your dashboard',
        pagetitle: 'Dashboard | Coleta'
      });
  });
};
