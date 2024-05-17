document.addEventListener("DOMContentLoaded", function() {
    const formSteps = document.querySelectorAll('.form-step');
    const nextButton = document.getElementById('next-button');
    let currentStep = 0;

    // Hide all form steps except the first one
    formSteps.forEach((step, index) => {
        if (index !== currentStep) {
            step.style.display = 'none';
        }
    });

// Event listener for the next button
nextButton.addEventListener('click', function() {
    const currentInput = formSteps[currentStep].querySelector('input');
    const fieldName = currentInput.id === 'NAME' ? 'name' : 
                      currentInput.id === 'EMAIL' ? 'email address' : 
                      currentInput.id === 'CODE' ? 'secret code' : '';
    if (!validateInput(currentInput, fieldName)) {
        return;
    }

    // Hide the current step
    formSteps[currentStep].style.display = 'none';

    // Show the next step if available
    if (currentStep < formSteps.length - 1) {
        currentStep++;
        formSteps[currentStep].style.display = 'block';

        // Change button text to "Submit" if the next step is the last one
        if (currentStep === formSteps.length - 1) {
            nextButton.textContent = "Submit";
        }
    } else {
        // If on the last step, perform form submission
        validateForm();
        formSteps[currentStep].style.display = 'block';
    }
});


    // Event listener to focus on input field when invalid code alert is closed
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const codeInput = document.getElementById('CODE');
            if (codeInput) {
                codeInput.focus();
            }
        }
    });

    // Function to validate an input field
    function validateInput(input, fieldName) {
        const trimmedValue = input.value.trim();
        if (!trimmedValue) {
            alert(`Please enter your ${fieldName}.`);
            return false;
        } else if (input.id === 'EMAIL' && !validateEmail(trimmedValue)) {
            alert('Please enter a valid email address.');
            input.value = ''; // Clear the email input field
            return false;
        }
        return true;
    }

    // Function to validate email format
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // Function to validate the form before submission
    function validateForm() {
        const name = document.getElementById('NAME').value.trim();
        const email = document.getElementById('EMAIL').value.trim();
        const code = document.getElementById('CODE').value.trim();

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        fetch('https://gist.githubusercontent.com/im-umar/ba96e47bfa2f3dd0bdc22969f72bea87/raw/')
            .then(response => response.text())
            .then(data => {
                const validCodes = data.split('\n');
                if (!validCodes.includes(code)) {
                    handleInvalidCodePopup(); // Handle invalid code popup
                } else {
                    // If all validations pass, submit the form data to Brevo
                    let formData = new FormData();
                    formData.append('NAME', capitalizeFirstLetter(name));
                    formData.append('EMAIL', email);

                    fetch('https://fc17af9f.sibforms.com/serve/MUIFAJrCl1rqwbvqTuDl1_SHLR6vl0oCI77i0ACJidsDAtxiA7LX6zTxucsOjHtc0RbeeeQilSqKzgPCMkJrcrPuuQTG_CsTUQsqZfH1t4n37YXEfTkO4Qin2o-Yb5RkDMJ0ZchoztnZqajCFloSyfDZ-E0TnNnznjp1aHd0V8bwEANogygfddtJFECq_NmxwSl9uMCLdAE4iJ7U', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            // If the submission is successful, redirect the user to the secret URL
                            window.location.href = 'https://www.ishortn.ink/' + code;
                        } 
                    })

                }
            })
            .catch(error => {
                console.error('Error fetching valid codes:', error);
                alert('Error validating the code. Please try again later.');
            });
    }

    // Function to handle invalid code popup
    function handleInvalidCodePopup() {
        alert('Invalid code. Please try again.');
        document.getElementById('CODE').value = ''; // Clear the input field
        const codeInput = document.getElementById('CODE');
        if (codeInput) {
            codeInput.focus(); // Focus on the code input field after dismissing the popup
        }
    }

    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
});

document.getElementById('sib-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    let name = document.getElementById('NAME').value.trim();
    let email = document.getElementById('EMAIL').value.trim();
    let secretCode = document.getElementById('CODE').value.trim();

    // Check if name, email, or code is blank and display appropriate error message
    if (!name) {
        alert('Please enter your name.');
        return; // Stop further execution
    } else if (!email) {
        alert('Please enter your email address.');
        return; // Stop further execution
    } else if (!secretCode) {
        alert('Please enter the secret code.');
        return; // Stop further execution
    }

    // Capitalize the first letter of the name
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Validate the email format using regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return; // Stop further execution
    }

    try {
        // Fetch the list of valid codes from the Gist
        const response = await fetch('https://gist.githubusercontent.com/im-umar/ba96e47bfa2f3dd0bdc22969f72bea87/raw/');
        const data = await response.text();
        const validCodes = data.split('\n');

        // Check if the entered code is in the list of valid codes
        if (validCodes.includes(secretCode)) {
            // If the code is valid, submit the form data to Brevo
            let formData = new FormData();
            formData.append('NAME', name);
            formData.append('EMAIL', email);

            // Submit the form data to Brevo
            fetch('https://fc17af9f.sibforms.com/serve/MUIFAJrCl1rqwbvqTuDl1_SHLR6vl0oCI77i0ACJidsDAtxiA7LX6zTxucsOjHtc0RbeeeQilSqKzgPCMkJrcrPuuQTG_CsTUQsqZfH1t4n37YXEfTkO4Qin2o-Yb5RkDMJ0ZchoztnZqajCFloSyfDZ-E0TnNnznjp1aHd0V8bwEANogygfddtJFECq_NmxwSl9uMCLdAE4iJ7U', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // If the submission is successful, redirect the user to the secret URL
                    window.location.href = 'https://www.ishortn.ink/' + secretCode;
                } else {
                    // If there's an error with the submission, redirect the user to the secret URL
                    window.location.href = 'https://www.ishortn.ink/' + secretCode;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // If there's an error with the fetch request, redirect the user to the secret URL
                window.location.href = 'https://www.ishortn.ink/' + secretCode;
            });
        }
    } catch (error) {
        console.error('Error fetching valid codes:', error);
        // Log any errors that occur during the fetch request
    }
});

