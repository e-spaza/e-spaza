
const hamburer = document.querySelector(".hamburger");
const navList = document.querySelector(".nav-list");

if (hamburer) {
  hamburer.addEventListener("click", () => {
    navList.classList.toggle("open");
  });
}

// Popup
const popup = document.querySelector(".popup");
const closePopup = document.querySelector(".popup-close");

if (popup) {
  closePopup.addEventListener("click", () => {
    popup.classList.add("hide-popup");
  });

  window.addEventListener("load", () => {
    setTimeout(() => {
      popup.classList.remove("hide-popup");
    }, 1000);
  });
}

//Dynamic search filtering as user types (query Products collection in MongoDB)


function decodeJwtResponse(token) {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload)
}
let responsePayload;
window.handleCredentialResponse = (response) => {
// decodeJwtResponse() is a custom function Sign Updefined by you
// to decode the credential response.
responsePayload = decodeJwtResponse(response.credential);

console.log("ID: " + responsePayload.sub);
console.log('Given Name: ' + responsePayload.given_name);
console.log('Family Name: ' + responsePayload.family_name);
console.log("Email: " + responsePayload.email);
let radios = document.getElementsByName('user-type');

// Iterate over the radio buttons
let usertype = "";
for(let i = 0; i < radios.length; i++) {
    // If the radio button is selected
    if(radios[i].checked) {
        // Log its value
        console.log(radios[i].value);
        usertype = radios[i].value;
        break;
    }
}

// Send the signup response to the server and handle 409 error for user already exists
fetch('/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: responsePayload.sub,
    name: responsePayload.given_name,
    surname: responsePayload.family_name,
    email: responsePayload.email,
    role: usertype,
  }),
})
  .then((res) => {
    if (res.status === 400) {
      alert('User already exists');
    } else if (res.status === 201) {
      alert('User created successfully');
      window.location.href = 'homepage.html';
    }
  })
  .catch((err) => {
    console.log(err);
  });
}

window.handleCredentialResponseLogin = (response) => {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  responsePayload = decodeJwtResponse(response.credential);
  
  console.log("ID: " + responsePayload.sub);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Email: " + responsePayload.email);
  // Get all radio buttons with the name 'user-type'
let radios = document.getElementsByName('user-type');

// Iterate over the radio buttons
let usertype = "";
for(let i = 0; i < radios.length; i++) {
    // If the radio button is selected
    if(radios[i].checked) {
        // Log its value
        console.log(radios[i].value);
        usertype = radios[i].value;
        break;
    }
}
  
  // Send the login to the server and handle user not found error
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: responsePayload.sub,
      name: responsePayload.given_name,
      surname: responsePayload.family_name,
      email: responsePayload.email,
      role: usertype,
    }),
  })
    .then((res) => {
      if (res.status === 400) {
        alert('User not found');
      } else if (res.status === 200) {
        return res.json();
    }
    })
    .then(user => {
      console.log(user);

        alert('User logged in successfully');
        //window.location.href = 'homepage.html';
        if (user.role === "store-owner")
        {
          window.location.href = 'onboarding.html';
        }else if (user.role === "customer")
        {
          window.location.href = 'homepage.html';
        }else
        {
          window.location.href = 'orderDashboard.html';
        }
    })
    .catch((err) => {
      console.log(err);
    });
}
  