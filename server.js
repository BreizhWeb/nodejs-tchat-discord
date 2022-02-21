const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
//const fs = require('fs');
let usernames = [];
let servers = [
    {
        id: 0,
        private: false,
        name: 'MDS',
        img: 'https://www.mydigitalschool.com/themes/custom/mds/img/logo.png'
    },
    {
        id: 1,
        private: true,
        name: 'Privé',
        img: 'https://www.psdstamps.com/wp-content/uploads/2020/04/private-stamp-png.png'
    },
];
let users = [
    {
        id: 0,
        name: 'Ronan',
        chans: [0, 1]
    }, {
        id: 1,
        name: 'Thomas',
        chans: [0]
    }, {
        id: 2,
        name: 'Nicolas',
        chans: [1]
    },
];

app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

const PORT = 3000;
server.listen(PORT, () => {
    console.log('le serveur ecoute sur le port %d', PORT);
});

io.sockets.on("connection", (socket) => {
    console.log("Socket connected...");
    // Send Message
    socket.on("send message", (data) => {
        //round 2 add username
        io.sockets.emit('new message', {
            msg: data.msg,
            chan: data.chan,
            user: socket.username
        });
        console.log(data);
    });

    //round 2
    socket.on("new user", function (data, callback) {
        if (usernames.indexOf(data) != -1) {
            callback(false);
        } else {
            socket.username = data;
            let chans = users.find(v => v.name == data).chans.
                map(id => servers.find(v => v.id == id));
            callback({
                user: socket.username,
                chans: chans
            });
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    //Update Usernames
    function updateUsernames() {
        io.sockets.emit("usernames", usernames);
    }

    //Disconnect
    socket.on("disconnect", function (data) {
        console.log("disconnect event");
        if (!socket.username) {
            return;
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    });


})

