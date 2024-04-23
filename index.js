window.onload = function() {
  if(typeof window.localStorage !== "undefined" && !localStorage.getItem('visited')) {
         localStorage.setItem('visited', true);
         location.replace("login.html")
    }
  var firebaseConfig = {
    apiKey: "AIzaSyCHlpt3XjJkuwwPL2MACPBoasd6uhEegOE",
    authDomain: "s3cure-website.firebaseapp.com",
    databaseURL: "https://s3cure-website-default-rtdb.firebaseio.com",
    projectId: "s3cure-website",
    storageBucket: "s3cure-website.appspot.com",
    messagingSenderId: "632752282450",
    appId: "1:632752282450:web:4f2e750830e5c4ef41388b"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.database()
  class S3CURE{
    home(){
      document.body.innerHTML = ''
      this.titleCreate()

      this.joinFormCreate()
    }
    chat(){
      this.titleCreate()
      this.chatCreate()
    }
    titleCreate(){
      var containTitle = document.createElement('div')
      containTitle.setAttribute('id', 'containTitle')
      var containInnerTitle = document.createElement('div')
      containInnerTitle.setAttribute('id', 'containInnerTitle')

      var title = document.createElement('h1')
      title.setAttribute('id', 'title')
      title.textContent = 'S3CURE'

      containInnerTitle.append(title)
      containTitle.append(containInnerTitle)
      document.body.append(containTitle)
    }
    joinFormCreate(){
      var parent = this;

      var containJoin = document.createElement('div')
      containJoin.setAttribute('id', 'containJoin')
      var containInnerJoin = document.createElement('div')
      containInnerJoin.setAttribute('id', 'containInnerJoin')

      var containJoinButton = document.createElement('div')
      containJoinButton.setAttribute('id', 'containJoinButton')

      var joinButton = document.createElement('button')
      joinButton.setAttribute('id', 'joinButton')
      joinButton.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>'

      var containJoinInput = document.createElement('div')
      containJoinInput.setAttribute('id', 'containInputJoin')

      var joinInput = document.createElement('input')
      joinInput.setAttribute('id', 'inputJoin')
      joinInput.setAttribute('maxlength', 15)
      joinInput.placeholder = 'Please enter a name'
      joinInput.onkeyup  = function(){
        if(joinInput.value.length > 0){
          joinButton.classList.add('enabled')
          joinButton.onclick = function(){
            parent.nameSave(joinInput.value)

            containJoin.remove()
            parent.chatCreate()
          }
        }else{
          joinButton.classList.remove('enabled')
        }
      }

      containJoinButton.append(joinButton)
      containJoinInput.append(joinInput)
      containInnerJoin.append(containJoinInput, containJoinButton)
      containJoin.append(containInnerJoin)
      document.body.append(containJoin)
    }

    loadCreate(containId){

      var parent = this;

      var container = document.getElementById(containId)
      container.innerHTML = ''

      var containLoader = document.createElement('div')
      containLoader.setAttribute('class', 'containLoader')

      var loader = document.createElement('div')
      loader.setAttribute('class', 'loader')

      containLoader.append(loader)
      container.append(containLoader)

    }

    chatCreate(){

      var parent = this;

      var containTitle = document.getElementById('containTitle')
      var title = document.getElementById('title')
      containTitle.classList.add('containChatTitle')
      title.classList.add('chatTitle')

      var containChat = document.createElement('div')
      containChat.setAttribute('id', 'containChat')

      var containInnerChat = document.createElement('div')
      containInnerChat.setAttribute('id', 'containInnerChat')

      var containChatContent = document.createElement('div')
      containChatContent.setAttribute('id', 'containChatContent')

      var containInputChat = document.createElement('div')
      containInputChat.setAttribute('id', 'containInputChat')

      var sendInputChat = document.createElement('button')
      sendInputChat.setAttribute('id', 'sendInputChat')
      sendInputChat.setAttribute('disabled', true)
      sendInputChat.innerHTML = `<i class="far fa-paper-plane"></i>`

      var inputChat = document.createElement('input')
      inputChat.setAttribute('id', 'inputChat')
      inputChat.setAttribute('maxlength', 1000)
      inputChat.placeholder = `${parent.getName()}. Say something...`
      inputChat.onkeyup  = function(){
        if(inputChat.value.length > 0){
          sendInputChat.removeAttribute('disabled')
          sendInputChat.classList.add('enabled')
          sendInputChat.onclick = function(){
            sendInputChat.setAttribute('disabled', true)
            sendInputChat.classList.remove('enabled')
            if(inputChat.value.length <= 0){
              return
            }
            parent.loadCreate('containChatContent')
            parent.messageSend(inputChat.value)
            inputChat.value = ''
            inputChat.focus()
          }
        }else{
          sendInputChat.classList.remove('enabled')
        }
      }
      var containLogoutChat = document.createElement('div')
      containLogoutChat.setAttribute('id', 'containLogoutChat')

      var logoutChat = document.createElement('button')
      logoutChat.setAttribute('id', 'logoutChat')
      logoutChat.textContent = `${parent.getName()} • logout`
      logoutChat.onclick = function(){
        localStorage.clear()
        //parent.home()
        location.replace("login.html")
      }

      containLogoutChat.append(logoutChat)
      containInputChat.append(inputChat, sendInputChat)
      containInnerChat.append(containChatContent, containInputChat, containLogoutChat)
      containChat.append(containInnerChat)
      document.body.append(containChat)

      parent.loadCreate('containChatContent')

      parent.chatRefresh()
    }

    nameSave(name){

      localStorage.setItem('name', name)
    }

    messageSend(message){
      var parent = this

      if(parent.getName() == null && message == null){
        return
      }


      db.ref('chats/').once('value', function(message_object) {

        var index = parseFloat(message_object.numChildren()) + 1
        db.ref('chats/' + `message_${index}`).set({
          name: parent.getName(),
          message: message,
          index: index
        })
        .then(function(){

          parent.chatRefresh()
        })
      })
    }

    getName(){

      if(localStorage.getItem('name') != null){
        return localStorage.getItem('name')
      }else{
        this.home()
        return null
      }
    }

    chatRefresh(){
      var containChatContent = document.getElementById('containChatContent')


      db.ref('chats/').on('value', function(messages_object) {

        containChatContent.innerHTML = ''

        if(messages_object.numChildren() == 0){
          return
        }


        var messages = Object.values(messages_object.val());
        var guide = []
        var unordered = []
        var ordered = []

        for (var i, i = 0; i < messages.length; i++) {

          guide.push(i+1)

          unordered.push([messages[i], messages[i].index]);
        }

        //Obtained from stackoverflow
        guide.forEach(function(key) {
          var found = false
          unordered = unordered.filter(function(item) {
            if(!found && item[1] == key) {
              // Now push the ordered messages to ordered array
              ordered.push(item[0])
              found = true
              return false
            }else{
              return true
            }
          })
        })

        ordered.forEach(function(data) {
          var name = data.name
          var message = data.message

          var containMessage = document.createElement('div')
          containMessage.setAttribute('class', 'containMessage')

          var containInnerMessage = document.createElement('div')
          containInnerMessage.setAttribute('class', 'containInnerMessage')

          var containUserMessage = document.createElement('div')
          containUserMessage.setAttribute('class', 'containUserMessage')

          var userMessage = document.createElement('p')
          userMessage.setAttribute('class', 'userMessage')
          userMessage.textContent = `${name}`

          var containMessageContent = document.createElement('div')
          containMessageContent.setAttribute('class', 'containMessageContent')

          var messageContent = document.createElement('p')
          messageContent.setAttribute('class', 'messageContent')
          messageContent.textContent = `${message}`

          containUserMessage.append(userMessage)
          containMessageContent.append(messageContent)
          containInnerMessage.append(containUserMessage, containMessageContent)
          containMessage.append(containInnerMessage)

          containChatContent.append(containMessage)
        });
        containChatContent.scrollTop = containChatContent.scrollHeight;
    })

    }
  }
  var app = new S3CURE()
  if(app.getName() != null){
    app.chat()
  }
}
