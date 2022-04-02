require("dotenv").config();
const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
const multirooms = require('./modules/multirooms')

app.use(express.static('public')) // modifier ici pour passer de public à public 2



const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`le serveur écoute sur le port ${PORT}`);
});


io.sockets.on("connection", async (socket) => {

  multirooms.listen(io, socket);
})
