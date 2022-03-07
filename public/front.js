$(document).ready(function () {
  var socket = io.connect();
  console.log(socket);
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
    $('#chans').append(`
      <div class="chan" id="chan-${chan.id}">
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
            ${chan.users.map(u => `<div id="user-${u.id}">${convertToPlain(u)}</div>`).join('')}
          </div>
        </div>
      </div>
    `);
    return chan.id;
  }

  //round 2 add the username
  socket.on("new message", function (data, callback) {
    console.log("new message :", data);
    $(`#chan-${data.chan} .chatWindow`).append("<div class='message'><strong>"+convertToPlain(data.user)+"</strong>: "+convertToPlain(data.msg)+"</div>");
  });

  socket.on("connection", function (data) {
    console.log(socket)
    //round 2
    $usernameForm.submit(function (e) {
      e.preventDefault();
      console.log('event',e);
      socket.emit("new user", $username.val(), function (data) {
        console.log('data',data);
        if (data) {
          for (i = 0; i < data.chans.length; i++) {
            var btnRoom = document.createElement("button");
            btnRoom.innerHTML = data.chans[i].name;
            btnRoom.id = `btn-${data.chans[i].id}`;
            btnRoom.classList = "btnRoom";
            document.getElementById("btnRoomsList").appendChild(btnRoom);
          }
          $(".btnRoom").on("click", function (e) {
            $(".chan").remove();
            var btnClicked = e.target;
            var reg = btnClicked.id.match(/[0-9]+/);
            chan = data.chans[reg];

            let id = newChan(chan);
            let htmlChan = $(`#chan-${id}`);
            let input = $(`#chan-${id} .message`);
            htmlChan.submit(function (e) {
              e.preventDefault();
              socket.emit("send message", {
                msg: input.val(),
                chan: id
              },
                () => input.val('')
              );
            });
            socket.on(`usernames${chan.id}`, function (usersdata) {
              console.log(usersdata);
              let html = "";
              for (i = 0; i < usersdata.length; i++) {
                html += "<div>" + convertToPlain(usersdata[i]) + "</div>";
              }
              htmlChan.find('.users').html(html);
            });
          });
          $("#namesWrapper").hide();
          $("#mainWrapper").show();
          $("#userWrapper").show();
        } else {
          $error.html("Username is wrong");
        }
      })
      $username.val("");
    })
  })
})