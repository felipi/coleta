
/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('./model/db')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , passport = require("passport")
  , User = require("./model/users")
  , FacebookStrategy = require("passport-facebook").Strategy;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser("wololo buchogod"));
  app.use(express.session({secret: "wololo buchogod"}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

passport.serializeUser(function(user, done) {
      done(null, user);
});

passport.deserializeUser(function(obj, done) {
      done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: "264539680355004",
    clientSecret: "65e954139c393c082dc3dec1a81a1669",
    callbackURL: "http://localhost/auth/facebook/callback"
 },
 function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(profile, done,  function(err, user){
        if(err) {return done(err); }
        done(null, user);
    });
 }
));

app.get('/', routes.index);
app.get('/dashboard', routes.dashboard);
app.get('/users/:id/category/:category', routes.userCategory);
app.get('/users/:id/list/:list', routes.userList);
//app.get('/app/update/:id/:field/:value', routes.updateRecord);
app.post('/records/update', routes.updateRecord);
//app.get('/users', user.list);
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/facebook/callback",
        passport.authenticate("facebook", {successRedirect: "/dashboard",
                                            failureRedirect: "/login"} ));
app.get("/logout", function(req, res){ 
    req.logout();
    res.redirect("/");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
