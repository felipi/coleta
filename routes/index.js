
/*
 * GET home page.
 */
var users = require("../model/users");
var db = require("../model/db");

//INDEX
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

//DASHBOARD
exports.dashboard = function(req, res){
    cat = [];
    db.userCategories(req.user, function(arr){
        console.log(arr);
        cat = arr;

      res.render('dashboard', { 
        user: req.user,
        title: 'This is your dashboard',
        pagetitle: 'Dashboard | Coleta',
        categories: arr 
      });
    });

};

//CATEGORY
exports.userCategory = function(req, res) {
    user = req.params.id;
    category = req.params.category;

   users.userExists(user, function(exists){
       if (exists){
            console.log("This user exists");
            db.userCategoryFields(user, category, function(fields){
                db.userRecordsForCategory(user, category, function(records){
                    res.render('category', {
                        user: req.user,
                        title: 'Category',
                        pagetitle: 'Category | Coleta',
                        name: category,
                        fields: fields[0].fields,
                        records: records
                    });
                });
            }); 
       }else{
            console.log("This user does not exist");
       }
   });
}


//LIST
exports.userList = function(req, res) {
    user = req.params.id;
    list = req.params.list;

   users.userExists(user, function(exists){
       if (exists){
            console.log("This user exists");
            db.userListData(user, list, function(data){
                if(data.length <= 0) {
                    //No List Exists
                }
                db.userRecordsForList(user, data, function(records){
                    res.render('category', {
                        user: req.user,
                        title: 'List',
                        pagetitle: 'List | Coleta',
                        name: data[0].name,
                        fields: data[0].fields,
                        records: records
                    });
                });
            }); 
       }else{
            console.log("This user does not exist");
       }
   });
}

//UPDATE RECORD
exports.updateRecord = function(req, res) {
    user = req.user;
    recordId = req.body.id;
    recordField = req.body.field;
    newValue = req.body.value;

    console.log(recordId);
    db.updateRecord(user, recordId, recordField, newValue, function(results){
       res.send(results); 
    });
}
