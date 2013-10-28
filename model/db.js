var mongoose = require("mongoose");

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

var recordSchema = mongoose.Schema({
    ofMixed : mongoose.Schema.Types.Mixed
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
