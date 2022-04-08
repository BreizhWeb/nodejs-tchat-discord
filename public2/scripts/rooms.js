var deleteMessage, deleteRoom, privateMessage, switchRoom, deleteUser, joinRoom, test;
var socket = io.connect();
 
 /**
  * Charge la page html  dans le container principal avec son css
  * @param fileName * nom commun de fileName.css et fileName.html
  */
  function loadTemplate(fileName){
    $('#screenContainer').load('./templates/'+fileName+'.html');
    $("#pageCss").attr({
      href: 'styles/'+fileName+'.css'
    });
  }
/*
  socket.emit("truc", room_id, (room)=>{
    buildui(room)
  }) 
  */

  function loadRoom(room_id){
    socket.emit("getRoom", room_id, (room, listMessages)=>{
        loadTitle(room.name);
        sendMessage(room_id);
        loadMessages(listMessages);
    })
  }

  function newMessage(room_id) {
      socket.emit("sendMessage", {
          content: $(`#messageInput`).val(),
          room_id: room_id,
      })
  }

  function sendMessage(room_id) {
    $(`#messageForm`).submit((e) => {
      e.preventDefault();
      newMessage(room_id);
      $("#messageInput").val("");
    });
  }

  function loadMessages(listMessages){
    listMessages.forEach(message => {
        addMessage(message.message_id, message.content, message.user_id, message.pseudo, message.room_id);
    });
  }
  
  /**
  * Recoi un event newMessage contenant un objet :
  * @param message_id  * l'id du message
  * @param content * le contenu du message
  * @param user_id * l'id de l'auteur
  * @param pseudo  * le pseudo de l'auteur
  * @param room_id * la room où le message doit être publié
  */
  function addMessage(message_id, content, user_id, pseudo, room_id) {
    $(`#messages`).append(`
      <div class="message" id="msg-${message_id}">
        <div class="headerMessage">
          <p class="user">${pseudo}</p>
        </div>
        <p class="content">
          ${content}
        </p>
        <button class="delete-btn" onClick="deleteMessage(${message_id},${room_id})"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `)
  }

  deleteMessage = (message_id, room_id) => {
    socket.emit("delete message", { message_id, room_id });
  }

  /**
  * Recoi un event newMessage contenant un objet :
  * @param message_id  * l'id du message
  * @param content * le contenu du message
  * @param user_id * l'id de l'auteur
  * @param pseudo  * le pseudo de l'auteur
  * @param room_id * la room où le message doit être publié
  */
  socket.on("new message", ({message_id, content, user_id, pseudo, room_id}) => {
    addMessage(message_id, content, user_id, pseudo, room_id)
  })   

  function loadTitle(name){
    $("#chatTitle").html(`
      <h2> ${name} </h2>
    `)
  }