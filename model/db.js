var mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient
      , format = require('util').format;


exports.userCategories = function userCategories(fbuser, callback){
    if(!fbuser) return;
    Category.distinct("name", {"user": fbuser.facebookId}, function(err, categories){
        if (err) return handleError(err);
        callback(categories);
    });
}

exports.userRecordsForCategory = function(user, category, callback){
    Record.find({"user":user, "category":category}, function(err, results){
        if(err) return handleError(err)
        callback(results);
    });
}

exports.userCategoryFields = function(user, category, callback){
    Category.find({"user":user, "name":category}, {"fields":1, "_id":0}, function(err, results){
        if(err) return handleError(err)
        console.log("Category fields:" + results);
        callback(results);
    });
}

exports.userListData = function(user, list, callback){
    List.find({"user": user, "name":list} , function(err, results){
        if(err) return handleError(err)

        callback(results);
    });
}

exports.userRecordsForList = function(user, list, callback){
    fields = {"_id":1};
    for(var i=0; i <list[0].fields.length; i++){
        fields[list[0].fields[i]] = 1;
    }
    filters = list[0].filters;
    filters.user = user;

    console.log(fields);
    Record.find(filters, fields, function(err, results){
        if(err) return handleError(err)
        
        callback(results);
    });
};

exports.updateRecord = function(user, id, field, value, callback){
    console.log(user);
    var ObjectID = require("mongodb").ObjectID;
    MongoClient.connect("mongodb://localhost/coleta", function(err,db){
        if(err) throw(err);
        var Records = db.collection("records");

        param = {};
        param[field] = value;
        Records.update({ "_id" : ObjectID(id)},
                       {$set : param} ,
                       {upsert: false},
                       function(err){
            callback("OK");
       });
    });
    /* 
    Record.findOne({"_id":id}, function(err, record){
    console.log("The records is " + record);
    param = {};
    param[field] = value;
        record.update({$set: param}, {upsert:false}, function(err, result) {
            if (err) {
                console.log(err);
                return handleError(err);
            }
            record.markModified(field);
            console.log(record.modifiedPaths() );
            record.save();
            console.log("OK");
            callback("OK");
        });
    });
    */
}

var recordSchema = mongoose.Schema({
    object : mongoose.Schema.Types.Mixed
}, {collection: "records"});

var Record = mongoose.model("Record", recordSchema);

var listSchema = mongoose.Schema({
    name: String,
    user: String,
    public: Boolean,
    fields: Array,
    filters: Object
}, {collection: "lists"});

var List = mongoose.model("List", listSchema);

var categorySchema = mongoose.Schema({
    name: String,
    user: String,
    public: Boolean,
    fields: Array
}, {collection: "categories"});

var Category = mongoose.model("Category", categorySchema);

var userSchema = mongoose.Schema({
    facebookId: String,
    username: String
}, {collection: "users"});

var User = mongoose.model("User", userSchema);

var thingSchema = mongoose.Schema({
    name: String,
    category: String,
    contents: Array
}, {collection: "things"});

var Thing = mongoose.model("Thing", thingSchema);

mongoose.connect("mongodb://localhost/coleta");
