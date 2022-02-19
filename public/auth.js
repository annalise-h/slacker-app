/* 
  Register functionality
*/

$("#register-form").submit(async (event) => {
  event.preventDefault();
  const registerForm = document.getElementById("register-form");
  const registerFormData = new FormData(registerForm);

  try {
    const registerResponse = await fetch("/users/register", {
      method: "POST",
      body: registerFormData,
    });
    window.location = registerResponse.url;
  } catch (err) {
    console.log(err);
  }
});

/* 
  Login functionality
*/

$("#login-form").submit(async (event) => {
  event.preventDefault();
  const loginForm = document.getElementById("login-form");
  const loginFormData = new FormData(loginForm);

  try {
    const registerResponse = await fetch("/users/login", {
      method: "POST",
      body: loginFormData,
    });
    window.location = registerResponse.url;
  } catch (err) {
    console.log(err);
  }
});
