var deleteMessage, deleteRoom, privateMessage, switchRoom, test;
$(document).ready(() => {
  var socket = io.connect();
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
  socket.emit("userlist", 1, (data) => {
    $('.utilisateurs').append(JSON.stringify(data));
  });

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

  function convertToPlain(html) {
    // Create a new div element
    var tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

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

  deleteMessage = (msg_id, room_id) => {
    socket.emit("delete message", { msg_id, room_id });
  }

  test = () => {
    socket.emit("test")
  }

  socket.on("delete message", (msg_id) => {
    console.log(msg_id);
    $(`#msg-${msg_id}`).html(`
      <em>Message effacé</em>
    `)
  })

  function createMessage(room_id, msg_id, content, user_id, pseudo) {
    $(`#room-${room_id} .chatWindow`).append(`
      <div class='message' id="msg-${msg_id}">
        <strong class="pseudo" onClick="privateMessage(${user_id},'${pseudo}')">${convertToPlain(pseudo)}</strong>: 
        <span class="content">${convertToPlain(content)}</span>
        <i onClick="deleteMessage(${msg_id},${room_id})">❌</i>
      </div>
    `)
  }

  socket.on("new message", (data) => {
    createMessage(data.room_id, data.msg_id, data.content, data.user.user_id, data.user.pseudo)
  })

  privateMessage = (target_user_id, target_user_name) => {
    createRoom(target_user_name, '', true, target_user_id)
    // TODO check si la room est déjà là
    // if ($(`#mp-${target_user_id}`).length)
    //   switchRoom(target_user_id, true)
    // else
  }

  function showModal(html) {
    $('#modal').addClass('show')
    $('#modal .modalcontent').html(html)
  }

  function hideModal() {
    $('#modal').removeClass('show')
    $('#modal .modalcontent').html('')
  }

  function createRoom(name = null, image = null, private = null, mp = false) {
    socket.emit("create room", {
      name: name ?? $('input[name=name]').val(),
      image: image ?? $('input[name=image]').val(),
      private: private ?? $('input[name=private]').val() == 'on' ? true : false,
      mp: mp
    }, (user, newroom_id) => {
      console.log(user, newroom_id);
      buildRooms(user, newroom_id)
      hideModal()
    })
  }

  socket.on("update rooms", (user) => {
    console.log('update rooms');
    buildRooms(user)
  })

  $("#createroom").on("click", () => {
    showModal(`
        <form id="createroomform">
          <label>Nom : <input type="text" name="name" /></label>
          <label>Image url : <input type="text" name="image" /></label>
          <label>Private : <input type="checkbox" name="private" /></label>
          <input type="submit" value="Submit">
          <span class="close">x</span>
        </form >
      `)
    $("#modal .close").on("click", () => hideModal())
    $('#createroomform').submit((e) => {
      e.preventDefault()
      createRoom()
    })
  })

  switchRoom = (room_id) => {
    $(".room").hide();
    $(`#room-${room_id}`).show()
  }

  function buildRooms(user, room_id = 0) {
    user.rooms?.forEach(room => newRoom(room))
    switchRoom(user.rooms.find(room => room.room_id == room_id)?.room_id || user.rooms.at(0)?.room_id)
    $("#login").remove()
    $("#mainWrapper").show()
  }

  function newRoom(room) {
    if (!$(`#btn-${room.room_id}`).length) {
      $("#btnRoomsList").append(`
        <div id="btn-${room.room_id}" class="btnRoom">
          <span class="name" onClick="switchRoom(${room.room_id})">${room.name}</span>
          <span class="del" onClick="event.stopPropagation();deleteRoom(${room.room_id})">❌</span>
        </div>
      `)
    }
    if (!$(`#room-${room.room_id}`).length) {
      $('#rooms').append(`
        <div class="room" id="room-${room.room_id}">
          <h2>${room.name}</h2>
          <div class="chatWrapper">
            <div class="chatWindow"></div>
            <form class="messageForm">
              <input type="text" size="35" class="message" placeholder="Say something...">
              <input type="submit" value="Submit">
            </form>
          </div>
        </div>
      `)
      $(`#room-${room.room_id}`).submit((e) => {
        e.preventDefault();
        sendMsg(room.room_id)
      })
      socket.emit("get message", room.room_id, (messages) => {
        messages.forEach(message => createMessage(message.room_id, message.message_id, message.content, message.user_id, message.pseudo))
      })
    }
    return room.id;
  }

  deleteRoom = function (room_id) {
    socket.emit("delete room", room_id);
  }

  socket.on("delete room", (room_id) => {
    $(`#room-${room_id}`).remove()
    $(`#btn-${room_id}`).remove()
  })
})