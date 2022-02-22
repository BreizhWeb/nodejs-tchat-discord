const fakedata = require('./fakedata.js')
var getUserRooms = function (name) {
  return fakedata.users.find(v => v.name == name)?.chans.
    map(id => {
      return fakedata.servers.find(v => v.id == id)
    });
}
var updateUsernames = function (user, sockets) {
  user.chans.forEach(chan => {
    var theChan = fakedata.servers.find(s => s.id == chan.id);
    if (theChan.users.indexOf(user.name) == -1)
      theChan.users.push(user.name)
    sockets.emit(`usernames${theChan.id}`, theChan.users);
  })
}
var disconnect = function (user, sockets) {
  user.chans.forEach(chan => {
    let theChan = fakedata.servers.find(s => s.name == chan.name);
    if (theChan.users.indexOf(user.name) != -1)
      theChan.users.splice(theChan.users.indexOf(user.name), 1);
    sockets.emit(`usernames${theChan.id}`, theChan.users);
  })
}
module.exports = {
  getUserRooms: getUserRooms,
  updateUsernames: updateUsernames,
  disconnect: disconnect
}