document.addEventListener("DOMContentLoaded", function() {
    const formSteps = document.querySelectorAll('.form-step');
    const nextNameButton = document.getElementById('next-name');
    const nextEmailButton = document.getElementById('next-email');
    const nextCodeButton = document.getElementById('next-code');
    let currentStep = 0;

    // Hide all form steps except the first one
    formSteps.forEach((step, index) => {
        if (index !== currentStep) {
            step.style.display = 'none';
        }
    });

    // Function to show the appropriate next button based on the current step
    function showNextButton() {
        nextNameButton.style.display = currentStep === 0 ? 'block' : 'none';
        nextEmailButton.style.display = currentStep === 1 ? 'block' : 'none';
        nextCodeButton.style.display = currentStep === 2 ? 'block' : 'none';
    }

    // Initial focus on the first input field
    formSteps[currentStep].querySelector('input').focus();
    showNextButton();

    // Function to handle form step transitions
    function goToNextStep() {
        // Hide the current step
        formSteps[currentStep].style.display = 'none';

        // Show the next step if available
        currentStep++;
        if (currentStep < formSteps.length) {
            formSteps[currentStep].style.display = 'block';

            // Focus on the next input field
            const nextInput = formSteps[currentStep].querySelector('input');
            if (nextInput) {
                nextInput.focus();
            }
        }

        // Show the appropriate button
        showNextButton();
    }

    // Event listener for the next buttons
    nextNameButton.addEventListener('click', function() {
        const currentInput = formSteps[currentStep].querySelector('input');
        const fieldName = currentInput.id === 'NAME' ? 'name' : '';
        if (!validateInput(currentInput, fieldName)) {
            return;
        }

        goToNextStep();
    });

    nextEmailButton.addEventListener('click', function() {
        const currentInput = formSteps[currentStep].querySelector('input');
        const fieldName = currentInput.id === 'EMAIL' ? 'email address' : '';
        if (!validateInput(currentInput, fieldName)) {
            return;
        }

        goToNextStep();
    });

    nextCodeButton.addEventListener('click', function() {
        const currentInput = formSteps[currentStep].querySelector('input');
        const fieldName = currentInput.id === 'CODE' ? 'secret code' : '';
        if (!validateInput(currentInput, fieldName)) {
            return;
        }

        validateForm();
    });

    // Event listener for Enter key press
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission

            if (currentStep === 0) {
                nextNameButton.click();
            } else if (currentStep === 1) {
                nextEmailButton.click();
            } else if (currentStep === 2) {
                nextCodeButton.click();
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
            input.focus();
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
    async function validateForm() {
        const name = document.getElementById('NAME').value.trim();
        const email = document.getElementById('EMAIL').value.trim();
        const code = document.getElementById('CODE').value.trim();

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            // Fetch the list of valid codes from the Gist
            const response = await fetch('https://gist.githubusercontent.com/im-umar/ba96e47bfa2f3dd0bdc22969f72bea87/raw/');
            const data = await response.text();
            const validCodes = data.split('\n');

            // Check if the entered code is in the list of valid codes
            if (validCodes.includes(code)) {
                // If the code is valid, submit the form data to Brevo
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
                    } else {
                        // If there's an error with the submission, redirect the user to the secret URL
                        window.location.href = 'https://www.ishortn.ink/' + code;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // If there's an error with the fetch request, redirect the user to the secret URL
                    window.location.href = 'https://www.ishortn.ink/' + code;
                });
            } else {
                handleInvalidCodePopup(); // Handle invalid code popup
            }
        } catch (error) {
            console.error('Error fetching valid codes:', error);
            alert('Error validating the code. Please try again later.');
        }
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
