const { roles } = require('../modules/data')

function verifierDroit(user, role, action) {
  if(user.role === roles.ADMIN){
    return true
  }
  else if(user.role === roles.USER){
    return true
  }
  else if(user.role === roles.NULL){
    return false
  }
}

function modifierDroit(user, role, room) {
  if (user.role === roles.ADMIN) return projects
  return projects.filter(project => project.userId === user.id)
}

module.exports = {
  verifierDroit,
  modifierDroit
}