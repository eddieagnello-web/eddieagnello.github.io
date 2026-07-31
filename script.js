// Wait for the HTML document to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Grab the button element from our HTML using its ID
    const colorBtn = document.getElementById('colorBtn');

    // Define an array of fun background colors
    const colors = ['#f4f7f6', '#ffebef', '#e3f2fd', '#e8f5e9', '#fff3e0'];

    // Add an event listener to listen for a 'click' on the button
    colorBtn.addEventListener('click', () => {
        // Generate a random index number based on the colors array length
        const randomIndex = Math.floor(Math.random() * colors.length);
        
        // Change the body background color to the randomly selected color
        document.body.style.backgroundColor = colors[randomIndex];
        
        // Console log a message for debugging purposes
        console.log('Background color changed dynamically via JavaScript!');
    });

});
