const buttonRegister = document.getElementById("buttonRegister");
const errorText = document.querySelectorAll(".errorText");
const phoneRegex = /^(?:\+7|7|8)?[\s(]?(9\d{2})[\s)]?(\d{3})[-]?(\d{2})[-]?(\d{2})$/;
const fioRegex = /^(?:(?:([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+))([А-ЯЁ][а-яё]+|[A-Z][a-z]+)(?:\s+([А-ЯЁ][а-яё]+|[A-Z][a-z]+))?|([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+)([А-ЯЁ][а-яё]+|[A-Z][a-z]+))$/;

const currentUrl = window.location.href;
const isEditing = currentUrl.includes("editing=True");
var cinitialUsername = document.getElementById("cinitialUsername").value;

function validatePhoneNumber(phone) {
  return phoneRegex.test(phone);
}

function validateFIO(fio) {
  return fioRegex.test(fio);
}

buttonRegister.addEventListener("click", async function(event){
  event.preventDefault();

  if (!isEditing){
    var errorTextPassword = document.getElementById("errorTextPassword");
    var errorTextConfirmPassword = document.getElementById("errorTextConfirmPassword");
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirmPassword");
  }

  const fullname = document.getElementById("fullname");
  checkFullname = validateFIO(fullname.value);

  const phone = document.getElementById("phone");
  checkPhoneNumber = validatePhoneNumber(phone.value);

  const errorTextFullname = document.getElementById("errorTextFullname");
  const errorTextPhone = document.getElementById("errorTextPhone");
  const errorTextUsername = document.getElementById("errorTextUsername");

  const username = document.getElementById("username");

  if (username.value.length <= 0) {
    errorTextUsername.textContent = "введите имя пользователя";
    errorTextUsername.style.display = "block";
  } else {
    errorTextUsername.style.display = "none";
  }

  if (fullname.value.length < 2){
    errorTextFullname.style.display = "block";
    errorTextFullname.textContent = "введите ФИО";
  } else {
    if (checkFullname) {
      errorTextFullname.style.display = "none";
    } else {
      errorTextFullname.style.display = "block";
      errorTextFullname.textContent = "неправильный ФИО";
      fullname.value = "";
    }
  }

  if (phone.value.length <= 0){
    errorTextPhone.style.display = "block";
    errorTextPhone.textContent = "введите номер телефона";
  } else {
    if (checkPhoneNumber) {
      errorTextPhone.style.display = "none";
    } else {
      errorTextPhone.style.display = "block";
      errorTextPhone.textContent = "неправильный номер телефона";
      phone.value = "";
    }
  }

  if (!isEditing){
    if (password.value.length < 4){
      errorTextPassword.style.display = "block";
      errorTextPassword.textContent = "пароль должен быть длинее 4 символов";
      password.value = "";
  
    } else {
      if (password.value !== confirmPassword.value){
        errorTextPassword.style.display = "none";
        errorTextConfirmPassword.textContent = "пароль не совпал";
        errorTextConfirmPassword.style.display = "block";
        confirmPassword.value = "";
      } else {
        errorTextPassword.style.display = "none";
        errorTextConfirmPassword.style.display = "none";
      }
    }
  }

  if (cinitialUsername !== username.value){

    const response = await fetch(`/login/getUsername?username=${username.value}`, {
      method: 'GET',
      headers: {
          'X-CSRFToken': csrfToken,
      },
    });
  
    if (response.ok) {
      const result = await response.json();
  
      if (result.exists){
        errorTextUsername.textContent = "это имя уже занято";
        errorTextUsername.style.display = "block";
        username.value = "";
      } else {

      }
    } else {
      // вывести страницу что ведутся технические шоколадки
    }
  }
});