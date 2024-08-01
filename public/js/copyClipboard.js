// Copy clipboard function
document.addEventListener('click', e => {
    if (e.target.matches('[name="copy-text"]')) {
        navigator.clipboard.writeText(e.target.textContent).then(() => console.log('copied text: ', e.target.textContent), error => console.error('failed to copy', error));
    }
});