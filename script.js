document.getElementById('enterCodeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    let secretCode = document.getElementById('secretCode').value;

    // Fetch the list of valid codes from the Gist
    fetch('https://gist.githubusercontent.com/im-umar/ba96e47bfa2f3dd0bdc22969f72bea87/raw/')
        .then(response => response.text())
        .then(data => {
            let validCodes = data.split('\n');

            // Check if the entered code is in the list of valid codes
            if (validCodes.includes(secretCode)) {
                // If the code is valid, redirect to the URL
                window.location.href = 'https://www.ishortn.ink/' + secretCode;
            } else {
                // If the code is not valid, display an error message and clear the input field
                alert('Invalid code. Please try again.');
                document.getElementById('secretCode').value = '';
            }
        });
});


