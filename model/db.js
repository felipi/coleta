var MongoClient = require('mongodb').MongoClient
      , format = require('util').format;
var ObjectID = require("mongodb").ObjectID;

exports.userCategories = function userCategories(fbuser, callback){
    if(!fbuser) return;
    MongoClient.connect("mongodb://localhost/coleta", function(err,db){
        var Categories = db.collection("categories");
        Categories.distinct("name", {"user": fbuser.facebookId}, function(err, categories){
            if (err) return handleError(err);
            db.close();
            callback(categories);
        });
    });
}

exports.userRecordsForCategory = function(user, category, callback){
    MongoClient.connect("mongodb://localhost/coleta", function(err,db){
        var Records = db.collection("records");
        Records.find({"user":user, "category":category}).toArray( function(err, results){
            if(err) return handleError(err)

            db.close();
            callback(results);
        });
    });
}

exports.userCategoryFields = function(user, category, callback){
    MongoClient.connect("mongodb://localhost/coleta", function(err,db){
        var Categories = db.collection("categories");
        Categories.find({"user":user, "name":category}, {"fields":1, "_id":0}).toArray( function(err, results){
            if(err) return handleError(err)
            console.log("Category fields:" + results);
            db.close();
            callback(results);
        });
    });
}

exports.userListData = function(user, list, callback){

    MongoClient.connect("mongodb://localhost/coleta", function(err,db){
        var Lists = db.collection("lists");
        Lists.find({"user": user, "name":list}).toArray(function(err, results){
            if(err) return handleError(err)

            db.close();
            callback(results);
        });
    });
}

exports.userRecordsForList = function(user, list, callback){
    fields = {"_id":1};
    for(var i=0; i <list[0].fields.length; i++){
        fields[list[0].fields[i]] = 1;
    }
    filters = list[0].filters;
    filters.user = user;

    MongoClient.connect("mongodb://localhost/coleta", function(err,db){
        var Records = db.collection("records");
        Records.find(filters, fields).toArray( function(err, results){
            if(err) return handleError(err)
            
            console.log(results);
            db.close();
            callback(results);
        });
    });
};

exports.updateRecord = function(user, id, field, value, callback){
    console.log(user);
    MongoClient.connect("mongodb://localhost/coleta", function(err,db){
        if(err) throw(err);
        var Records = db.collection("records");

        param = {};
        param[field] = value;
        Records.update({ "_id" : ObjectID(id)},
                       {$set : param} ,
                       {upsert: false},
                       function(err){
            db.close();
            callback("OK");
       });
    });
}
