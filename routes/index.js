const userRoutes = require("./users");
const roomRoutes = require("./rooms");
const messageRoutes = require("./messages");

module.exports = function ({ app, con }) {

    userRoutes({ app, con });
    roomRoutes({ app, con });
    messageRoutes({ app, con });
    
  };