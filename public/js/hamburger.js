/* Textarea Create Recipe */
const tx = document.getElementsByTagName("textarea");
const max = tx.maxlength;

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + "px";
}
function countCharLimit() {
    // console.log(this.value.length + ' caractères');
    if(this.value.length >= max) console.log('Limite atteinte'); this.value = this.value.substring(0, max);
}

if(tx) {
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;");
        tx[i].addEventListener("input", OnInput, false);
        tx[i].addEventListener("input", countCharLimit, false);
    }
}
/* All Buttons Manager */
const allButtons = document.getElementsByTagName('button');
let toggle = false;
const IconBtnManager = document.querySelector('#iconmanager');
const allButtonsList = [
    {id:'navburgerbtn', menu:'menu-container', blury:''},
    {id:'btnfilter', menu:'formcategoriesinput', blury:'bluryWrapper'},
    {id:'panelburger', menu:'burgercontainer', blury:'panelBluryWrapper'},
    {id:'managerburgerbtn', menu:'managerburger', blury:'managerBluryWrapper'},
    {id:'manager-filter-btn', menu:'manager-filter-form', blury:'formBluryWrapper'},
    {id:'updatestatusbtn', menu:'updatestatuscontainer', blury:''},
    {id:'updaterolebtn', menu:'updaterolecontainer', blury:''},
    {id:'permsbtn', menu:'permsarticle', blury:''},
    {id:'usersbtn', menu:'usersarticle', blury:''},
    {id:'btnsettings', menu:'settingscontainer', blury:'settingBluryWrapper'},
    {id:'btninfos', menu:'infos-container', blury:''},
    {id:'btnparams', menu:'params-container', blury:''},
    {id:'btnusers', menu:'users-container', blury:''},
    {id:'btnselectusers', menu:'allusers-container', blury:''},
    {id:'panelbtn', menu:'paneluser-container', blury:'managerBluryWrapper'},
    {id:'recipe-tool-btn', menu:'recipe-tool-container', blury:''},
    {id:'recipe-ingredient-btn', menu:'recipe-ingredient-container', blury:''},
    {id:'selectuserbtn', menu:'selectusercontainer', blury:''},
    {id:'selectrecipebtn', menu:'selectrecipecontainer', blury:''},
];
const ArrayButtons = Array.from(allButtons);
let i = 0;

const ticketInfosContainer = document.querySelector('#infos-container'), ticketParamsContainer = document.querySelector('#params-container'), ticketUsersContainer = document.querySelector('#users-container');
const ticketUsersContainerBody = document.querySelector('#users-container-body'), ticketAllUsersContainer = document.querySelector('#allusers-container'), ticketAllUsersListContainer = document.querySelector('#allusers-list');
ArrayButtons.map(content => {
    const filter = allButtonsList.filter(element => element.id == content.id)[0];
    if(typeof filter !== 'undefined') {
        content.addEventListener('click', () => {
            const buttonMenu = document.getElementById(filter.menu);
            const button = document.getElementById(filter.id);
            const btnMenuWrapper = document.getElementById(filter.blury);
            toggle = !toggle;
            buttonMenu.classList.toggle('opened');
            button.setAttribute('aria-pressed', toggle);
            if(btnMenuWrapper) {
                btnMenuWrapper.classList.toggle('opened');
                btnMenuWrapper.addEventListener('click', () => {
                    toggle = !toggle;
                    buttonMenu.classList.remove('opened');
                    button.setAttribute('aria-pressed', toggle);
                    btnMenuWrapper.classList.remove('opened');
                });
            }
            if(filter.id === 'managerburgerbtn') {
                let ico = IconBtnManager;
                if(ico.classList.contains('fa-chevron-down')) {
                    ico.classList.remove('fa-chevron-down');
                    ico.classList.add('fa-chevron-up');
                } else {
                    ico.classList.remove('fa-chevron-up');
                    ico.classList.add('fa-chevron-down');
                }
           } else if(filter.id === 'btninfos') {
            ticketParamsContainer.classList.remove('opened'), ticketUsersContainer.classList.remove('opened'), ticketUsersContainerBody.classList.remove('opened'), ticketAllUsersContainer.classList.remove('opened');
           } else if(filter.id === 'btnparams') {
            ticketInfosContainer.classList.remove('opened'), ticketUsersContainer.classList.remove('opened'), ticketUsersContainerBody.classList.remove('opened'), ticketAllUsersContainer.classList.remove('opened');
           } else if(filter.id === 'btnusers') {
            ticketInfosContainer.classList.remove('opened'), ticketParamsContainer.classList.remove('opened'), ticketAllUsersContainer.classList.remove('opened');
           } else if(filter.id === 'btnselectusers') {
            ticketInfosContainer.classList.remove('opened'), ticketParamsContainer.classList.remove('opened'), ticketUsersContainerBody.classList.remove('opened');
            ticketAllUsersContainer.classList.toggle('invisible'), ticketUsersContainerBody.classList.toggle('invisible'), ticketAllUsersListContainer.classList.toggle('invisible');
           }
        });
    }
});
/* Ticket Settings */
const btnLevel = document.querySelectorAll('[name="level"]');
const btnType = document.querySelectorAll('[name="type"]');
const btnStatus = document.querySelectorAll('[name="status"]');
const btnClickHandler = (btn) => {
    for(const button of btn) {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
        })
    }
}
btnClickHandler(btnLevel), btnClickHandler(btnType), btnClickHandler(btnStatus);
/* Ticket Message Buttons */
const ticketMessage = document.querySelectorAll('[class="recipe-author margintopbtm"]');
const btnMessageContainer = document.querySelectorAll('[class="ticket-btn-message-container"]');
const ticketMessageHandler = (ticket, container) => {
    for(let i = 0; i < ticket.length; i++) {
        const message = ticket[i];
        message.addEventListener('mouseover', () => {container[i].classList.add('opened')});
        message.addEventListener('mouseout', () => {container[i].classList.remove('opened')});
    }
};
ticketMessageHandler(ticketMessage, btnMessageContainer);
/* Recipe page */
const increaseBtn = document.querySelector('#data-increase'), decreaseBtn = document.querySelector('#data-decrease'), valueInput = document.querySelector('#people');
function decrease() {
	if(valueCount > 1) {
        valueCount = valueInput.value, valueCount--;
        valueInput.value = valueCount;
        valueChange();
	}
}
function increase() {
	if(valueCount < 24) {
        valueCount = valueInput.value, valueCount++;
        valueInput.value = valueCount;
        valueChange();
	}
}
function valueChange() {
	if(valueCount == undefined || isNaN(valueCount) == true || valueCount <= 0) {
		valueCount = 1;
	} else if(valueCount >= 25) {
		valueCount = 24;
	}
}
if(increaseBtn && decreaseBtn && valueInput) {
    var valueCount = valueInput.value;
    increaseBtn.addEventListener('click', increase), decreaseBtn.addEventListener('click', decrease);
}