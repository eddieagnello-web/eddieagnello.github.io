// Wait for the HTML elements to finish loading before running script
document.addEventListener("DOMContentLoaded", () => {
  
  // Select HTML elements by their unique IDs
  const magicBtn = document.getElementById("magicBtn");
  const message = document.getElementById("message");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  // Listener for the magic button
  magicBtn.addEventListener("click", () => {
    message.textContent = "🎉 You clicked the button! Your JavaScript is working!";
  });

  // Listener for the Dark Mode Toggle button
  themeToggleBtn.addEventListener("click", () => {
    // Toggle the 'dark-mode' class on the document body tag
    document.body.classList.toggle("dark-mode");

    // Check if dark mode is currently active to update button label
    if (document.body.classList.contains("dark-mode")) {
      themeToggleBtn.textContent = "☀️ Switch to Light Mode";
    } else {
      themeToggleBtn.textContent = "🌙 Switch to Dark Mode";
    }
  });

});
