
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
window.handleCredentialResponse = (response) => 
// decodeJwtResponse() is a custom function Sign Updefined by you
// to decode the credential response.
responsePayload = decodeJwtResponse(response.credential);

console.log("ID: " + responsePayload.sub);
console.log('Given Name: ' + responsePayload.given_name);
console.log('Family Name: ' + responsePayload.family_name);
console.log("Email: " + responsePayload.email);

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
    }),
  })
    .then((res) => {
      if (res.status === 400) {
        alert('User not found');
      } else if (res.status === 200) {
        alert('User logged in successfully');
        window.location.href = 'homepage.html';
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
  