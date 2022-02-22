const { roles } = require('../data/data')

function canViewProject(user, project) {
  return (
    user.role === roles.ADMIN ||
    project.userId === user.id
  )
}

function scopedProjects(user, projects) {
  if (user.role === roles.ADMIN) return projects
  return projects.filter(project => project.userId === user.id)
}

function canDeleteProject(user, project) {
  return project.userId === user.id
}

module.exports = {
  canViewProject,
  scopedProjects,
  canDeleteProject
}