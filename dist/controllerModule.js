export function isObjEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export function isString(value) { // On vérifie si la valeur retournée est bien un string et pas un array
    return typeof value === 'string' || value instanceof String
}

export function filterCategories(arr,min,max) {
    return arr.filter((category) => category.id > min && category.id < max);
};

export function compareValues(array1, array2) {
    return array2.includes(array1)
};
export const apiErrorManager = async(url, array) => {
    return await Promise.all(
        array.map(content => {
            return fetch(`${url}/items/errorlist?search=${content.code}`).then(response => response.json()).then(result => result.data)
        })
    ).then(data => {
        data = data.flatMap(element => element).flat(1);
        array = [];
        if(isObjEmpty(data) == false || data !== '') {
            data.map(content => {
                return array.push({code: content.code, reason: 'Une erreur est survenue', real_reason: content.reason})
            })
        } else {
            data.map(content => {
                return array.push({content, reason: 'Une erreur est survenue'})
            })
        }
        return array
    });
};

export const flatErrorResult = async(url, array) => {
    return await Promise.all(
        array.map(content => content.extensions)
    ).then(content => {
        return apiErrorManager(url, content)
    });
};

export const filterPanelBtn = (array, min, max) => {
    return array.filter(panel => panel.id >= min && panel.id <= max);
};

/* Panel Modules */
export const getUserCreatedValues = async(url, array, token) => {
    return await Promise.all(array.map(user => fetch(`${url}/users/${user.user_created}?fields=id,first_name,last_name,avatar,pseudonyme,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + token}}).then(response => response.json()).then(result => result.data))
)};
export const getUserUpdatedValues = async(url, array, token) => {
    return await Promise.all(array.map(user => fetch(`${url}/users/${user.user_updated}?fields=id,first_name,last_name,avatar,pseudonyme,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + token}}).then(response => response.json()).then(result => result.data))
)};
export const getRoleValues = async(url, array, token) => {
    return await Promise.all(array.map(role => fetch(`${url}/roles/${role.role}?fields=id,name,color`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + token}}).then(response => response.json()).then(result => result.data))
)};
export const fetchAllMessages = async(url, array, token) => {
    return await Promise.all(array[0].messages_id.map(message => fetch(`${url}/items/ticket_messages/${message}?fields=id,content,date_created,date_updated,user_id,ticket_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + token}}).then(response => response.json()).then(result => result.data))
)};
export const getMessageAuthorValues = async(url, array, token) => {
    return await Promise.all(array.map(user => fetch(`${url}/users/${user.user_id}?fields=first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + token}}).then(response => response.json()).then(result => result.data))
)};
export const compareTicketValues = (array, statusArray, typeArray, problemList) => {
    array.map(value => {
        const statusFilter = problemList.filter(status => status.value == value.status).map(content => {return content.status}).reduce((acc, value) => acc + value), colorFilter = problemList.filter(status => status.value == value.status).map(content => {return content.color}).reduce((acc, value) => acc + value), typeFilter = problemList.filter(type => type.type == value.problemType).map(content => {return content.typevalue}).reduce((acc, value) => acc + value);
        return statusArray.push({status: statusFilter, color: colorFilter}), typeArray.push({value: typeFilter})
    });
};
export const noAlphaNum = (string) => {
    return new RegExp(/^[0-9]+$/i).test(string)
};
/* Profile Update Modules */
export const postProfileImage = async(url, token, fileUrl, imageType, imageValue, pseudonyme) => {
    return await fetch(`${url}/files/import`, {method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + token,'Content-type': 'application/json','Accept': 'application/json'},
        body: JSON.stringify({'url': fileUrl, 'data': {title:'Image de profil de ' + pseudonyme, description:'Image de profil de ' + pseudonyme, type: imageType, filename_download:'profile-image-' + pseudonyme + '.' + imageValue}})
    }) //.then(response => response.json()).then(result => result.data)
};
export const deleteProfileImage = async(url, token, fileID) => {
    return await fetch(`${url}/files/${fileID}`, {method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + token,'Content-type': 'application/json','Accept': 'application/json'}})
};
export function hasNumber(myString) {return /\d/.test(myString)};
export const replaceNumber = (array, final, peopleNb) => {
    let nb = [], text = [], splitTextList = [];
    array.map(value => {
        let matches = value.match(/\d+([.,]\d+)?/gi), splitText = value.split(/\b(?<!\d)\d+(![.,]\d+)?/gmi);
        if(matches) {
            let number = matches;
            number = number.flatMap(e => e).flat(1); number = number.filter( Boolean ); number = number[0];
            if(number !== ' ' && Number(number)) nb.push({value: number * peopleNb});
            splitText = splitText.filter(Boolean).filter(value => value !== '.');
            splitTextList.push({value: splitText});
        } else {
            nb.push({value: ''});
            splitTextList.push({value: value});
        }
    });

    if(nb !== null) splitTextList.map((content,i) => {if(content.value !== '' && typeof nb[i].value == 'number') {text.push(Math.round(nb[i].value *2)/2 + content.value)} else {text.push(nb[i].value + content.value)}});
    return text.map(value => {return final.push(value.replace(/,/g, ''))});
};
export const divideNumber = (array, final, peopleNb) => {
    let nb = [], text = [], splitTextList = [];
    array.map(value => {
        let matches = value.match(/\d+([.,]\d+(g|ml|cl|\s))?/gi), splitText = value.split(/\b(?<!\d)\d+(![.,]\d+)?/gmi); // let matches = value.match(/[0-9]+(g|ml|cl|\s)+/gi), splitText = value.split(/\b(?![A-Za-z])\d+([.,]\d+)?/gmi); // \b(?<![A-Za-z])\d+([.,]\d+)?
        if(matches) {
            let number = matches; // matches.map(value => {return value.split(/(g|ml|cl|\s)+/)});
            number = number.flatMap(e => e).flat(1); number = number.filter( Boolean ); number = number[0];
            if(number !== ' ' && Number(number)) nb.push({value: number / peopleNb});
            splitTextList.push({value: splitText.filter(Boolean).reduce((acc,value) => acc + value)});
        } else {
            nb.push({value: ''});
            splitTextList.push({value: value});
        }
    });
    
    if(nb !== null) splitTextList.map((content,i) => {if(content.value !== '' && nb[i].value !== '') text.push(Math.round(nb[i].value *2)/2 + content.value); else if(content.value !== '' && nb[i].value == '') text.push(nb[i].value + content.value)});
    return text.map(value => {return final.push(value.replace(/,/g, ''))});
};