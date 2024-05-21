document.addEventListener("DOMContentLoaded", function() {
    const formSteps = document.querySelectorAll('.form-step');
    const nextNameButton = document.getElementById('next-name');
    const nextEmailButton = document.getElementById('next-email');
    const nextCodeButton = document.getElementById('next-code');
    let currentStep = 0;

    function showNextButton() {
        nextNameButton.style.display = currentStep === 0 ? 'block' : 'none';
        nextEmailButton.style.display = currentStep === 1 ? 'block' : 'none';
        nextCodeButton.style.display = currentStep === 2 ? 'block' : 'none';
    }

    function checkLocalStorage() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            if (userData.name) {
                document.getElementById('NAME').value = userData.name;
            }
            if (userData.email) {
                document.getElementById('EMAIL').value = userData.email;
            }
            currentStep = 2;
        }

        formSteps.forEach((step, index) => {
            step.style.display = index === currentStep ? 'block' : 'none';
        });

        showNextButton();

        const currentInput = formSteps[currentStep].querySelector('input');
        if (currentInput) {
            currentInput.focus();
        }
    }

    function goToNextStep() {
        formSteps[currentStep].style.display = 'none';
        currentStep++;
        if (currentStep < formSteps.length) {
            formSteps[currentStep].style.display = 'block';
            const nextInput = formSteps[currentStep].querySelector('input');
            if (nextInput) {
                nextInput.focus();
            }
        }
        showNextButton();
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    nextNameButton.addEventListener('click', function() {
        const currentInput = formSteps[currentStep].querySelector('input');
        const fieldName = currentInput.id === 'NAME' ? 'name' : '';
        currentInput.value = capitalizeFirstLetter(currentInput.value);
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
        const fieldName = currentInput.id === 'CODE' ? 'discount code' : '';
        if (!validateInput(currentInput, fieldName)) {
            return;
        }

        validateForm();
    });

    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (currentStep === 0) {
                nextNameButton.click();
            } else if (currentStep === 1) {
                nextEmailButton.click();
            } else if (currentStep === 2) {
                nextCodeButton.click();
            }
        }
    });

    // Prevent space bar in input fields
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === ' ') {
                event.preventDefault();
                // input.classList.add('error');
                // input.placeholder = 'Spaces are not allowed';
            } else {
                input.classList.remove('error');
                if (input.id === 'NAME') {
                    input.placeholder = 'Your Name';
                } else if (input.id === 'EMAIL') {
                    input.placeholder = 'Your Email Address';
                } else if (input.id === 'CODE') {
                    input.placeholder = 'Enter Code';
                }
            }
        });

        input.addEventListener('input', function(event) {
            if (input.value.includes(' ')) {
                // input.classList.add('error');
                // input.placeholder = 'Spaces are not allowed';
                input.value = input.value.replace(/\s+/g, '');
            }
        });
    });

    // Add an event listener for the 'pageshow' event
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload();
        } else {
            checkLocalStorage();
        }
    });

    function validateInput(input, fieldName) {
        const trimmedValue = input.value.trim();
        if (!trimmedValue || trimmedValue.includes(' ')) {
            input.placeholder = `Please enter your ${fieldName}`;
            input.classList.add('error');
            return false;
        } else if (input.id === 'NAME' && !/^[a-zA-Z]{2,}(?: [a-zA-Z]{2,})?$/.test(trimmedValue)) {
            input.placeholder = 'Please enter a valid name';
            input.value = '';
            input.classList.add('error');
            input.focus();
            return false;
        } else if (input.id === 'EMAIL' && !validateEmail(trimmedValue)) {
            input.placeholder = 'Please enter a valid email address';
            input.value = '';
            input.classList.add('error');
            input.focus();
            return false;
        }
        input.classList.remove('error');
        return true;
    }

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function resetInputFields() {
        document.getElementById('NAME').placeholder = 'Your Name';
        document.getElementById('EMAIL').placeholder = 'Your Email Address';
        resetCodeInputField();
    }

    function resetCodeInputField() {
        const codeInput = document.getElementById('CODE');
        codeInput.placeholder = 'Enter Code';
        codeInput.classList.remove('success', 'error');
        codeInput.value = '';
    }

    async function validateForm() {
        const name = document.getElementById('NAME').value.trim();
        const email = document.getElementById('EMAIL').value.trim();
        const codeInput = document.getElementById('CODE');
        const code = codeInput.value.trim();

        if (!validateEmail(email)) {
            return;
        }

        try {
            const response = await fetch('https://gist.githubusercontent.com/pixelpyro/ba96e47bfa2f3dd0bdc22969f72bea87/raw/');
            const data = await response.text();
            const validCodes = data.split('\n');

            if (validCodes.includes(code)) {
                const formData = new FormData();
                formData.append('NAME', name);
                formData.append('EMAIL', email);
                formData.append('CODE', code);

                codeInput.classList.add('success');
                // Add a transition class to enable CSS transitions
                codeInput.classList.add('transition');

                // Set placeholder and value after a short delay to allow transition effect
                setTimeout(() => {
                    codeInput.placeholder = 'Success, Redirecting you...';
                    codeInput.value = '';

                    // Remove focus from the input field
                    codeInput.blur();

                    // Reset fields just before redirecting
                    setTimeout(() => {
                        document.activeElement.blur();
                        window.location.href = 'https://www.ishortn.ink/' + code;
                    }, 1000); // Adjust the delay as needed
                }, 0); // Adjust the delay as needed

                // Submit the form data to Brevo
                fetch('https://fc17af9f.sibforms.com/serve/MUIFAJrCl1rqwbvqTuDl1_SHLR6vl0oCI77i0ACJidsDAtxiA7LX6zTxucsOjHtc0RbeeeQilSqKzgPCMkJrcrPuuQTG_CsTUQsqZfH1t4n37YXEfTkO4Qin2o-Yb5RkDMJ0ZchoztnZqajCFloSyfDZ-E0TnNnznjp1aHd0V8bwEANogygfddtJFECq_NmxwSl9uMCLdAE4iJ7U', {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Set mode to 'no-cors' to disable CORS
                })
                .then(response => {
                    if (!response.ok) {
                        console.error('Error:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

                const userData = { name, email };
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                handleInvalidCodeInput();
            }
        } catch (error) {
            console.error('Error fetching valid codes:', error);
        }
    }

    function handleInvalidCodeInput() {
        const codeInput = document.getElementById('CODE');
        codeInput.placeholder = 'Invalid code, Please try again';
        codeInput.value = '';
        codeInput.classList.add('error');
        codeInput.focus();
    }

    checkLocalStorage();
});
