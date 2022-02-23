const { roles } = require('../modules/data')

function verifierDroit(user, role, room) {
  return (
    user.role === roles.ADMIN ||
    project.userId === user.id
  )
}

function modifierDroit(user, role, room) {
  if (user.role === roles.ADMIN) return projects
  return projects.filter(project => project.userId === user.id)
}

module.exports = {
  verifierDroit,
  modifierDroit
}