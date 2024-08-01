/* Login / Register Password Validation form */
const inputPwd = document.querySelector('#input-pwd');
const inputPwdConfirm = document.querySelector('#input-pwd-confirm');
const divPwd = document.querySelector('#invalidpwd');
const divPwdRepeat = document.querySelector('#invalidrepeat')
const pwdValidator = document.querySelector('#pwdvalidator');
const pwdRepeatValid = document.querySelector('#pwdrepeatvalid');
const pwdRepeatInvalid = document.querySelector('#pwdrepeatinvalid');


const inputFocus = (input, div) => {
    input.onfocus = () => {
        div.style.display = 'flex'
    };
    input.onblur = () => {
        div.style.display = 'none'
    };
}

const inputKeyUp = (input) => {
    input.onkeyup = () => {
        var regularExpressions = /^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\].{15,33}$/;
        const valueMatchValidator = (input, element) => {
            if(input.value.match(regularExpressions)) {
                element.classList.remove('invalid');
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
                element.classList.add('invalid');
            }
        };

        const valueMatchEachOther = (input1, input2, el1, el2) => {
            if(input1.value === input2.value) {
                el1.classList.remove('invisible');
                el2.classList.add('invisible');
            } else {
                el2.classList.remove('invisible');
                el1.classList.add('invisible');
            }
        }

        valueMatchValidator(inputPwd, pwdValidator)
        if(inputPwdConfirm) {
            valueMatchEachOther(inputPwd, inputPwdConfirm, pwdRepeatValid, pwdRepeatInvalid)
        }
        pseudoMatchValidator(inputPseudo, divPseudo);
    }
}

/* Login / Register Email Validation Form */
const inputEmail = document.querySelector('#input-email');
const divEmail = document.querySelector('#divmail');

const validateEmailKeyUp = (input) => {
    input.onkeyup = () => {
        var EmailRegEx = /^([a-zA-Z0-9_\-\.])+\@([a-zA-Z0-9_\-\.])+\.([a-zA-Z]{2,5})$/;
        if(EmailRegEx.test(input.value)){
            console.log('Valid email');
            divEmail.classList.add('invisible');
            return true
        }
        else {
            console.log("Invalid email address.");
            divEmail.classList.remove('invisible');
            return false
        }
    }
    input.onblur = () => {
        divEmail.classList.add('invisible');
    }
};

/* Login / Register Error Validation Form */
const errorContainer = document.querySelector('.login-error-container');

const errorDisplay = (input) => {
    input.onfocus = () => errorContainer.classList.add('invisible');
    errorContainer.classList.remove('invisible');
}

if(inputPwd && inputFocus(inputPwd, divPwd)) {inputKeyUp(inputPwd); errorDisplay(inputPwd);}
if(inputPwdConfirm && inputFocus(inputPwdConfirm, divPwdRepeat)) {inputKeyUp(inputPwdConfirm); errorDisplay(inputPwdConfirm);}
if(inputEmail && inputFocus(inputEmail, divEmail)) {validateEmailKeyUp(inputEmail); errorDisplay(inputEmail);}