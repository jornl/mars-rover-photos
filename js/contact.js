
const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const messageError = document.querySelector("#message-error");

const charCount = document.querySelector("#form-info");

function updateCharacterCount() {
    charCount.innerHTML = messageInput.value.length+1;

    if (messageInput.value.length === 0) {
        charCount.innerHTML = 0
    }
}

messageInput.addEventListener("keydown", updateCharacterCount);

function validateEmail(email) {
    return RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);
}

function validateLength(elementValue, allowedLength=1) {
    if (elementValue.length < allowedLength) {
        return false;
    }

    return true;
}

function submitForm(event) {

    event.preventDefault();

    const validName = validateLength(nameInput.value.trim());
    const validEmail = validateEmail(emailInput.value);
    const validMessage = validateLength(messageInput.value.trim(), 10);

    nameError.style.display = validName ? 'none' : 'block';
    emailError.style.display = validEmail ? 'none' : 'block';
    messageError.style.display = validMessage ? 'none' : 'block';

    if (validName && validEmail && validMessage) {
        formMessage.innerHTML = flash("Successfully submitted the form.");
        setTimeout(() => {
            formMessage.innerHTML = "";
        }, 2000);
        
        contactForm.reset();
        updateCharacterCount();
        return true;
    }


}

contactForm.addEventListener("submit", submitForm);
