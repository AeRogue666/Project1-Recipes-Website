/* Not-Found Links list */
const ulScreen = document.querySelector('#nflinkscreen');
const ulPhone = document.querySelector('#nflinkphone');
const windowInnerWidth = window.innerWidth; // Taille de la fenêtre qui affiche le contenu de la page Web (Viewport)
const windowInnerHeight = window.innerHeight;
const pageWidth = document.documentElement.clientWidth; // Taille de la page Web
const pageHeight = document.documentElement.clientHeight;

handleOpenList = () => {
    if(windowInnerWidth >= 1200) {
        ulPhone.classList.add('invisible');
        ulScreen.classList.remove('invisible');
        console.log('Screen resize');
    } else if(windowInnerWidth <= 900) {
        ulScreen.classList.add('invisible');
        ulPhone.classList.remove('invisible');
        console.log('Phone resize');
    }
};

window.onresize = handleOpenList();