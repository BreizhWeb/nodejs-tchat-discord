$(document).ready(function () {
  var socket = io.connect();
  socket.emit("userlist", 1, function (data) {
    $('.utilisateurs').append(JSON.stringify(data));
  });

  function convertToPlain(html) {
    // Create a new div element
    var tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  function newChan(chan) {
    $("#btnRoomsList").append(`
      <div id="btn-${chan.room_id}" class="btnRoom">
        ${chan.name}
      </div>
    `);
    $('#chans').append(`
      <div class="chan" id="chan-${chan.room_id}">
        <h2>${chan.name}</h2>
        <div class="chatWrapper">
          <div class="chatWindow"></div>
          <form class="messageForm">
            <input type="text" size="35" class="message" placeholder="Say something...">
            <input type="submit" value="Submit">
          </form>
        </div>
        <div class="userWrapper">
          <div class="users">
            ${/*chan.users.map(u => `<div id="user-${u.room_id}">${convertToPlain(u)}</div>`).join('')*/
      ''}
          </div>
        </div>
      </div>
    `);
    return chan.id;
  }

  function sendMsg(chanid) {
    socket.emit("send message", {
      msg: $(`.messageForm input.message`).val(),
      chan: chanid
    },
      (v) => {
        console.log('callback',v);
        $(`.messageForm input.message`).val('')
      }
    );
  }

  function switchChan(chan) {
    console.log('chan',chan);
    $(".chan").hide();
    $(`#chan-${chan.room_id}`).show().submit(function (e) {
      e.preventDefault();
      sendMsg(chan.room_id)
    })
    /**
     * Gestion des users connectés
     *
     * 
    socket.on(`usernames${chan.id_room}`, function (usersdata) {
      console.log(usersdata);
      let html = "";
      for (i = 0; i < usersdata.length; i++) {
        html += "<div>" + convertToPlain(usersdata[i]) + "</div>";
      }
      htmlChan.find('.users').html(html);
    })*/
    $("#login").remove()
    $("#mainWrapper").show()
  }

  function buildUI(data) {
    data.chans?.forEach(chan => newChan(chan))
    $(".btnRoom").on("click", function (e) {
      switchChan(data.chans.find(chan => chan.room_id == e.target.id.match(/[0-9]+/)))
    })
    console.log(data);
    switchChan(data.chans[0])
  }

  socket.on("new message", function (data, callback) {
    console.log("new message :", data)
    $(`#chan-${data.room_id} .chatWindow`).append(`
      <div class='message'>
        <strong>${convertToPlain(data.user)}</strong>: 
        ${convertToPlain(data.msg)}
      </div>
    `)
  })

  socket.on("connection", function (data) {
    $("#usernameForm").submit(function (e) {
      e.preventDefault()
      let pseudo = $("#username").val()
      if (pseudo) {
        socket.emit("new user", pseudo, function (data) {
          console.log('data', data)
          data ? buildUI(data) : $("#error").html("Username is wrong")
        })
      }
      $("#username").val("")
    })
  })
})