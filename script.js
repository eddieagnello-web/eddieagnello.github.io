// Wait for the HTML document to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Feature 1: Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Check if the user has a saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️ Light Mode';
    }

    // Listen for clicks on the dark mode toggle button
    themeToggleBtn.addEventListener('click', () => {
        // Toggle the 'dark-mode' class on the body element
        document.body.classList.toggle('dark-mode');

        // Check if dark mode is currently active and update text/storage accordingly
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = '☀️ Light Mode';
            localStorage.setItem('theme', 'dark'); // Save preference
        } else {
            themeToggleBtn.textContent = '🌙 Dark Mode';
            localStorage.setItem('theme', 'light'); // Save preference
        }
    });


    // --- Feature 2: Random Background Color Button ---
    const colorBtn = document.getElementById('colorBtn');
    const colors = ['#f4f7f6', '#ffebef', '#e3f2fd', '#e8f5e9', '#fff3e0'];

    colorBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        // Only apply if not in dark mode to keep the dark theme intact
        if (!document.body.classList.contains('dark-mode')) {
            document.body.style.backgroundColor = colors[randomIndex];
        } else {
            console.log('Background color change skipped while in dark mode.');
        }
    });

});
