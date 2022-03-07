$(document).ready(function () {
  var socket = io.connect();
  socket.emit("userlist", 1, function (data) {
    $('.utilisateurs').append(JSON.stringify(data));
  });
  //round 2
  var $usernameForm = $("#usernameForm");
  var $username = $("#username");
  var $error = $("#error");

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
      <div id="btn-${chan.id_room}" class="btnRoom">
        ${chan.name}
      </div>
    `);
    $('#chans').append(`
      <div class="chan" id="chan-${chan.id_room}">
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
            ${/*chan.users.map(u => `<div id="user-${u.id_room}">${convertToPlain(u)}</div>`).join('')*/
          ''}
          </div>
        </div>
      </div>
    `);
    return chan.id;
  }
  function sendMsg(msg,chanid) {
    socket.emit("send message", {
      msg: msg,
      chan: chanid
    },
      () => input.val('')
    );
  }
  function switchChan(chan) {
    $(".chan").hide();
    let htmlChan = $(`#chan-${chan.id_room}`);
    let input = $(`#chan-${chan.id_room} .message`);
    htmlChan.show()
    htmlChan.submit(function (e) {
      e.preventDefault();
      sendMsg(input.val(),chan.id_room) 
    });
    socket.on(`usernames${chan.id_room}`, function (usersdata) {
      console.log(usersdata);
      let html = "";
      for (i = 0; i < usersdata.length; i++) {
        html += "<div>" + convertToPlain(usersdata[i]) + "</div>";
      }
      htmlChan.find('.users').html(html);
    });
    $("#login").remove()
    $("#mainWrapper").show()
  }
  function buildUI(data) {
    data.chans?.forEach(chan=>newChan(chan))
    $(".btnRoom").on("click", function (e) {
      switchChan(data.chans.find(chan => chan.id_room == e.target.id.match(/[0-9]+/)))
    })
    switchChan(data.chans[0])
  }
  //round 2 add the username
  socket.on("new message", function (data, callback) {
    console.log("new message :", data);
    $(`#chan-${data.chan} .chatWindow`).append("<div class='message'><strong>" + convertToPlain(data.user) + "</strong>: " + convertToPlain(data.msg) + "</div>");
  });

  socket.on("connection", function (data) {
    //round 2
    $usernameForm.submit(function (e) {
      e.preventDefault();
      console.log('event', e);
      socket.emit("new user", $username.val(), function (data) {
        console.log('data', data);
        data ? buildUI(data):$error.html("Username is wrong");
      })
      $username.val("");
    })
  })
})