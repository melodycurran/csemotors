
function managePasswordVisibility() {
    let pwVisibilityBtn = document.querySelectorAll('.visibility-icon');
    let showPw = document.querySelector('#on');
    let hidePw = document.querySelector('#off');
    let pw = document.querySelector('#password');
    
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



managePasswordVisibility();
