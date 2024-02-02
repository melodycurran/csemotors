
function styleJs() {
    let pwVisibilityBtn = document.querySelectorAll('.visibility-icon');
    let showPw = document.querySelector('#on');
    let hidePw = document.querySelector('#off');
    let pw = document.querySelector('#password');
    let visible = document.querySelector('#visibility');
    
    pwVisibilityBtn.forEach(el => {
        el.addEventListener('click', () => {
            if (pw.getAttribute('type') === 'password') {
                showPw.classList.replace('show-password', 'hide-password');
                hidePw.classList.replace('hide-password', 'show-password');
                pw.setAttribute('type', 'text');
            } else {
                showPw.classList.replace('hide-password', 'show-password');
                hidePw.classList.replace('show-password', 'hide-password');
                pw.setAttribute('type', 'password');
            }
        });
    })
    
}

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
            console.log(input.getAttribute("id"));
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


styleJs();
clientValidation();