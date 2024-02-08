function clientValidation() {
    let registerBtn = document.querySelector('#register-btn');
    let inputs = document.querySelectorAll('.form-input');

    registerBtn.addEventListener('click', () => {
        inputs.forEach(el => {
            let id = el.getAttribute("id");
            let inputEl = document.querySelector(`#${id}`);
            validateInputs(inputEl);
        })
    })

    function validateInputs(input) {
        let validation = input.parentElement;
        if (input.value === "") {
            validation.className = 'form-validation invalid'
        } else {
            validation.className = 'form-validation valid'
            if (input.getAttribute("id") === "password") {
                let isMatched = validatePassword(input.value);
                if (!isMatched) validation.className = 'form-validation invalid';
            }      
        }
    }

    function validatePassword(pw) {
        const regex = new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$');
        return regex.test(pw);
    }
}

function noticeControl() {
    let liMsg = document.querySelectorAll('.notice > *');
    liMsg.forEach(li => {
        li.firstElementChild.addEventListener('click', () => {
            li.style.display = 'none';
        });
    })
}

clientValidation();
noticeControl();
