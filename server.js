const express = require("express");
const app = express();
server= require("http").createServer(app);
const io = require('socket.io')(server);
let usernames = [];

app.use(express.static('public'))

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
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

const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };