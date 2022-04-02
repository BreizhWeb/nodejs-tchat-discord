var deleteMessage, deleteRoom, privateMessage, switchRoom, deleteUser, joinRoom, test;
$(document).ready(() => {
  var socket = io.connect();

  /**
   * Debug
   */
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  /**
   * Recoi la liste des utilisateurs
   * (debug puisque plus obligatoire)
   */
  socket.emit("userlist", 1, (data) => {
    $('.utilisateurs').append(JSON.stringify(data));
  });

  /**
   * Recoi l'event de connexion du socket
   * TODO : a changer avec l'ajout du login
   */
  socket.on("connection", () => {
    $("#usernameForm").submit((e) => {
      e.preventDefault()
      let pseudo = $("#username").val()
      if (pseudo) {
        socket.emit("new user", pseudo, (data) => {
          data ? buildRooms(data) : $("#error").html("Username is wrong")
        })
      }
      $("#username").val("")
    })
  })

  /**
   * Escape HTML to text string
   * @returns 
   */
  function convertToPlain(html) {
    // Create a new div element
    var tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  /**
   * Envoi un message à la room_id dont le contenu est l'input.message de cette room
   * récup un callback qui vide l'input.message
   * @param room_id 
   */
  function sendMsg(room_id) {
    socket.emit("send message", {
      content: $(`#room-${room_id} input.message`).val(),
      room_id: room_id
    },
      () => {
        $(`#room-${room_id} input.message`).val('')
      }
    );
  }

  /**
   * Envoi au serveur un event contenant un user_id a renvoyer de la room_id
   */
  deleteUser = (deleted_user_id, room_id) => {
    socket.emit("delete user", { deleted_user_id, room_id });
  }

  /**
   * Envoi au serveur un event contenant un message_id a renvoyer de la room_id
   */
  deleteMessage = (msg_id, room_id) => {
    socket.emit("delete message", { msg_id, room_id });
  }

  /**
   * Recoi un message_id a delete sur le front
   */
  socket.on("delete message", (msg_id) => {
    $(`#msg-${msg_id}`).html(`
      <em>Message effacé</em>
    `)
  })

  /**
   * Créer un message sur l'interface
   * @param room_id * la room où le message doit être publié
   * @param msg_id  * l'id du message
   * @param content * le contenu du message
   * @param user_id * l'id de l'auteur
   * @param pseudo  * le pseudo de l'auteur
   */
  function createMessage(room_id, msg_id, content, user_id, pseudo) {
    $(`#room-${room_id} .chatWindow`).append(`
      <div class='message' id="msg-${msg_id}">
        <strong class="pseudo" onClick="privateMessage(${user_id},'${pseudo}')">${convertToPlain(pseudo)}</strong>: 
        <span class="content">${convertToPlain(content)}</span>
        <i onClick="deleteMessage(${msg_id},${room_id})">❌</i>
      </div>
    `)
  }

  /**
   * Recoi un event new message contenant un objet :
   * @param room_id * la room où le message doit être publié
   * @param msg_id  * l'id du message
   * @param content * le contenu du message
   * @param user_id * l'id de l'auteur
   * @param pseudo  * le pseudo de l'auteur
   */
  socket.on("new message", ({room_id, msg_id, content, user_id, pseudo}) => {
    createMessage(room_id, msg_id, content, user_id, pseudo)
  })

  /**
   * Lance la création d'une room pour l'user ciblé
   */
  privateMessage = (target_user_id, target_user_name) => {
    createRoom(target_user_name, '', true, target_user_id)
    // TODO check si la room est déjà là
    // if ($(`#mp-${target_user_id}`).length)
    //   switchRoom(target_user_id, true)
    // else
  }

  /**
   * Affiche la modal avec le contenu en parametre
   * @param html 
   */
  function showModal(html) {
    $('#modal').addClass('show')
    $('#modal .modalcontent').html(html)
    $("#modal .close").on("click", () => hideModal())
  }

  /**
   * Cache la modal et vide son contenu
   */
  function hideModal() {
    $('#modal').removeClass('show')
    $('#modal .modalcontent').html('')
  }

  /**
   * Emet un event au server pour créer une room avec callback pour refresh l'ui
   * @param name 
   * @param image 
   * @param private 
   * @param mp * bool si c'est la création d'une room de message privé
   */
  function createRoom(name = null, image = null, private = null, mp = false) {
    socket.emit("create room", {
      name: name ?? $('input[name=name]').val(),
      image: image ?? $('input[name=image]').val(),
      private: private ?? $('input[name=private]').is(':checked') ? true : false,
      mp: mp
    }, (user, newroom_id) => {
      if (user)
        buildRooms(user, newroom_id)
      hideModal()
    })
  }

  /**
   * Recoi un event pour mettre a jour l'ui du contenu
   */
  socket.on("update rooms", (user) => {
    buildRooms(user)
  })

  /**
   * Event click qui lance un emit pour recevoir la liste des rooms public et l'afficher dans une modal
   */
  $(`#publicrooms`).on('click', () => {
    showModal(`
      <div id="publicrooms">
        <h2>Rooms publiques</h2>
        <ul class="list">
        </ul>
      </div>
    `)
    socket.emit("public rooms", (rooms) => {
      rooms.forEach((room) => {
        $(`#publicrooms .list`).prepend(`<li onClick="joinRoom(${room.room_id})">${room.name}</li>`)
      })
    })
  })

  /**
   * Recoi un event indiquant que l'user a rejoins une room
   * Envoi un event pour update l'ui
   */
  socket.on("join room", () => {
    socket.emit("update rooms")
  })

  /**
   * Envoi un event pour rejoindre une room avec son id
   */
  joinRoom = (room_id) => {
    socket.emit("join room", room_id)
  }

  /**
   * On click pour l'affichage d'une modal pour la création d'une room
   */
  $("#createroom").on("click", () => {
    showModal(`
      <form id="createroomform">
        <label>Nom : <input type="text" name="name" /></label>
        <label>Image url : <input type="text" name="image" /></label>
        <label>Private : <input type="checkbox" name="private" /></label>
        <input type="submit" value="Submit">
      </form >
    `)
    $("#modal .close").on("click", () => hideModal())
    $('#createroomform').submit((e) => {
      e.preventDefault()
      createRoom()
    })
  })

  /**
   * Changer de room affiché
   */
  switchRoom = (room_id) => {
    $(".room").hide();
    $(`#room-${room_id}`).show()
  }

  /**
   * Création de l'ui pour l'user
   * @param user    * objet de l'user
   * @param room_id * id de la room a afficher
   */
  function buildRooms(user, room_id = 0) {
    user.rooms?.forEach(room => newRoom(room))
    switchRoom(user.rooms.find(room => room.room_id == room_id)?.room_id || user.rooms[0]?.room_id)
    $("#login").remove()
    $("#mainWrapper").show()
  }

  /**
   * Créer l'ui d'une room si elle n'existe pas
   * @param room * l'objet de la room
   * @returns room_id
   */
  function newRoom({room_id, name}) {
    if (!$(`#btn-${room_id}`).length) {
      $("#btnRoomsList").append(`
        <div id="btn-${room_id}" class="btnRoom">
          <span class="name" onClick="switchRoom(${room_id})">${name}</span>
          <span class="del" onClick="event.stopPropagation();deleteRoom(${room_id})">❌</span>
        </div>
      `)
    }
    if (!$(`#room-${room_id}`).length) {
      $('#rooms').append(`
        <div class="room" id="room-${room_id}">
          <h2>${name}</h2>
          <form class="invite">
            <input type="text" size="10" class="userid" placeholder="user id">
            <input type="submit" value="Inviter">
          </form>
          <div class="chatWrapper">
            <div class="chatWindow"></div>
            <form class="messageForm">
              <input type="text" size="35" class="message" placeholder="Say something...">
              <input type="submit" value="Submit">
            </form>
          </div>
        </div>
      `)
      $(`#room-${room_id} .invite`).submit((e) => {
        e.preventDefault();
        socket.emit("invite user", {
          target_user_id: $(`#room-${room_id} input.userid`).val(),
          room_id: room_id
        })
      })
      $(`#room-${room_id} .messageForm`).submit((e) => {
        e.preventDefault();
        sendMsg(room_id)
      })
      socket.emit("get message", room_id, (messages) => {
        messages.sort((a, b) => a.message_id - b.message_id)
        messages.forEach(message => createMessage(message.room_id, message.message_id, message.content, message.user_id, message.pseudo))
      })
    }
    return room_id;
  }

  /**
   * Envoi l'event pour delete la room correspondant à l'id
   */
  deleteRoom = (room_id) => {
    socket.emit("delete room", room_id);
  }

  /**
   * Recoi l'event pour effacer la room et son bouton
   */
  socket.on("delete room", (room_id) => {
    $(`#room-${room_id}`).remove()
    $(`#btn-${room_id}`).remove()
  })
})