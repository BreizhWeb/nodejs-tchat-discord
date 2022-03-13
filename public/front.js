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
    if (!$(`#btn-${chan.room_id}`).length) {
      $("#btnRoomsList").append(`
        <div id="btn-${chan.room_id}" class="btnRoom">
          ${chan.name}
        </div>
      `)
    }
    if (!$(`#chan-${chan.room_id}`).length) {
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
      `)
    }
    return chan.id;
  }

  function sendMsg(chanid) {
    socket.emit("send message", {
      msg: $(`.messageForm input.message`).val(),
      chan: chanid
    },
      () => {
        $(`.messageForm input.message`).val('')
      }
    );
  }

  function switchChan(chan) {
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

  function buildUI(user, chanid = 0) {
    user.chans?.forEach(chan => newChan(chan))
    $(".btnRoom").on("click", function (e) {
      switchChan(user.chans.find(chan => chan.room_id == e.target.id.match(/[0-9]+/)))
    })
    switchChan(user.chans.find(chan => chan.room_id == chanid) || user.chans[0])
  }

  $("#createroom").on("click", function (e) {
    $('#modal').addClass('show')
    $('#modal .modalcontent').html(`
      <form id="createroomform">
        <label>Nom : <input type="text" name="name" /></label>
        <label>Image url : <input type="text" name="image" /></label>
        <label>Private : <input type="checkbox" name="private" /></label>
        <input type="submit" value="Submit">
        <span class="close">x</span>
      </form >
    `)
    $('#createroomform').submit(function (e) {
      e.preventDefault()
      console.log(e);
      socket.emit(
        "create room",
        {
          name: $('input[name=name]').val(),
          image: $('input[name=image]').val(),
          private: $('input[name=private]').val() == 'on' ? true : false
        },
        function (user, newroomid) {
          buildUI(user, newroomid)
          $('#modal').removeClass('show')
          $('#modal .modalcontent').html('')
        }
      )
    })
    $("#modal .close").on("click", function (e) {
      $('#modal').removeClass('show')
    })
  })

  socket.on("new message", function (data, callback) {
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
          data ? buildUI(data) : $("#error").html("Username is wrong")
        })
      }
      $("#username").val("")
    })
  })
})