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
}

// Get the search form
const searchForm = document.querySelector('#searchForm');

// Add an event listener to the form
searchForm.addEventListener('submit', (event) => {
  // Prevent the form from submitting normally
  event.preventDefault();

  // Get the product name from the search input
  let selectedProduct = document.querySelector('.search-input').value;

  // Send a POST request to the '/homepage' route with the selected product's name
  fetch('/homepage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product: selectedProduct }),
  })
  .then(response => response.json())
  .then(data => {
    // Update the popup with the product details
    document.querySelector('.popup-img').src = `images/${data.product.toLowerCase()}.jpg`;
    document.querySelector('.product-name').textContent = data.product;
    document.querySelector('.product-price').textContent = `R${data.price}`;
    document.querySelector('.product-availability').textContent = `Available at: ${data.availability}`;
  
    // Show the popup
    popup.classList.remove("hide-popup");
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

// Role-based access control
const roleAccess = {
  'Customer': ['login.html', 'signup.html', 'index.html', 'homepage.html', 'product.html', 'cart.html', 'custOrderDashboard.html'],
  'Staff': ['login.html', 'signup.html', 'index.html', 'homepage.html', 'product.html', 'cart.html', 'stock-management.html'],
  'Owner': ['login.html', 'signup.html', 'index.html', 'homepage.html', 'product.html', 'orderManagement.html', 'cart.html', 'onboarding.html', 'orderManagement.html', 'stock-management.html'],
  'Manager': ['login.html', 'signup.html', 'index.html', 'homepage.html', 'product.html', 'orderManagement.html', 'stock-management.html' , 'cart.html', 'onboarding.html']
};

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(event) {
    const userRole = localStorage.getItem('userRole');
    const href = this.getAttribute('href');

    console.log('User Role:', userRole);  // Debug log for user role
    console.log('Target Href:', href);   // Debug log for target href

    if (href.startsWith('#')) {
      return;
    }

    // Always allow access to login and signup pages
    if (href === 'login.html' || href === 'signup.html') {
      return; // No action needed, allow navigation
    }

    if (userRole && roleAccess[userRole].includes(href)) {
      return; // Role-based access control allows this page
    } else {
      event.preventDefault(); // Prevent navigation
      alert('You do not have access to this page.');
    }
  });
});


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