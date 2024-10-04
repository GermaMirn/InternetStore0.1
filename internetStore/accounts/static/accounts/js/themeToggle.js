(function() {
  const toggleSwitch = document.getElementById('switch');

  function applyTheme(theme) {
    const buttons = document.querySelectorAll(".button");
    const panel = document.getElementById("divForButton");

    if (theme === "dark") {
      document.body.classList.add("darkTheme");
      document.body.classList.remove("lightTheme");
      buttons.forEach(button => {
        button.style.color = "black";
        button.style.backgroundColor = "white";
      });
      panel.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.6)";
    } else {
      document.body.classList.add("lightTheme");
      document.body.classList.remove("darkTheme");
      buttons.forEach(button => {
        button.style.color = "white";
        button.style.backgroundColor = "black";
      });
      panel.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.6)";
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    let theme = localStorage.getItem("theme") || "light";
    applyTheme(theme);
    toggleSwitch.checked = (theme === "dark");
  });

  toggleSwitch.addEventListener("click", function() {
    let newTheme = toggleSwitch.checked ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });
})();