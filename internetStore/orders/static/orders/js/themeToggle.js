(function() {
  const toggleSwitch = document.getElementById('switch');

  function applyTheme(theme, type) {
    if (theme === "light") {
      document.body.classList.add("lightTheme");
      document.body.classList.remove("darkTheme");

    } else {
      document.body.classList.add("darkTheme");
      document.body.classList.remove("lightTheme");
    }

    if (type === "orders") {
      let orderCard = document.querySelectorAll('.orderCard, .orderCardDark');
      let chatButton = document.querySelectorAll('.chatButton, .chatButtonDark');

      if (theme === "light") {
        if (orderCard){
          orderCard.forEach(name => {
            name.classList.remove("orderCardDark");
            name.classList.add("orderCard");
          });
        };

        if (chatButton){
          chatButton.forEach(name => {
            name.classList.remove("chatButtonDark");
            name.classList.add("chatButton");
          });
        };

      } else {

        if (orderCard){
          orderCard.forEach(name => {
            name.classList.remove("orderCard");
            name.classList.add("orderCardDark");
          });
        };

        if (chatButton){
          chatButton.forEach(name => {
            name.classList.remove("chatButton");
            name.classList.add("chatButtonDark");
          });
        };
      }
    }
  }

  function orders(theme) {
    applyTheme(theme, "orders");
  }

  document.addEventListener("DOMContentLoaded", function() {
      const nameOfPage = window.location.pathname;
      let theme = localStorage.getItem("theme") || "light";

      if (nameOfPage === "/orders") {
        orders(theme);
      }

      toggleSwitch.checked = (theme === "dark");
  });

  toggleSwitch.addEventListener("click", function() {
      const nameOfPage = window.location.pathname;
      let newTheme = toggleSwitch.checked ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      if (nameOfPage === "/orders") {
        orders(newTheme);
      }
  });
})();