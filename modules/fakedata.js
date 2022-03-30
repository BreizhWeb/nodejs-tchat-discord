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
  }, {
    id: 1,
    name: 'Thomas',
  }, {
    id: 2,
    name: 'Nicolas',
  }, {
    id: 3,
    name: 'Agénor',
  }, {
    id: 4,
    name: 'Julien',
  }, {
    id: 5,
    name: 'Annaeg',
  }, {
    id: 6,
    name: 'Gwen',
  }, {
    id: 7,
    name: 'Artur',
  }, {
    id: 8,
    name: 'Dorian',
  }, {
    id: 9,
    name: 'Elouan',
  }
];
let roles = [
  {
    id: 0,
    name: 'Admin',
  }, {
    id: 1,
    name: 'User',
  },

];
let access = [
  {
    id_user: 0,
    id_room: 0,
    id_role: 0,
  },
  {
    id_user: 0,
    id_room: 1,
    id_role: 1,
  },
  {
    id_user: 1,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 2,
    id_room: 1,
    id_role: 1,
  },
  {
    id_user: 3,
    id_room: 1,
    id_role: 0,
  },
  {
    id_user: 3,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 4,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 4,
    id_room: 1,
    id_role: 1,
  },
  {
    id_user: 5,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 5,
    id_room: 1,
    id_role: 1,
  },
  {
    id_user: 6,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 6,
    id_room: 1,
    id_role: 1,
  },
  {
    id_user: 7,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 7,
    id_room: 1,
    id_role: 1,
  },
  {
    id_user: 8,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 8,
    id_room: 1,
    id_role: 1,
  },
  {
    id_user: 9,
    id_room: 0,
    id_role: 1,
  },
  {
    id_user: 9,
    id_room: 1,
    id_role: 1,
  },
]
module.exports = {
  servers: servers,
  users: users,
  roles: roles,
  access: access

}
