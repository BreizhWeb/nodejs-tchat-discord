const express = require("express");
const app = express();
server= require("http").createServer(app);
const io = require('socket.io')(server);
const crypto = require('crypto');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const { encrypt, decrypt } = require('./crypto');
let usernames = [];

app.use(express.urlencoded({ extended:false }));

app.use(express.static('public'))

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/register",(req,res)=>{
    if (req.body.username == "existe") {
        res.json({error:"true"});
    } else {
        res.json({username:req.body.username,error:"false"});
    }
    //res.send(req.body);
    //res.sendFile(__dirname + "/public/index.html");
})

app.post("/login",(req,res)=>{
    if (req.body.username == "existe" && req.body.password == "azertyuiop") {
        var token = req.body.username+"#####"+req.body.password+"#####"+Date.now().toString()+"#####17cm";
        hToken = encrypt(token);
        console.log(hToken.content);
        res.cookie("tokenIv",hToken.iv,{maxAge: 600000});
        res.cookie("tokenContent",hToken.content,{maxAge: 600000});
        res.json({error:"false"});
    } else {
        res.json({error:"true"});
    }
    const md5sum = crypto.createHash('md5');
    var password = md5sum.update(req.body.password).digest('hex');
    /*
    mettre le token dans le cookie
    lors du click sur un lien vérifier dans le cookie que le token soit bon (grace a jwt) ou que le hash du mdp dans le cookie corresponde à la bdd
    puis renvoyer la page
    */
    //res.sendFile(__dirname + "/public/index.html");
})

app.post("/verifToken",(req,res)=>{
    if (req.body.tokenIv!=undefined && req.body.tokenContent!=undefined) {
        var hash = {iv:req.body.tokenIv,content:req.body.tokenContent};
        var tokenSplit = decrypt(hash).split("#####");
        if (tokenSplit[0]=="existe" && tokenSplit[1]=="azertyuiop" && parseInt(tokenSplit[2])+600000>=Date.now() && tokenSplit[3]=="17cm") {
            res.json({error:"false"});
        } else {
            res.json({error:"true"});
        }
    } else {
        res.json({error:"true"});
    }
})



const PORT = 3000;
server.listen(PORT, () => {
    console.log('le serveur ecoute sur le port %d', PORT);
});

io.sockets.on("connection",(socket)=>{
    console.log("Socket connected...");
    // Send Message
    socket.on("send message",(data)=>{
        //round 2 add username
        io.sockets.emit('new message',{msg:data,user:socket.username});
        console.log(data);
    });

    //round 2
    socket.on("registration",function (data,callback){
        console.log(data);
        /*if(usernames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }*/
    });

    //Update Usernames
    function updateUsernames(){
        io.sockets.emit("usernames",usernames);
    }

    //Disconnect
    socket.on("disconnect",function(data){
        console.log("disconnect event");
       if (!socket.username){
           return;
       }
       usernames.splice(usernames.indexOf(socket.username),1);
       updateUsernames();
    });


})

