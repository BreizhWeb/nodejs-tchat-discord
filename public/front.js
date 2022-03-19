var deleteMessage, deleteRoom;
$(document).ready(() => {
  var socket = io.connect();
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

  deleteMessage = function (msg_id, room_id) {
    socket.emit("delete message", { msg_id, room_id });
  }

  socket.on("delete message", (msg_id) => {
    $(`#msg-${msg_id}`).html(`
      <em>Message effacé</em>
    `)
  })

  socket.on("new message", (data) => {
    $(`#room-${data.room_id} .chatWindow`).append(`
      <div class='message' id="msg-${data.msg_id}" onClick="deleteMessage(${data.msg_id},${data.room_id})">
        <strong class="pseudo">${convertToPlain(data.user.pseudo)}</strong>: 
        <span class="content">${convertToPlain(data.content)}</span>
      </div>
    `)
  })

  function showModal(html) {
    $('#modal').addClass('show')
    $('#modal .modalcontent').html(html)
  }

  function hideModal() {
    $('#modal').removeClass('show')
    $('#modal .modalcontent').html('')
  }

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
    $('#createroomform').submit((e) => {
      e.preventDefault()
      socket.emit("create room", {
        name: $('input[name=name]').val(),
        image: $('input[name=image]').val(),
        private: $('input[name=private]').val() == 'on' ? true : false
      }, (user, newroom_id) => {
        buildRooms(user, newroom_id)
        hideModal()
      })
    })
    $("#modal .close").on("click", ()=>hideModal())
  })

  function switchRoom(room) {
    $(".room").hide();
    $(`#room-${room.room_id}`).show()
  }

  function buildRooms(user, room_id = 0) {
    user.rooms?.forEach(room => newRoom(room))
    $(".btnRoom").on("click", (e) => {
      switchRoom(user.rooms.find(room => room.room_id == e.target.id.match(/[0-9]+/)))
    })
    switchRoom(user.rooms.find(room => room.room_id == room_id) || user.rooms.at(0))
    $("#login").remove()
    $("#mainWrapper").show()
  }

  function newRoom(room) {
    if (!$(`#btn-${room.room_id}`).length) {
      $("#btnRoomsList").append(`
        <div id="btn-${room.room_id}" class="btnRoom">
          <span class="name">${room.name}</span>
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