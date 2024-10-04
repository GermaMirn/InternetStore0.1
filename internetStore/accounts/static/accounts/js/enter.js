const buttonRegister = document.getElementById("buttonRegister");

buttonRegister.addEventListener("click", async function(event){
  event.preventDefault(); 

  const username = document.getElementById("username");
  const password = document.getElementById("password");

  const errorUsername = document.getElementById("errorUsername");
  const errorPassword = document.getElementById("errorPassword");

  if (username.value.length <= 0) {
    errorUsername.textContent = "введите имя пользователя";
    errorUsername.style.display = "block";
  } else {
    errorUsername.style.display = "none";
  }

  if (password.value.length <= 0) {
    errorPassword.textContent = "введите пароль";
    errorPassword.style.display = "block";
  } else {
    errorPassword.style.display = "none";
  }

  const response = await fetch(`enter/getUsernameAndPassword?username=${username.value}&password=${password.value}`, {
    method: 'GET',
    headers: {
        'X-CSRFToken': csrfToken,
    },
  });

  if (response.ok) {
    const result = await response.json();

    if (result.error) {
      if (result.error === "Имя пользователя не существует."){
        username.textContent = "";
        errorUsername.textContent = result.error;
        errorUsername.style.display = "block";
      } else {
        errorUsername.style.display = "none";
        errorPassword.textContent = result.error;
        errorPassword.style.display = "block";
        password.value = "";
      }
    } else {
      errorPassword.style.display = "none";
      window.location.href = 'http://127.0.0.1:8000/welcome';
    }
  } else {
    console.error("Ошибка сети: ", response.statusText);
  }
});