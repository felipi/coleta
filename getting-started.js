var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback(){

    console.log("Connection opened.");
    var Dog = mongoose.model("Dog", dogSchema);
    
    /*
    ozzy = new Dog({ name: "Ozzy", race: "Sausage"});
    ammy = new Dog({ name: "Amy", race: "Wolfie"});
    ozzy.save(function(err, self){ console.log(self); });
    ammy.save();
    */
    Dog.find(function(err, objects) {
        console.log(objects);  
    });

    User.find(function(err, objects) {
        console.log(objects);
    });
});

var dogSchema = mongoose.Schema({
    name: String,
    race: String
});

var userSchema = mongoose.Schema({
    email: String,
    name: String
});

userSchema.plugin(require('basic-auth-mongoose'));
var User = mongoose.model("User", userSchema);
