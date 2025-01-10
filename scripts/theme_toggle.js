  // Get the theme toggle button
  const themeToggle = document.getElementById('theme-toggle');

  // Add an event listener to toggle the theme
  themeToggle.addEventListener('click', () => {
    // Toggle the "dark-mode" class on the body
    document.body.classList.toggle('dark-mode');

    // Update the button text based on the current mode
    if (document.body.classList.contains('dark-mode')) {
      themeToggle.textContent = 'Switch to Light Mode';
    } else {
      themeToggle.textContent = 'Switch to Dark Mode';
    }
  });
