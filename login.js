var firebaseConfig = {
    apiKey: "AIzaSyBnGEqDG-tZffL3YBi3al8iixPfJ_uDnfk",
    authDomain: "s3curelogin-ff667.firebaseapp.com",
    projectId: "s3curelogin-ff667",
    storageBucket: "s3curelogin-ff667.appspot.com",
    messagingSenderId: "768434467170",
    appId: "1:768434467170:web:6c9795f8a11ae629ef3c3b"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const database = firebase.database()

function register () {
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  full_name = document.getElementById('full_name').value

  if (checkEmail(email) == false || checkPassword(password) == false) {
    alert('Email or Password is not Valid')
    return
  }
  if (validate_field(full_name) == false) {
    alert('Full Name is not Valid')
    return
  }


  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    var user = auth.currentUser

    var database_ref = database.ref()

    var user_data = {
      email : email,
      full_name : full_name,
      last_login : Date.now()
    }

    database_ref.child('users/' + user.uid).set(user_data)

    alert('User has Been Created. Please Press OK')
  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

function login () {
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  if (checkEmail(email) == false || checkPassword(password) == false) {
    alert('Invalid Email or Password.')
    return
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    var user = auth.currentUser

    var database_ref = database.ref()

    var user_data = {
      last_login : Date.now()
    }

    database_ref.child('users/' + user.uid).update(user_data)
    alert('User Logged In. Please press OK.')
    location.replace("index.html")

  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

function checkEmail(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    return true
  } else {
    return false
  }
}

function checkPassword(password) {
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }
  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}
