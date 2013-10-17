var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    facebookId: String,
    username: String
}, {collection: "users"});

var User = mongoose.model("User", userSchema);

var categorySchema = mongoose.Schema({
    kind: String,
    references: Array
}, {collection: "categories"});

var Category = mongoose.model("Category", categorySchema);

var thingSchema = mongoose.Schema({
    name: String,
    category: String,
    contents: Array
}, {collection: "things"});

var Thing = mongoose.model("Thing", thingSchema);

mongoose.connect("mongodb://localhost/coleta");
