require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
server= require("http").createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
let usernames = [];

const mysql = require('mysql');
app.use(bodyParser.json());

//création d'une connection a la bdd
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME,
    password:process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME
});

app.use(express.static('public'))

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
})

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`le serveur écoute sur le port ${PORT}`);
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});

io.sockets.on("connection",(socket)=>{
    console.log("Socket connected...");
    // Send Message
    socket.on("send message",(data)=>{
        //round 2 add username
        io.sockets.emit('new message',{msg:data,user:socket.username});
        
        //On insere le message dans la bdd
         insertMsg(socket.username, data);
        console.log(data);
    });

    //round 2
    socket.on("new user",function (data,callback){
        if(usernames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
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

