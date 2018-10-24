'use strict';
let FBurl = 'https://gleantn-1794b.firebaseio.com/farmers';

let currentUser;
let userObj;

if (typeof (Storage) !== "undefined") {
  console.log("Yay, session storage works!")
} else {
  console.log("There is a problem with storing necessary info!");
  alert("Unfortunately, local storage is not enabled on this device.");
}

//the promise set up here allows the user to be created before their profile is saved -- this allows them to become 'authenticated' as well as saves their (uid) details to the firebase database
$("#register-btn").click(() => {
  createUser()
    .then(results => {
      console.log(results)
      return addFarmerProfile(results)
    })
    .then((data) => {
      return loginUser(userObj)
    })
    .then((userDeets) => {
      return getFarmerProfile(userDeets.uid)
    })
    .then((profile) => {
      stickInForm(profile)
    })
    .catch((err) => {
      console.log("error in registration", err);
      window.alert(err.message);
    })
})

let signUpScreen = () => {
  $('.sign-up-body').removeClass('hidden');
  $('.sign-in-body').addClass('hidden');
  $('.glean-request-body').addClass('hidden');
  $('#sign-up-nav').addClass('active');
  $('#log-in-nav').removeClass('active');
  $('#glean-req-nav').removeClass('active');
}

let signInScreen = () => {
  $('.sign-up-body').addClass('hidden');
  $('.sign-in-body').removeClass('hidden');
  $('.glean-request-body').addClass('hidden');
  $('#sign-up-nav').removeClass('active');
  $('#sign-up-nav').removeClass('hidden');
  $('#log-in-nav').addClass('active');
  $('#log-in-nav').removeClass('hidden');
  $('#log-out-nav').addClass('hidden');
  $('#glean-req-nav').removeClass('active');
  $('#glean-req-nav').addClass('hidden');
}

let viewGleanReq = () => {
  $('.sign-up-body').addClass('hidden');
  $('.sign-in-body').addClass('hidden');
  $('.glean-request-body').removeClass('hidden');
  $('#glean-req-nav').addClass('active');
  $('#log-in-nav').removeClass('active');
  $('#sign-up-nav').removeClass('active');
}

$('#sign-up-show').click(() => {
  signUpScreen();
});
$('#sign-up-nav').click(() => {
  signUpScreen();
});
$('#log-in-nav').click(() => {
  signInScreen();
});
$('#log-out-nav').click(() => {
  logoutUser();
});


$('#login-btn').click(() => {
  userObj = {
    password: $('#in-password').val(),
    email: $('#in-email').val()
  }
  loginUser(userObj)
    .then((userDeets) => {

      return getFarmerProfile(userDeets.uid)
    })
    .then((profile) => {
      //set the user details on session storage to pass to the form
      stickInForm(profile);
    })
    .catch((err) => {
      console.log(err);
    })
});

// Send email to sosatn@endhunger.org from hidden form fields populated with this data
let stickInForm = (profile) => {
  sessionStorage.setItem("name", profile.name);
  sessionStorage.setItem("phone", profile.phone);
  sessionStorage.setItem("email", profile.email);
  sessionStorage.setItem("organic", profile.organic);
  sessionStorage.setItem("address", `${profile.street} ${profile.city}, ${profile.state}  ${profile.zip}`);
  viewGleanReq();
  $('#hidden-name').val(sessionStorage.name);
  $('#hidden-email').val(sessionStorage.email);
  $('#hidden-phone').val(sessionStorage.phone);
  $('#hidden-address').val(sessionStorage.address);
  $('#hidden-organic').val(sessionStorage.organic);
}


let getFarmerProfile = (uid) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${FBurl}/${uid}.json`,
      type: "GET"
    }).done((data) => {
      resolve(data);
    }).fail((error) => {
      console.log("Error", error);
      reject(error);
    });
  })
};

//on click of "register" button, capture what's in fields and store as object, send to FB, then send to next page
let addFarmerProfile = (user) => {
  var postData = {
    name: $('#name').val(),
    street: $('#street').val(),
    city: $('#city').val(),
    state: $('#state').val(),
    zip: $('#zip').val(),
    phone: $('#phone').val(),
    email: $('#up-email').val(),
    is_organic: $('#organic').is(':checked'),
    uid: user.user.uid
  }
  //set up the updates object since we do not want to create a new FB key -- just want to use the uid as the key.
  var updates = {};
  updates[`/farmers/${user.user.uid}`] = postData;
  return firebase.database().ref().update(updates);
}

//authenticate the user with firebase --Add a new user to the auth list
let createUser = () => {
  return new Promise((resolve, reject) => {
    userObj = {
      password: $('#up-password').val(),
      email: $('#up-email').val()
    }
    firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
      .then((user) => {
        currentUser = user;
        resolve(currentUser)
      })
      .catch((err) => {
        reject(err);
      })
  })
};

let loginUser = (userObj) => {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
      .then((profile) => {
        currentUser = profile.uid;
        sessionStorage.setItem("user_id", currentUser);
        $('#glean-req-nav').removeClass('hidden');
        $('#sign-up-nav').addClass('hidden');
        $('#log-in-nav').addClass('hidden');
        $('#log-out-nav').removeClass('hidden');
        resolve(profile);
      })
      .catch((err) => {
        console.log("error logging in:", err);
      });
  });
};

let logoutUser = () => {
  return firebase.auth().signOut()
    .then((response) => {
      signInScreen();

    })
    .catch((err) => {
      console.log("error logging out", err.message);
    });
};
