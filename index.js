// Authors:
// Shane Oatman https://github.com/shoatman
// Sunil Bandla https://github.com/sunilbandla
// Daniel Dobalian https://github.com/danieldobalian

var express = require("express");
var morgan = require("morgan");
var passport = require("passport");
var BearerStrategy = require('passport-azure-ad').BearerStrategy;

// TODO: Update the first 3 variables
var tenantID = "wiseteam4.onmicrosoft.com";
var clientID = "ce2adf0b-1aa7-4f04-9761-d589d72fc2ce";
var policyName = "B2C_1_DbWiseSignUp";

var options = {
    identityMetadata: "https://login.microsoftonline.com/" + tenantID + "/v2.0/.well-known/openid-configuration/",
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: true,
    loggingLevel: 'info',
    passReqToCallback: false
};

var bearerStrategy = new BearerStrategy(options,
    function (token, done) {
        // Send user info using the second argument
        done(null, {}, token);
    }
);

var app = express();
app.use(morgan('dev'));

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/hello",
    passport.authenticate('oauth-bearer', {session: false}),
    function (req, res) {
        var claims = req.authInfo;
        console.log('User info: ', req.user);
        console.log('Validated claims: ', claims);
        
        if (claims['scp'].split(" ").indexOf("demo.read") >= 0) {
            // Service relies on the name claim.  
            res.status(200).json({'name': claims['name']});
        } else {
            console.log("Invalid Scope, 403");
            res.status(403).json({'error': 'insufficient_scope'}); 
        }
    }
);

app.get("/studygroup",
    function (req, res) {
   const user1 = {userid :"1",fname :"Amol", lname: "mekha"}
   const user2 = {userid :"2",fname :"Ram",lname: "k"}
   const user3 = {userid :"3",fname :"Jeremy",lname: "kim"}
   const user4 = {userid :"4",fname :"Gerardo",lname: "Machado"}
   const user5 = {userid :"5",fname :"Rabia",lname: "Shakoor"}
   const user6 = {userid :"6",fname :"Allen",lname: "McQuiston"}
   
   const userlist = [user1,user2,user3,user4,user5,user6]
   grouplist = ["Team4",userlist]
    res.json(grouplist)    
       
    }
);

const port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});
