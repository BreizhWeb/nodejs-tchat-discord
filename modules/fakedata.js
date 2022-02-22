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
  }, {
      id: 3,
      name: 'Agénor',
      chans: [0, 1]
  }, {
      id: 4,
      name: 'Julien',
      chans: [0, 1]
  }, {
      id: 5,
      name: 'Annaeg',
      chans: [0, 1]
  }, {
      id: 6,
      name: 'Gwen',
      chans: [0, 1]
  }, {
      id: 7,
      name: 'Artur',
      chans: [0, 1]
  }, {
      id: 8,
      name: 'Dorian',
      chans: [0, 1]
  }, {
      id: 9,
      name: 'Elouan',
      chans: [0, 1]
  }
];
module.exports = {
  servers: servers,
  users: users
}