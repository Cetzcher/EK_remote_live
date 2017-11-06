var express = require('express');
var router = express.Router();
var auth = require("../core/auth");
var user = require("../core/user");
var chat = require("../core/chat");

function get_token(request){
    return request.body.token; // change this later
}

router.post('/authenticate', function (req, res) {
    // authenticate the user, give him a token or reply with an error.
    // on success: {success: true, token: token}
    // on error: {success: false, error: err_msg}
    auth.auth(req.body, function(result){
        res.send(result);
    });
});

router.get("/test", function(req, res){
    res.send("test");
});

// get all users.
router.get('/users', function (req, res) {
    console.log("fetching users");
    user.get_all(function(names){
        res.json({user_names: names});
    });
});

// register the user, expects a username, password and email, the password must be encrypted already.
// on success return a JSON object {success: true, error: ""}
 // on error return a JSON object {success: false, error: err_msg}
router.post('/register', function(req, res){

    user.create_user(req.body, function(result){
            return res.json(result);
        });
});

router.delete("/delete/:token", function(req, res)
{
    // delete the user.
});

var current_token = null;
// require authetication for all /auth/*
// authenticate the user, if the user is not authenticated, respond with forbidden.
router.all("/auth/*", function(req, res, next){
    current_token = get_token(req);
    console.log("authenticating with: " + current_token);
    if(auth.is_auth(current_token))
    {
        // token is valid, proceed
        next();
        return;
    }
    // if token is invaild return forbidden
    res.status(403);
    res.send("Forbidden");

});

/*
    =========================================
    THIS PART IS FOR CREATING THE GROUP CHAT
    =========================================
*/

router.ws('/echo', function(ws, req) {
    // check if this is the first req from client
    // authenticate the token
    // if the token is valid enable communication, otherwise deny msgs

    //console.log(req);
    console.log('connecting to socket');
    // console.log(req.headers);

    var tok = req.headers.token;
    var user = auth.is_auth(tok);
    var group = chat;
    var is_mem = group.is_member(user);

    if(!is_mem){
        group.add_user(user, ws);
        ws.send("You are now connected to the chat!");
    }

    ws.on('message', function(msg) {
        console.log(msg + "recieved from: " + user);
        group.send(user, msg);
    });

    ws.on("close", function () {
        console.log("removing user from WS");
        group.remove(user);
    });


    console.log('socket', req.testing);
});

/*
    =========================================
    =========================================
*/

// log out the user, destroy token.
router.post("/auth/logout", function(req, res){
    auth.remove(current_token);
    res.send("logged out");
});


module.exports = router;
