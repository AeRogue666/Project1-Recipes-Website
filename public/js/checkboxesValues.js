const form = document.getElementById('formcategoriesinput');
const checkboxes = document.getElementsByName('input'); //querySelectorAll('input[type="checkbox"]')
let checkedValues = [];
const getCheckedValues = JSON.parse(localStorage.getItem('checkedValues'));
// const removeCheckedValues = localStorage.removeItem('checkedValues');

const formTag = document.getElementById('formtags');
const tag = document.getElementsByName('tag');

let tagValue;
let tagList;

const saveCheckboxValues = () => {
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            console.log('Checkbox value: ', checkbox.value)
            checkedValues.push(checkbox.value);
        }
    });
    localStorage.setItem('checkedValues', JSON.stringify(checkedValues));
};

const loadCheckboxValues = () => {
    console.log('Checked values: ', getCheckedValues);
    if (getCheckedValues) {
        checkboxes.forEach(checkbox => {
            if (getCheckedValues.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
};
loadCheckboxValues();

const updateCheckboxValues = () => {
    // console.log('Tag: ', tag);
    tagValue = Array.from(tag);
    console.log('NodeList to Array: ', tagValue);
    for(var i=0; i < tagValue.length; i++) {
        var value = tagValue[i].value;
        console.log('Value: ', value);
    }
    const filterCheckboxes = getCheckedValues.filter(Boolean).filter(id => id !== value);
    console.log('Filter checkboxes: ', filterCheckboxes);
    checkedValues.push(value);
    console.log('Checked values: ', getCheckedValues);
};

updateCheckboxValues();

form.addEventListener('submit', () => {
    saveCheckboxValues();
});

/* formTag.addEventListener('submit', () => {
    removeCheckboxValues();
}); */

/* for(var i=0; i < tagValue.length; i++) {
    let value = tagValue[i].value;
    console.log('Value: ', value);
    const filterCheckboxes = getCheckedValues.filter(id => id !== value);
    console.log('Filter checkboxes: ', filterCheckboxes);
    // tagList.push(value);
}
console.log('TagList: ', tagList);

// localStorage.removeItem('checkedValues');
// localStorage.setItem('checkedValues', JSON.stringify(tagList));
console.log('Checked values: ', getCheckedValues);
// checkedValues.push(tagValue);
*/