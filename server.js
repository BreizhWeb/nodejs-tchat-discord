const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
//const fs = require('fs');
let servers = [
    {
        id: 0,
        private: false,
        name: 'MDS',
        users: [],
        img: 'https://www.mydigitalschool.com/themes/custom/mds/img/logo.png'
    },
    {
        id: 1,
        private: true,
        name: 'Privé',
        users: [],
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
            user: socket.user.name
        });
        console.log(data);
    });

    //round 2
    socket.on("new user", function (data, callback) {
        // If user dont exist
        if (!users.find(v => v.name == data)) {
            callback(false);
        } else {
            let userchans = users.find(v => v.name == data)?.chans.
                map(id => {
                    return servers.find(v => v.id == id)
                });
            socket.user = {
                name: data,
                chans: userchans
            };
            callback(socket.user);
            updateUsernames(socket.user);
        }
    });

    //Update Usernames
    function updateUsernames(user) {
        user.chans.forEach(chan => {
            let theChan = servers.find(s => s.id == chan.id);
            if (theChan.users.indexOf(user.name) == -1)
                theChan.users.push(user.name)
            io.sockets.emit(`usernames${theChan.id}`, theChan.users);
        })
    }
    function disconnect(user) {
        user.chans.forEach(chan => {
            let theChan = servers.find(s => s.name == chan.name);
            if (theChan.users.indexOf(user.name) != -1)
                theChan.users.splice(theChan.users.indexOf(user.name),1);
            io.sockets.emit(`usernames${theChan.id}`, theChan.users);
        })
    }

    //Disconnect
    socket.on("disconnect", function (data) {
        if (!socket.user?.name) {
            return;
        }
        console.log("disconnect event");
        disconnect(socket.user);
    });


})

