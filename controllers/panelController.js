/* import dotenv from "dotenv";
dotenv.config(); // Not needed anymore (from Node.JS 20+) */
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import { isObjEmpty, isString, filterCategories, filterPanelBtn, compareValues, getUserCreatedValues, getUserUpdatedValues, getRoleValues, fetchAllMessages, getMessageAuthorValues, compareTicketValues, noAlphaNum, deleteProfileImage, postProfileImage, hasNumber, replaceNumber, divideNumber } from '../dist/controllerModule.js';
import { panelBtnList, recipeBtnList, supportBtnList, adminBtnList, rolesBtnList, formValueList, recipeFormTypeList, recipeFormTextareaList, ticketSettingsList, colorful, problemList, statusTypeList, ticketFormTypeList, ticketFormTextareaList, ticketFormProblemLevelList, ticketFormProblemTypeList, rolesValueList, rolesFormList, actionsList, collectionsList, fieldsList, datesContentList, sortList, sortDropdownList, sortPanelList, ticketInformationsList } from '../dist/controllerArrayList.js';
import store from 'store2';

const ApiUrl = process.env.API_URL;
let userBtn = [], authorBtn = [], adminBtn = [];
let Recipes = [], recipeStatusValue = [], recipeDateValues = [], recipeDate = [], userHeaderProfile = [], userStatusValue = [];
const checkRoleValue = (role, array) => {
    const roleList = [
        {id:1, name:process.env.USER_ROLE, min:1, max:3},
        {id:2, name:process.env.AUTHOR_ROLE, min:1, max:6},
        {id:3, name:process.env.ADMIN_ROLE, min:1, max:9}
    ];
    return roleList.filter(value => value.name == role).map(value => {
        const filter = filterPanelBtn(array, value.min, value.max).flat(1);
        return value.max == 3 ? userBtn = filter : value.max == 6 ? authorBtn = filter : value.max == 9 ? adminBtn = filter : console.log('Le rôle ne correspond a aucune valeur connue')
    }).flat(1);
};
let managerBtnList = [];
const filterObjectStatus = (arrayList, array, statusID, array2) => {
    const statusKeys = [{status:'published',data:[{date_published: dateNow}]},{status:'archived',data:[{date_archived: dateNow}]},{status:'cancelled',data:[{date_cancelled: dateNow}]}];
    return arrayList.filter(content => content.value == statusID).map(content => {
        if(array2) array2.push({value: content.value, status: content.status, color: content.color});
        statusKeys.filter(value => value.status == content.value).map(content => {return array.push(content.data)});
    });
};
const formatDateValues = (array1, array2) => {
    datesContentList.map((dates,j) => {
        if(typeof array1[j] !== 'undefined') {
            Object.keys(array1[j]).map((content,i) => {
                let value = Object.values(array1[j])[i];
                if(content == dates.value) {
                    if(isString(value) == true && value !== null) array2.push({title: dates.title, date: dayjs(value, 'M/D/Y').format('DD MMMM YYYY (DD/MM/YYYY)')});
                    else array2.push({title: dates.title, date: dates.date});
                }
            });
        }
    }
)};
const userStatusList = [{status:'draft',value:'En cours de validation',message:'Un administrateur va valider votre compte, veuillez patienter.',color:'yellow'},{status:'unverified',value:'Non vérifié',message:'Un administrateur va valider votre compte, veuillez patienter.',color:'orange'},{status:'active',value:'Activé',color:'green'},{status:'archived', value:'En cours de suppression', message:'Votre compte est en cours de suppression, cela peut prendre jusqu\'à 48h (jours ouvrés) pour confirmer la suppression. Si vous souhaitez toujours supprimer votre compte, ne touchez à rien. Cependant, si vous souhaitez annuler la demande, rendez-vous sur votre profil et cliquez sur le bouton "Annuler la suppression".', color:'redorange'},{status:'suspended',value:'Désactivé',message:'Votre compte a été suspendu pour un manquement aux règles de notre site internet (plus de détails vous ont été transmis par mail)',color:'red'}], imageTypeList = [{type:'image/jpeg', value:'jpg'},{type:'image/png', value:'png'}], userRoleList = [{role: process.env.USER_ROLE},{role: process.env.AUTHOR_ROLE},{role: process.env.ADMIN_ROLE}];
const dateConverter = (date, final) => {
    let temp = [];
    date.map(value => {
        if(value.date_created && value.date_updated || value.date_created || value.date_updated) temp.push({dateCreated: dayjs(value.date_created, 'M/D/Y').format('DD/MM/YYYY'), dateUpdated: dayjs(value.date_updated, 'M/D/Y').format('DD/MM/YYYY')})
        if(value.date_archived) temp.push({dateArchived: dayjs(value.date_archived, 'M/D/Y').format('DD/MM/YYYY')})
        if(value.date_cancelled) temp.push({dateCancelled: dayjs(value.date_cancelled, 'M/D/Y').format('DD/MM/YYYY')})
        if(value.date_published) temp.push({datePublished: dayjs(value.date_published, 'M/D/Y').format('DD/MM/YYYY')})
    })
    temp.map(content => {
        return final.push({dateCreated: content.dateCreated, dateUpdated: content.dateUpdated, dateArchived: content.dateArchived, dateCancelled: content.dateCancelled, datePublished: content.datePublished}), final.filter(value => value.dateCreated == 'Invalid Date' || typeof value.dateCreated == 'undefined').map(content => {return content.dateCreated = ''}), final.filter(value => value.dateUpdated == 'Invalid Date' || typeof value.dateUpdated == 'undefined').map(content => {return content.dateUpdated = ''}), final.filter(value => value.dateArchived == 'Invalid Date' || typeof value.dateArchived == 'undefined').map(content => {return content.dateArchived = ''}), final.filter(value => value.dateCancelled == 'Invalid Date' || typeof value.dateCancelled == 'undefined').map(content => {return content.dateCancelled = ''}), final.filter(value => value.datePublished == 'Invalid Date' || typeof value.datePublished == 'undefined').map(content => {return content.datePublished = ''})
    })
};
// On convertit la date de publication : YYYY-MM-DD -> DD/MM/YYYY
dayjs.extend(updateLocale), dayjs.updateLocale('en', {months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet","Août", "Septembre", "Octobre", "Novembre", "Decembre"]}); // On convertit les noms des mois de l'anglais au français
var dateNow = dayjs(new Date(), 'M/D/Y').format('DD/MM/YYYY');

const panelController = {
    home: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            userStatusValue = []; if(isObjEmpty(userRoleList.filter(content => content.role == req.roleID))) userStatusValue.push({value: userStatusList[0].value, message: userStatusList[0].message, color: userStatusList[0].color});
            else userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push(content)});
            managerBtnList = []; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Panel - Accueil'
            console.log('THE END OF THE CALL');

            res.render('panel/panel-index', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Panel Homepage: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    profile: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const {recipe} = req.body;
            let profileInfoList = [], profileInfo = [], profile, roleInfoList = [], roleInfo, favoritesRecipes = [];
            
            const getuserData = async() => {
                return await fetch(`${ApiUrl}/users/me?fields=id,first_name,last_name,pseudonyme,avatar,email,password,description,date_published,role,favorites_recipes`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
            };
            profile = await getuserData(); profileInfo = []; profileInfo.push(profile);
            profileInfo.map(user => {
                profileInfoList.push({id: user.id, firstname: user.first_name, lastname: user.last_name, pseudonyme: user.pseudonyme, avatar: `${ApiUrl}/assets/${user.avatar}?width=250&height=250`, email: user.email, password: user.password, description: user.description, date_published: user.date_published});
                roleInfoList.push({role: user.role});
                favoritesRecipes.push(user.favorites_recipes), favoritesRecipes = favoritesRecipes.reduce((acc,value) => acc + value);
            });
            roleInfo = await getRoleValues(ApiUrl, roleInfoList, req.accessToken);

            const getFavoritesRecipes = async() => {
                return await Promise.all(favoritesRecipes.map(value => fetch(`${ApiUrl}/items/Recipe/${value}?fields=id,sort,title,description,image,imageDescription,labelDescription,labelURL,date_published,user_id,category_id&filter=[status][_eq]=published&sort=date_published`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-Type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data))
            )};
            if(typeof favoritesRecipes == 'undefined') {
                Recipes = [];
            } else {
                let fav = await getFavoritesRecipes();
                Recipes = fav.flatMap(e => e).flat(1);
                // console.log('Recipes: ', Recipes);
            }
            if(recipe) {
                console.log('Recipe: ', recipe);
                const patchFavoritesRecipes = async() => {
                    return await Promise.all(favoritesRecipes.map(value => fetch(`${ApiUrl}/users/me`, {
                        method: 'PATCH',credentials: 'include', headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-Type': 'application/json','Accept': 'application/json'},
                        body: JSON.stringify({
                            'favorites': recipe
                        })
                    }).then(response => response.json()).then(result => result.data))
                )};
                let filterFavorites = Recipes.filter(recipe => recipe.id == recipe);
                if(isObjEmpty(filterFavorites) == false) {await patchFavoritesRecipes();}
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = []; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Page de profil'
            console.log('THE END OF THE CALL');

            res.render('panel/profile', {userBtn, authorBtn, adminBtn, profileInfoList, roleInfo, Recipes, managerBtnList, userHeaderProfile, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Profile page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    profileUpdate: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const {value, surname, description, avatar, email, password, image} = req.body;
            // console.log('Update BodyID ', req.body);
            let formValue = [], formImgValue = [], formDescValue = [], userValues = [];

            const getUserValues = async() => {
                return await fetch(`${ApiUrl}/users/me?fields=id,first_name,last_name,description,pseudonyme,email,avatar`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
            };
            const checkformValue = (value, user) => {
                return formValueList.filter(content => content.name == value).map(content => {
                    if (content.arrayName === 'formImgValue') {
                        return formImgValue.push({id: content.id, name: content.valuename, title: content.title, type: content.type, pattern: content.pattern})
                    } 
                    else if (content.arrayName === 'formDescValue') {
                        return formDescValue.push({id: content.id, name:'description', title: content.title, type: content.type, value: user[0].description})
                    } 
                    else {
                        return formValue.push({id: content.id, name:value, title: content.title, type: content.type})
                    }
                })
            };
            const patchUserProfile = async(array) => {
                return await Promise.all(array.map(content => {
                    fetch(`${ApiUrl}/users/me`, {
                        method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                        body: JSON.stringify({
                            'first_name': content.firstname,
                            'email': content.email,
                            'description': content.description,
                            'avatar': content.image,
                        })
                    }).then(response => response.json()).then(result => result.data) 
                }))  
            };
            const postRequestResetUserPassword = async(userEmail) => {
                await fetch(`${ApiUrl}/auth/password/request`, {
                    method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                    body: JSON.stringify({
                        'email': userEmail
                    }).then(response => response.json())
                })
            };
            userValues.push(await getUserValues());
            if(value) {
                console.log('value: ', value);
                checkformValue(value, userValues);
            } else {
                if(image) {
                    const [file, fileExtension] = image.split(/\.(?=[^\.]+$)/), userName = userValues[0].pseudonyme;
                    let imageType;
                    imageTypeList.filter(content => content.value == fileExtension).map(content => {return imageType = content.type});
                    await deleteProfileImage(ApiUrl, req.accessToken, userValues[0].avatar), await postProfileImage(ApiUrl, req.accessToken, image, imageType, fileExtension, userName);
                    const getFileImage = async() => {
                        return await fetch(`${ApiUrl}/files?search=Image de profil de ${userName}&fields=id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)
                    };
                    let fileImage = await getFileImage(), imageID = []; fileImage.map(image => {return imageID.push({image: image.id})});
                    await patchUserProfile(imageID);
                } else if(surname || email || description) {
                    const filterFirstname = userValues.filter(content => content.first_name !== surname), filterEmail = userValues.filter(content => content.email !== email), filterDescription = userValues.filter(content => content.description !== description);
                    let  userNewValues = [];
                    if(surname && filterFirstname) userNewValues.push({firstname: surname}); else if(email && filterEmail) userNewValues.push({email: email}); else if(description && filterDescription) userNewValues.push({description: description});
                    await patchUserProfile(userNewValues);
                } else if(password) {
                    const filterEmail = userValues.filter(content => content.email == password);
                    console.log(password, filterEmail);
                    // if(password && filterEmail) await postRequestResetUserPassword(password)
                }
                return res.redirect('/panel/profile')
            }
            // console.log('Form Img Value: ', formImgValue, ', Form Value: ', formValue);

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = []; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Mise à jour de la page de profil'
            console.log('THE END OF THE CALL');

            res.render('panel/profileUpdate', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, formValue, formImgValue, formDescValue, userStatusValue});
        }
        catch(error) {
            console.error('Erreur ProfileUpdate page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    supportHomePage: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = supportBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Support - Accueil'
            console.log('THE END OF THE CALL');

            res.render('panel/withuser-index', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Support Homepage: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    ticketCreate: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {title, problemlevel, problemtype, description} = req.body;
            console.log(req.body);

            if(title && problemlevel && problemtype && description) {
                const postNewTicket = async() => {
                    return await(
                        await fetch(`${ApiUrl}/items/ticket/`, {method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                            body: JSON.stringify({
                                'title': title,
                                'content': description,
                                'problemLevel': problemlevel,
                                'problemType': problemtype,
                                'user_id': req.userID,
                            })
                        }).then(response => response.json()).then(result => result.data)
                    )
                };
                
                let newTicket = await postNewTicket();
                console.log('Ticket: ', newTicket);
                return res.redirect('/panel/support/tickets-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = supportBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Créer un ticket'
            console.log('THE END OF THE CALL');

            res.render('panel/ticket-create', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, ticketFormTypeList, ticketFormProblemLevelList, ticketFormProblemTypeList, ticketFormTextareaList, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Ticket Create: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    ticketsList: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const {search, sort} = req.body;
            let ticketsList = [];
            const sortingBtnList = [
                {title:'ID', name:'id', type:'button', value:'id', liclass:'ticketbtnid', class:''},
                {title:'Informations', name:'infos', type:'button', value:'infos', liclass:'ticketbtninfo', class:'webkit'},
            ];

            const fetchAllTickets = async() => {
                let usersValues = [], datesValues = [], dates = [], tickets = [], ticketTypeList = [], status = [];
                if(req.roleID == process.env.ADMIN_ROLE) {
                    const getTicketValues = await(
                        await fetch(`${ApiUrl}/items/ticket?fields=id,title,problemLevel,problemType,status,user_created,date_created,user_updated,date_updated`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)  
                    ).map(content => {
                        return tickets.push({id: content.id, title: content.title, problemLevel: content.problemLevel, problemType: content.problemType, status: content.status}),usersValues.push({user_created: content.user_created, user_updated: content.user_updated}),datesValues.push({date_created: content.date_created, date_updated: content.date_updated})
                    });
                } else {
                    const getUserTicketID = await fetch(`${ApiUrl}/users/${req.userID}?fields=ticket_id,addedtickets_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data);
                    let temp = [], array = [], array2 = []; temp.push(getUserTicketID.addedtickets_id), temp = temp.reduce((acc,value) => acc + value), array2.push(getUserTicketID.ticket_id);
                    const getUserAddedTicketID = await Promise.all(temp.map(ticket => {
                        return fetch(`${ApiUrl}/items/ticket_directus_users/${ticket}?fields=ticket_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data);
                    }));
                    getUserAddedTicketID.map((ticket,i) => {return array.push({ticket: ticket.ticket_id},{ticket: array2[i].flatMap(e => e).flat(1)})});
                    array = array.filter(content => typeof content.ticket !== 'object');
                    if(array) {
                        const getTicketValues = await(await Promise.all(array.map(content => {
                            return fetch(`${ApiUrl}/items/ticket/${content.ticket}?fields=id,title,problemLevel,problemType,status,user_created,date_created,user_updated,date_updated`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
                        }))).map(content => {
                            return tickets.push({id: content.id, title: content.title, problemLevel: content.problemLevel, problemType: content.problemType, status: content.status}),usersValues.push({user_created: content.user_created, user_updated: content.user_updated}),datesValues.push({date_created: content.date_created, date_updated: content.date_updated})
                        });
                    }
                }
                const getUserCreatedValues = await Promise.all(
                    usersValues.map(user => {return fetch(`${ApiUrl}/users/${user.user_created}?fields=first_name,last_name`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)})
                );
                const getUserUpdatedValues = await Promise.all(
                    usersValues.map(user => {return fetch(`${ApiUrl}/users/${user.user_updated}?fields=first_name,last_name`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)})
                );
                let userCreatedArray = [], userUpdatedArray = [];
                const mapArray = (array1, array2) => {
                    return array1.map(content => {return typeof content !== 'undefined'? array2.push({first_name: content.first_name, last_name: content.last_name}): array2.push({first_name: '', last_name: ''})})
                };
                mapArray(getUserCreatedValues, userCreatedArray), mapArray(getUserUpdatedValues, userUpdatedArray);
                console.log(userCreatedArray, userUpdatedArray);
                dateConverter(datesValues, dates), compareTicketValues(tickets, status, ticketTypeList, problemList);
                // console.log(datesValues, dates);
                const pushResult = (ticket, final) => {
                    return ticket.flatMap((content,i) => final.push({id: content.id, title: content.title, problemLevel: problemList[content.problemLevel-1].problem, problemType: ticketTypeList[i].value, status: status[i].status, statuscolor: status[i].color, color: colorful[content.problemLevel].color, firstname: userCreatedArray[i].first_name, lastname: userCreatedArray[i].last_name, date_created: dates[i].dateCreated, latest_published_firstname: userUpdatedArray[i].first_name, latest_published_lastname: userUpdatedArray[i].last_name, date_updated: dates[i].dateUpdated}))
                };
                pushResult(tickets, ticketsList);
                
                return ticketsList.filter( Boolean )
            };
            await fetchAllTickets();
            // console.log(ticketsList);

            // Sort By Element
            // voir controller_doc pour plus d'infos
            let sortDropdown = [], sortValues;

            if(typeof sort == 'undefined' || sort == '') {
                sortDropdown = sortDropdownList;
                console.log('SortID: Nothing to see', ' SortDropdown: ', sortDropdown);
            } else if(isObjEmpty(sort) == false) {
                const getValuesFromSortList = () => {
                    return sortList.filter(value => value.id == sort).map(content => {content.exec(Recipes); return content})
                };
                sortValues = getValuesFromSortList();
                sortValues.map(content => {sortDropdown.push({id: content.id, title: content.title})});
                console.log('Sort Dropdown: ', sortDropdown);
            }
            
            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = supportBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Liste des tickets'
            console.log('THE END OF THE CALL');

            res.render('panel/tickets-list', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, ticketsList, sortDropdown, sortPanelList, sortingBtnList, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Tickets List: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    ticket: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const {ticketID} = req.params;
            const {chatbox, editmessage, editingchatbox, editingid, deletemessage, tickettitle, level, type, status, useradded, alluserslist, searchuser, searchaddeduser, searchalluser} = req.body;
            const ticketFormTextareaList = [{id:1, name:'chatbox', placeholder:'Ecrivez ici pour envoyer un message', maxlength:'3000'}];
            let ticketSettings = ticketSettingsList, ticketInfos = ticketInformationsList, ticketUsers = [], ticketMessages = [], ticketContent = [], ticketUsersList = [], ticketUsersAdded = [], ticketUsersListInputContent = [], ticketUsersInputContent = [], ticketUsersAddedInputContent = [];

            if (noAlphaNum(ticketID) == true) {
                console.log('TicketID: ', ticketID)
                var addedUsersID = [], addedUsersValues = [], addedUsersRolesValues = [];
                const getTicketValues = async() => {
                    return await fetch(`${ApiUrl}/items/ticket/${ticketID}?fields=id,title,content,problemLevel,problemType,status,user_created,date_created,date_updated,messages_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
                };
                let isValueExist = await getTicketValues();
                if(typeof isValueExist !== 'undefined') {
                    const fetchAllTickets = async() => {
                        let usersValues = [], datesMessages = [], dates = [], rolesValues = [], messageAuthorRoleList = [], messages = [], messageAuthorList = [], ticketValues = [], ticketsValues = [], ticketTypeList = [], status = []; 
                        var userData = [], rolesList = [], selectedRoles = [], selectedRolesValues = [];
                        ticketValues = await getTicketValues(), ticketsValues.push(ticketValues), usersValues = await getUserCreatedValues(ApiUrl, ticketsValues, req.accessToken), rolesValues = await getRoleValues(ApiUrl, usersValues, req.accessToken);
                        messages = await fetchAllMessages(ApiUrl,ticketsValues, req.accessToken), messageAuthorList = await getMessageAuthorValues(ApiUrl, messages, req.accessToken), messageAuthorRoleList = await getRoleValues(ApiUrl, messageAuthorList, req.accessToken);
                        const getAllRoles = async() => {
                            return await fetch(`${ApiUrl}/roles?fields=id,name,color&sort=name`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
                        };
                        rolesList = await getAllRoles();
                        selectedRoles = [{role:'1bc772ce-fdbe-4b98-b5a3-5b447adc334d'}];
                        const getSelectedUserRolesValues = async() => {
                            return await Promise.all(selectedRoles.map(user => fetch(`${ApiUrl}/users?search=${user.role}&fields=id,first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data))
                        )};
                        selectedRolesValues = await getSelectedUserRolesValues();
                        selectedRolesValues = selectedRolesValues.flatMap(e => e).flat(1);
                        const getAddedUsersID = async() => {
                            return await fetch(`${ApiUrl}/items/ticket_directus_users?search=${ticketID}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
                        };
                        addedUsersID = await getAddedUsersID();
                        addedUsersID = addedUsersID.flatMap(e => e).flat(1);
                        const getAddedUsersValues = async() => {
                            return await Promise.all(addedUsersID.map(user => fetch(`${ApiUrl}/users/${user.directus_users_id}?fields=id,first_name,last_name,avatar,pseudonyme,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data))
                        )};
                        addedUsersValues = await getAddedUsersValues(), addedUsersValues = addedUsersValues.filter(content => typeof content !== 'undefined');
                        // addedUsersRolesValues = await getRoleValues(ApiUrl, addedUsersValues, req.accessToken);
                        userData.push({id: req.userID, role: req.roleID});
                        dateConverter(ticketsValues, dates), compareTicketValues(ticketsValues, status, ticketTypeList, problemList), dateConverter(messages, datesMessages);

                        const pushResult = (ticket, info, setting) => {
                            /* Paramétrage du tableau des informations */
                            ticket.flatMap((tc,i) => info.map(content => {
                                const mapInfoTicket = () => {
                                    if(isObjEmpty(content.data) == true) {
                                        content.data.push({id: tc.id, title: tc.title, image: `${ApiUrl}/assets/${usersValues[i].avatar}?width=50&height=50`, firstname: usersValues[i].first_name, lastname: usersValues[i].last_name, role: rolesValues[i].name, color: rolesValues[i].color, dateCreated: dates[i].dateCreated, dateUpdated: dates[i].dateUpdated, data:[
                                            {id:1, title:'Niveau', infotitle: problemList[tc.problemLevel-1].problem, name: 'levelinfo', value: ticket[i].problemLevel, color: problemList[tc.problemLevel-1].color},
                                            {id:2, title:'Type', infotitle: ticketTypeList[i].value, name: 'typeinfo', value: ticket[i].problemType, color:''},
                                            {id:3, title:'Status', infotitle: status[i].status, name:'statusinfo', value: ticket[i].status, color: status[i].color}
                                        ]})
                                    } else {
                                        content.data = [], mapInfoTicket();
                                    }
                                };
                                mapInfoTicket();
                            }));
                            ticket.flatMap((tc,i) => ticketContent.push({id: 0, content: tc.content, firstname: usersValues[i].first_name, lastname: usersValues[i].last_name, pseudonyme: usersValues[i].pseudonyme, image: `${ApiUrl}/assets/${usersValues[i].avatar}?width=50&height=50`, role: rolesValues[i].name, color: rolesValues[i].color, dateCreated: dates[i].dateCreated, dateUpdated: ''}));
                            
                            /* Paramétrage du tableau des paramètres */
                            ticket.flatMap((tc,i) => setting.map(content => {
                                content.data.map(ticket => {
                                    let userRole = userData.filter(user => user.role == process.env.ADMIN_ROLE).map(content => {return content.role});
                                    if(!ticket.data) {
                                        if(!ticket.value && ticket.id == '1') {
                                            content.data.shift(0);
                                            const statusFilter = statusTypeList.filter(content => content.value == tc.status).map(content => {return content.value}).reduce((acc,value) => acc + value);
                                            if(statusFilter == 'draft' || statusFilter == 'cancelled') {
                                                content.data.push({id:1, title:'Titre du ticket', name:'tickettitle', value: tc.title, type:'input', ticket_id: tc.id});
                                            } else {
                                                content.data.push({id:1, title:'Titre du ticket', name:'tickettitle', value: tc.title, type:'input'});
                                            }
                                            content.data.sort((a,b) => {return a.id - b.id});
                                        }
                                    } else if(ticket.data) {
                                        if(isObjEmpty(userRole) == true && ticket.title == 'Niveau' && usersValues[0].id !== req.userID) {
                                            console.log('No Perm');
                                            content.data = []; // content.data.splice(1,1);
                                            content.data.push({id:'NO_PERMISSION'}),
                                            content.data.sort((a,b) => {return a.id - b.id});
                                        } else {
                                            const statusFilter = statusTypeList.filter(content => content.value == tc.status).map(content => {return content.value}).reduce((acc,value) => acc + value);
                                            if(statusFilter == 'draft') {
                                                ticket.data.map(value => {
                                                    let ticketValue = value, index = ticket.data.indexOf(value);
                                                    if(statusFilter == 'draft') {
                                                        if(isObjEmpty(userRole) && usersValues[0].id == req.userID) {
                                                            if(tc.problemType == value.value && index > -1) {
                                                                ticket.data.splice(index, 1);
                                                                ticket.data.push({id: ticketValue.id, title: ticketValue.title, name: ticketValue.name, value: ticketValue.value, selected:'yes'});
                                                            } else if(tc.status == value.value && index > -1) {
                                                                ticket.data.splice(0);
                                                                ticket.data.push({id:3, title:'Clôturer le ticket', name:'status', value:'resolved', color:'skyblue'});
                                                            }
                                                        }
                                                    } else {
                                                        if(req.roleID == process.env.ADMIN_ROLE) {
                                                            console.log('admin');
                                                            if(problemList[tc.problemLevel-1].problem == value.title && index > -1) {
                                                                ticket.data.splice(index, 1);
                                                                ticket.data.push({id: ticketValue.id, title: ticketValue.title, name: ticketValue.name, value: ticketValue.value, color: ticketValue.color, selected:'yes'});
                                                            } else if(tc.problemType == value.value && index > -1) {
                                                                ticket.data.splice(index, 1);
                                                                ticket.data.push({id: ticketValue.id, title: ticketValue.title, name: ticketValue.name, value: ticketValue.value, selected:'yes'});
                                                            } else if(tc.status == value.value && index > -1) {
                                                                ticket.data.splice(index, 1);
                                                                ticket.data.push({id: ticketValue.id, title: ticketValue.title, name: ticketValue.name, value: ticketValue.value, color: ticketValue.color, selected:'yes'});
                                                            }
                                                        } else {
                                                            if(tc.status == value.value && index > -1) {
                                                                ticket.data.splice(0);
                                                                ticket.data.push({id:3, title:'Clôturer le ticket', name:'status', value:'resolved', color:'skyblue'});
                                                            }
                                                        }
                                                    }
                                                    ticket.data.sort((a,b) => {return a.id - b.id});
                                                })
                                            } else {
                                                if(ticket.title == 'Status') {
                                                    ticket.data.map(value => {
                                                        if(tc.status == value.value) {
                                                            ticket.data.splice(0), ticket.data.push({id:3, title:'Clôturer le ticket', name:'status', value:'resolved', color:'skyblue'});
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                })
                            }));
                            /* Paramétrage du tableau des utilisateurs */
                            rolesList.map(role => {
                                ticketUsers.push({id: role.id, name: role.name, color: role.color, data:[]})
                            });
                            const filterRole = (array) => {
                                return array.map(content => {
                                    return ticketUsers.findIndex(role => role.id == content.role)
                                })
                            };
                            const filterUser = (array) => {
                                return ticketUsers[filterRole(array)].data.filter(user => user.id == array[filterRole(array)].id)
                            };
                            const pushNewValues = (array) => {
                                if(array.length >= 2) {
                                    let array2 = filterRole(array);
                                    array2.map((content,i) => {
                                        return ticketUsers[content].data.push({id: array[i].id, firstname: array[i].first_name, lastname: array[i].last_name, pseudonyme: array[i].pseudonyme, image: `${ApiUrl}/assets/${array[i].avatar}?width=50&height=50`})
                                    });
                                } else {
                                    array.map(content => {
                                        ticketUsers[filterRole(array)].data.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.avatar}?width=50&height=50`});
                                    }), ticketUsers[filterRole(array)].data.sort((a,b) => {return a.id - b.id});
                                }
                            };
                            
                            if(typeof filterRole(usersValues) !== 'undefined') {
                                pushNewValues(selectedRolesValues);
                                if(isObjEmpty(addedUsersValues) == false) pushNewValues(addedUsersValues)
                                if(isObjEmpty(filterUser(usersValues)) == true) {
                                    pushNewValues(usersValues);
                                } 
                            }
                            ticketUsers.filter(user => isObjEmpty(user.data) == true).map(filter => {
                                ticketUsers.map((content,i) => {
                                    if(content == filter) ticketUsers.splice(i,1)
                                })
                            });
                            // console.log('ticketUsers: ', ticketUsers);
                            // console.log('Ticket Users List: ', ticketUsersList);
                            ticketUsers.map(content => {
                                ticketUsersAdded.push(content)
                            })
                            // console.log('ticketUsersAdded', ticketUsersAdded);
                            /* Paramétrage du tableau des messages */
                            messages.map((content,i) => {
                                ticketMessages.push({id: content.id, content: content.content, firstname: messageAuthorList[i].first_name, lastname: messageAuthorList[i].last_name, pseudonyme: messageAuthorList[i].pseudonyme, image: `${ApiUrl}/assets/${messageAuthorList[i].avatar}?width=50&height=50`, role: messageAuthorRoleList[i].name, color: messageAuthorRoleList[i].color, dateCreated: datesMessages[i].dateCreated, dateUpdated: datesMessages[i].dateUpdated})
                            });
                            ticketMessages.push(...ticketContent);
                            ticketMessages.sort((a,b) => {return a.id - b.id});
                        };
                        pushResult(ticketsValues, ticketInfos, ticketSettings);
                        return ticketInfos.filter( Boolean ) && ticketSettings.filter( Boolean ) && ticketMessages.filter( Boolean )
                    };
                    await fetchAllTickets();
                    // console.log(ticketSettings, ticketInfos, ticketMessages);
                    const getAllUsers = async() => {
                        return await fetch(`${ApiUrl}/users?fields=id,first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
                    };
                    let getAllUsersList = await getAllUsers();
                    let getAllUsersRolesList = await getRoleValues(ApiUrl, getAllUsersList, req.accessToken);
                    getAllUsersList.map((content,i) => {
                        ticketUsersList.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.avatar}?width=50&height=50`, role: getAllUsersRolesList[i].name, color: getAllUsersRolesList[i].color})
                    });
                    const getTicketStatus = async() => {
                        return await fetch(`${ApiUrl}/items/ticket/${ticketID}?fields=status`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken, 'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)
                    }
                    const ticketStatus = await getTicketStatus(), statusFilter = statusTypeList.filter(content => content.value == ticketStatus.status).map(content => {return content.value}).reduce((acc,value) => acc + value);
                    
                    if(chatbox) {
                        let compareMessage = ticketMessages.filter(message => message.content == chatbox).map(content => {return content});
                        const postNewMessage = async() => {
                            return await fetch(`${ApiUrl}/items/ticket_messages`, {
                                method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken, 'Content-Type': 'application/json', 'Accept': 'application/json'},
                                body: JSON.stringify({
                                    'content': chatbox,
                                    'ticket_id': ticketID,
                                    'user_id': req.userID,
                                    'date_created': dateNow,
                                })
                            }).then(response => response.json()).then(result => result.data)
                        };
                        if(isObjEmpty(compareMessage) && statusFilter == 'published') {
                            let newMessage = await postNewMessage();
                            console.log('newMessage: ', newMessage);
                        }
                    }
                    if(editmessage || editingchatbox) {
                        var editMessage = [];
                        ticketMessages.filter(message => message.id == editmessage).map(content => {return editMessage.push({id: content.id, content: content.content, name:'editingchatbox', paragraph:'editingid'})});
                        // console.log('Message: ', editMessage);
                        if(editingchatbox && editingid) {
                            let compareMessage = ticketMessages.filter(message => message.content == editingchatbox).map(content => {return content});
                            const patchEditedMessage = async() => {
                                return await fetch(`${ApiUrl}/items/ticket_messages/${editingid}`, {
                                    method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken, 'Content-Type': 'application/json', 'Accept': 'application/json'},
                                    body: JSON.stringify({
                                        'content': editingchatbox
                                    })
                                }).then(response => response.json()).then(result => result.data)
                            };
                            if(isObjEmpty(compareMessage) && statusFilter == 'published') {
                                console.log('chatbox: ', editingchatbox, ' id: ', editingid);
                                let editedMessage = await patchEditedMessage();
                                console.log('editedMessage: ', editedMessage);
                            }
                        }
                    } else if(deletemessage) {
                        console.log(deletemessage);
                        let filterTicketMessages = ticketMessages.filter(content => content.id == deletemessage).map(content => {return content.pseudonyme});
                        const getUserInfo = async() => {
                            return await fetch(`${ApiUrl}/users?search=${filterTicketMessages.reduce((acc,value) => acc + value)}&fields=id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken, 'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)
                        };
                        const patchDeletedMessage = async() => {
                            return await fetch(`${ApiUrl}/items/ticket_messages/${deletemessage}`, {method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'}})
                        };
                        if(filterTicketMessages) {
                            let ticketUserInfo = await getUserInfo();
                            if(req.userID == ticketUserInfo[0].id && statusFilter == 'published') {
                                await patchDeletedMessage();
                            }
                        }
                    } else if(tickettitle || level | type | status) {
                        var filterTitle, filterLevel, filterType, filterStatus;
                        console.log(level, type, status);
                        ticketInfos.map(content => {
                            if(tickettitle) {
                                filterTitle = content.data.filter(ticket => ticket.title == tickettitle).map(content => {return content.title});
                                console.log(filterTitle);
                                isObjEmpty(filterTitle) == false ? filterTitle = null : filterTitle = tickettitle
                            }
                            content.data.map(ticket => {
                                if(level) {
                                    filterLevel = ticket.data.filter(button => button.value == level).map(content => {return content.id});
                                    isObjEmpty(filterLevel) == false ? filterLevel = null : filterLevel = level
                                } else if(type) {
                                    filterType = ticket.data.filter(button => button.value == type);
                                    isObjEmpty(filterType) == false ? filterType = null : filterType = type
                                } else if(status) {
                                    filterStatus = ticket.data.filter(button => button.value == status);
                                    isObjEmpty(filterStatus) == false ? filterStatus = null : filterStatus = status
                                }
                            })
                        });
                        console.log('Called', 'Title: ', filterTitle, ' Level: ', filterLevel, ' Type: ', filterType, ' Status: ', filterStatus);
                        if(typeof filterTitle !== 'undefined' && filterTitle !== null) {
                            const patchInfosTicket = async() => {
                                return await fetch(`${ApiUrl}/items/ticket/${ticketID}`, {
                                    method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                    body: JSON.stringify({
                                        'title': filterTitle,
                                        'problemLevel': filterLevel,
                                        'problemType': filterType,
                                        'status': filterStatus
                                    })
                                }).then(response => response.json()).then(result => result.data)
                            };
                            await patchInfosTicket();
                        }
                    } else if(searchuser || searchaddeduser || searchalluser) {
                        let userSearchedValues, userSearchedRoleValues, ticketAllUsersList;
                        console.log('searchuser: ', searchuser, ' searchaddeduser: ', searchaddeduser, ' searchalluser: ', searchalluser);
                        const getUserTicketValues = async(userID) => {
                            return await fetch(`${ApiUrl}/users?search=${userID}&fields=id,first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
                        };
                        if(isObjEmpty(searchaddeduser) == false) userSearchedValues = await getUserTicketValues(searchaddeduser), ticketUsersAdded = [];
                        else if(isObjEmpty(searchuser) == false) userSearchedValues = await getUserTicketValues(searchuser), ticketUsers = [];
                        else if(isObjEmpty(searchalluser) == false) userSearchedValues = await getUserTicketValues(searchalluser), ticketAllUsersList = ticketUsersList, ticketUsersList = [];
                        if(isObjEmpty(userSearchedValues) == false || userSearchedValues) {
                            const mapSearchArray = (array, final) => {return userSearchedValues.map(value => {return array.filter(user => user.id == value.id).reduce((acc,value) => acc + value)}).map((user,i) => {return final.push({id: user.id, firstname: user.firstname, lastname: user.lastname, pseudonyme: user.pseudonyme, image: user.image, role: userSearchedRoleValues[i].name, color: userSearchedRoleValues[i].color, searched:'yes'})})};
                            userSearchedRoleValues = await getRoleValues(ApiUrl, userSearchedValues, req.accessToken);
                            if(searchaddeduser) console.log(mapSearchArray(ticketUsersList, ticketUsersAdded)), ticketUsersAddedInputContent = searchaddeduser
                            else if(searchuser) console.log(mapSearchArray(ticketUsersList, ticketUsers)), ticketUsersInputContent = searchuser
                            else if(searchalluser) console.log(mapSearchArray(ticketAllUsersList, ticketUsersList)), ticketUsersListInputContent = searchalluser
                        } else {
                            if(!searchaddeduser) return ticketUsersAdded.push(ticketUsers)
                            else if(!searchuser) return ticketUsers
                            else if(!searchalluser) return ticketUsersList
                        }
                    } else if(useradded || alluserslist) {
                        let selectedUserValues;
                        const filterUser = (array, string) => {
                            return array[0].data ? array.map(content => {return content.data.filter(user => user.pseudonyme == string).map(content => {return content.id})}).reduce((acc, value) => acc + value)
                            : array.filter(user => user.pseudonyme == string).map(content => {return content.id}).reduce((acc,value) => acc + value)
                        };
                        if(filterUser(ticketUsers, useradded) && useradded) {
                            selectedUserValues = filterUser(ticketUsers, useradded);
                            // console.log(selectedUserValues);
                            const patchRemoveUserTicket = async(userID) => {
                                let filterUserID = addedUsersID.filter(user => user.directus_users_id == userID);
                                if(filterUserID) {
                                    return await fetch(`${ApiUrl}/items/ticket_directus_users/${filterUserID[0].id}`, {method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                        body: JSON.stringify({
                                            'directus_users_id': userID
                                        })
                                    }).then(response => response.json()).then(result => result.data)
                                }
                            };
                            await patchRemoveUserTicket(selectedUserValues);
                        }
                        if(isObjEmpty(filterUser(ticketUsers, alluserslist)) && alluserslist) {
                            selectedUserValues = filterUser(ticketUsersList, alluserslist);
                            // console.log('selectedUserValues: ', selectedUserValues);
                            const postAddUserTicket = async(userID) => {
                                return await fetch(`${ApiUrl}/items/ticket_directus_users`, {method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                    body: JSON.stringify({
                                        'ticket_id': ticketID,
                                        'directus_users_id': userID
                                    })
                                }).then(response => response.json()).then(result => result.data)
                            };
                            await postAddUserTicket(selectedUserValues);
                        }
                    }
                } else {
                    res.redirect('/panel/support/tickets-list');
                }
            } else {
                res.redirect('/panel/support/tickets-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = supportBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Ticket ' + req.params.ticketID
            console.log('THE END OF THE CALL');

            res.render('panel/ticket', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, ticketFormTextareaList, ticketSettings, ticketInfos, ticketMessages, ticketUsers, editMessage, ticketUsersList, ticketUsersAdded, ticketUsersInputContent, ticketUsersListInputContent, ticketUsersAddedInputContent, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Ticket Page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    ticketDelete: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {ticketID} = req.params;
            const { deleteticketbtn } = req.body;
            let ticketValues = [], ticket = [], userValues = [], userRoleValues = [], ticketInfos = [], dates = [], status = [], type = [];

            if(noAlphaNum(ticketID) == true) {
                const getTicketValues = async() => {
                    return await fetch(`${ApiUrl}/items/ticket/${ticketID}?fields=id,title,content,problemLevel,problemType,status,user_created,date_created,date_updated,messages_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)
                }; 
                let isValueExist = await getTicketValues();

                if(typeof isValueExist !== 'undefined') {
                    const pushResult = (ticket,info) => {
                        ticket.map((tc,i) => {
                            const mapInfoTicket = () => {
                                if(isObjEmpty(info) || isObjEmpty(info[0].data)) {
                                    return info.push({id: tc.id, title: tc.title, image: userValues[i].avatar, firstname: userValues[i].first_name, lastname: userValues[i].last_name, role: userRoleValues[i].name, color: userRoleValues[i].color, dateCreated: dates[i].dateCreated, dateArchived: dates[i].dateArchived, dateCancelled: dates[i].dateCancelled, data:[
                                        {id:1, title:'Niveau', infotitle: problemList[tc.problemLevel-1].problem, color: problemList[tc.problemLevel-1].color},
                                        {id:2, title:'Type', infotitle: type[i].value, color:''},
                                        {id:3, title:'Status', infotitle: status[i].status, color: status[i].color}
                                    ]})
                                } else {
                                    console.log('content: ', info);
                                    return info[0].data = [], mapInfoTicket()
                                }
                            };
                            mapInfoTicket();
                        });
                    };
        
                    if(!deleteticketbtn) {
                        ticket = await getTicketValues(), ticketValues.push(ticket);
                        // console.log(ticketValues);
                        userValues = await getUserCreatedValues(ApiUrl, ticketValues, req.accessToken);
                        userRoleValues = await getRoleValues(ApiUrl, userValues, req.accessToken);
                        dateConverter(ticketValues, dates), compareTicketValues(ticketValues, status, type, problemList);
                        // console.log('dates: ', dates, ' status: ', status, ' type: ', type);
                        pushResult(ticketValues, ticketInfos), ticketInfos = ticketInfos.filter( Boolean );
                    } else {
                        console.log('Input:', deleteticketbtn);
                        const deleteTicket = async() => {
                            return await fetch(`${ApiUrl}/items/ticket/${deleteticketbtn}`, {
                                method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'}
                            }).then(response => response.json()).then(result => result.data)
                        };
                        let DeletedTicket = await deleteTicket();
                        console.log(DeletedTicket);
                        ticketValues = [];
                        res.redirect('/panel/support/tickets-list');
                        return
                    }
                } else {
                    res.redirect('/panel/support/tickets-list');
                }
            } else {
                res.redirect('/panel/support/tickets-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = supportBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Supprimer un ticket'
            console.log('THE END OF THE CALL');

            res.render('panel/ticket-delete', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, ticketInfos, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Ticket Delete: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    becomeAnAuthor: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            
            let user = [], dates = [], roles = [], dateValues = [], userInfo = [];
            const getUserValues = async() => {
                return await fetch(`${ApiUrl}/users/me?fields=first_name,last_name,pseudonyme,role,status,date_published,date_archived,date_cancelled`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)
                .then(content => {return user.push({firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, status: content.status}), dates.push({date_published: content.date_published},{date_archived: content.date_archived},{date_cancelled: content.date_cancelled}), roles.push({role: content.role})})
            };
            await getUserValues(); 
            
            roles = await getRoleValues(ApiUrl, roles, req.accessToken); 
            formatDateValues(dates, dateValues);
            user.map((content,i) => {userInfo.push({firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, role: roles[i].name, status: userStatusList.filter(value => value.status == content.status).map(content => {return content.value}).reduce((acc,value) => acc + value), dates: dateValues.map(date => {return {title: date.title, date: date.date}})})});

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push(content)});
            managerBtnList = supportBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Devenir un Auteur'
            console.log('THE END OF THE CALL');

            res.render('panel/become-an-author', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, userStatusValue, userInfo});
        }
        catch(error) {
            console.error('Erreur Become-an-Author page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    recipesManagerHomePage: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = recipeBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Manager - Gestion des recettes'
            console.log('THE END OF THE CALL');

            res.render('panel-manager/withoutuser-index', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Recipes-Manager Homepage: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    recipeCreate: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const recipeValue = req.body, {title, image, people, description, imageDescription, labelDescription, labelURL, cookingIngredient, cookingTool, cookingRecipe} = req.body;
            let newRecipe, peopleNumber = '1', categories = [], titre = [{title:'Type de recettes'},{title:'Boulangerie'},{title:'Pâtisserie & Viennoiserie'},{title:'Type de pâtes'},{title:'Autres catégories'}], minmax = [[0,6],[9,14],[13,27],[26,33],[5,10]], categoriesList = [], propertiesList = ['title','image','description','imageDescription','labelDescription','labelURL','cookingIngredient','cookingTool','cookingRecipe','people'], recipeValues = [];
            const getAllCategories = async() => {
                return await fetch(`${ApiUrl}/items/Category?fields=id,title`).then(response => response.json()).then(result => result.data)
            };
            const postNewRecipe = async(ingredient) => {
                return await fetch(`${ApiUrl}/items/Recipe`, {
                        method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                        body: JSON.stringify({
                            'title': title,
                            'description': description,
                            'image': image,
                            'imageDescription': imageDescription,
                            'labelDescription': labelDescription,
                            'labelURL': labelURL,
                            'cookingTool': cookingTool,
                            'cookingIngredient': ingredient,
                            'cookingRecipe': cookingRecipe,
                            'peopleNumber': people,
                            'user_id': req.userID,
                        })
                    }).then(response => response.json()).then(result => result.data)
            };
            const patchNewRecipeCategories = async(recipe, ctg) => {
                await fetch(`${ApiUrl}/items/Recipe/${recipe.id}`, {
                    method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                    body: JSON.stringify({
                        'category_id': ctg
                    })
                }).then(response => response.json()).then(result => result.data)
            };
            function hasNumber(myString) {return /\d/.test(myString)};
            const mapCategoriesList = (title, ctg, minmax, final) => {
                title.map((content,i) => {
                    let min = minmax[i][0].toString(), max = minmax[i][1].toString(), array = filterCategories(ctg, min, max);
                    return final.push({title: content.title, name: content.name, data: array.map(value => {return {id: value.id, name: value.title, value: value.id}})})
                })
            };
            categories = await getAllCategories(), categories = categories.sort((a,b) => {return a.id - b.id});
            mapCategoriesList(titre, categories, minmax, categoriesList);
            recipeValues = recipeValue; let recipeTempValues = [];
            const filteredRecipeValues = (array, allowed) => {return Object.keys(array).filter(key => !allowed.includes(key)).reduce((obj, key) => {obj[key] = array[key];return obj}, {})};
            recipeTempValues = filteredRecipeValues(recipeValues, propertiesList); recipeTempValues = Object.values(recipeTempValues).filter(Boolean), recipeTempValues = recipeTempValues.sort((a,b) => {return a - b}), recipeValues = [];
            recipeTempValues.map(content => {return categories.filter(category => category.id == content).map(content => {return recipeValues.push(content.id)})});
            
            if(isObjEmpty(recipeValue) == false) {
                let cookingIngredientList = [], cookingIngredientArray = [];
                if(hasNumber(cookingIngredient) === true) {
                    cookingIngredientArray = cookingIngredient.split('\n');
                    divideNumber(cookingIngredientArray, cookingIngredientList, people);
                }
                if(title && image && description && imageDescription && labelDescription && labelURL && cookingIngredientList && cookingTool && cookingRecipe && people) {
                    newRecipe = await postNewRecipe(cookingIngredientList);
                    console.log('newRecipe: ', newRecipe);
                    let newCategory = await patchNewRecipeCategories(newRecipe, recipeValues);
                    console.log(newCategory);
                    return res.redirect('/panel/manager/recipes-list');
                }
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = recipeBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Manager - Créer une recette'
            console.log('THE END OF THE CALL');

            res.render('panel-manager/recipe-create', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, recipeFormTextareaList, recipeFormTypeList, peopleNumber, userStatusValue, categoriesList});
        }
        catch(error) {
            console.error('Erreur Recipe-Create page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    recipesList: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const inputID = req.body;
            const {input, tag} = req.body, sort = req.body.sort;
            let tagTypeList = [], statusType = [];

            const fetchManagerRecipes = async(status) => {
                const getAuthorRecipeID = async() => {
                    return await fetch(`${ApiUrl}/users/me?fields=recipe_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                };
                const getAllRecipesID = async() => {
                    return await fetch(`${ApiUrl}/items/Recipe?fields=id,status`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)
                };
                const getAllRecipesIDFilterStatus = async(status) => {
                    return await fetch(`${ApiUrl}/items/Recipe?fields=id,status&filter=[status][_eq]=${status.value}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)
                };
                let recipesID = [], recipesAuthorID = [], recipesValues = [], recipesStatus = [], statusList = [];
                Recipes = [];
                if(req.roleID == process.env.ADMIN_ROLE) {
                    if(!status) {
                        recipesID.push(await getAllRecipesID());
                    } else {
                        status = status[0];
                        recipesID.push(await getAllRecipesIDFilterStatus(status));
                    }
                    if(isObjEmpty(recipesID) == false || typeof recipesID !== undefined) {
                        if(!status) recipesID = recipesID.reduce((acc,value) => acc + value); else recipesID = recipesID.reduce((acc,value) => acc + value).filter(content => content.status == status.value);
                        if(isObjEmpty(recipesID) == false) {
                            const getRecipesValues = await Promise.all(recipesID.map(recipe => {return fetch(`${ApiUrl}/items/Recipe/${recipe.id}?fields=id,title,description,image,imageDescription,labelDescription,labelURL,date_published,status,user_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)})); getRecipesValues.map(content => {return recipesAuthorID.push({id: content.user_id}), recipesStatus.push({status: content.status})});
                            const getAuthorValues = await Promise.all(recipesAuthorID.map(user => {return fetch(`${ApiUrl}/users/${user.id}?fields=pseudonyme`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)})); 
                            recipesStatus.map(content => {statusTypeList.filter(value => value.value == content.status).map(content => {return statusList.push({status: content.status, color: content.color})})});
                            getRecipesValues.map((content,i) => {return recipesValues.push({id: content.id, title: content.title, description: content.description, image: content.image, imageDescription: content.imageDescription, labelDescription: content.labelDescription, labelURL: content.labelURL, date_published: content.date_published, status: statusList[i].status, statuscolor: statusList[i].color, user: getAuthorValues[i].pseudonyme})});
                            return recipesValues
                        }
                    }
                    return
                } else if(req.roleID == process.env.AUTHOR_ROLE) {
                    let authorRecipes = await getAuthorRecipeID();
                    if(isObjEmpty(authorRecipes.recipe_id) == false) {
                        recipesID = authorRecipes.recipe_id;
                        const getRecipesValues = await Promise.all(recipesID.map(recipe => {return fetch(`${ApiUrl}/items/Recipe/${recipe}?fields=id,title,description,image,imageDescription,labelDescription,labelURL,date_published,status,user_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)})); getRecipesValues.map(content => {return recipesStatus.push({status: content.status})});
                        const getUserValues = await fetch(`${ApiUrl}/users/me?fields=pseudonyme`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data); 
                        recipesStatus.map(content => {statusTypeList.filter(value => value.value == content.status).map(content => {return statusList.push({status: content.status, color: content.color})})});
                        getRecipesValues.map((content,i) => {return recipesValues.push({id: content.id, title: content.title, description: content.description, image: content.image, imageDescription: content.imageDescription, labelDescription: content.labelDescription, labelURL: content.labelURL, date_published: content.date_published, status: statusList[i].status, statuscolor: statusList[i].color, user: getUserValues.pseudonyme})});
                        return recipesValues

                    } else {
                        return recipesID = [];
                    }
                }
            };
            console.log(input, tag)
            if(input || tag || input && tag) {
                let data, dataValue = [], TempInput, getTempInput;
                if(input) {
                    data = input;
                    console.log('data: ', data, isString(data));
                    if(isObjEmpty(data) == false) {
                        if(isString(data) == false) {
                            data.forEach(element => {
                                dataValue.push({value: element});
                            });
                            console.log('dataValue: ', dataValue);
                            tagTypeList = dataValue.map(content => {
                                return statusTypeList.filter(element => element.value == content.value)
                            }).flatMap(e => e).flat(1);
                            store.set('TempInput', tagTypeList);
                            statusTypeList.map(content => {
                                let filter = dataValue.filter(element => element.value == content.value);
                                if(isObjEmpty(filter) == false) {
                                    statusType.push({value: content.value, status: content.status, color: content.color, checked:'yes'})
                                } else {
                                    statusType.push({value: content.value, status: content.status, color: content.color})
                                }
                            });
                        } else {
                            let dataArray = [];
                            statusTypeList.filter(content => content.value == data).map(content => {
                                dataArray.push(content), store.set('TempInput', dataArray);
                                return tagTypeList.push({value: content.value, status: content.status, color: content.color})
                            });
                            statusTypeList.map(content => {
                                let filter = dataArray.filter(element => element.value == content.value);
                                if(isObjEmpty(filter) == false) {
                                    statusType.push({value: content.value, status: content.status, color: content.color, checked:'yes'})
                                } else {
                                    statusType.push({value: content.value, status: content.status, color: content.color})
                                }
                            });
                        }

                        Recipes = await fetchManagerRecipes(tagTypeList);
                        if(typeof Recipes == 'undefined') Recipes = []
                    } else {
                        console.log('TempInput is null');
                    }
                    console.log('Session Input: ', store.get('TempInput'));
                }
                else if(tag) {
                    getTempInput = store.get('TempInput'); // On appelle les ids contenus dans localStorage
                    if(getTempInput === null || getTempInput === undefined || isObjEmpty(getTempInput) == true) {
                        console.log('Filter error redirect');
                        return res.redirect('/panel/manager/recipes-list');
                    } else {
                        if (isString(getTempInput) == false) {
                            const filterData = getTempInput.filter(content => content.value !== tag); // On filtre les valeurs en fonction de la valeur contenu dans tag
                            console.log('filter: ', filterData);
                            store.remove('TempInput');
                            store.set('TempInput', filterData);
                            tagTypeList = filterData
                            statusTypeList.map(content => {
                                let filter = filterData.filter(element => element.value === content.value);
                                if(isObjEmpty(filter) == false) {
                                    statusType.push({value: content.value, status: content.status, color: content.color, checked:'yes'})
                                } else {
                                    statusType.push({value: content.value, status: content.status, color: content.color})
                                }
                            });
                            if(isObjEmpty(filterData)) return res.redirect('/panel/manager/recipes-list');
                        } else if (isString(getTempInput) == true) {
                            console.log('Je suis un string pas un array')
                            console.log('TempInput: ', TempInput);
                            console.log('Input: ', inputID, ' data: ', data);
                        }
                    }
                }
            } else {
                Recipes = await fetchManagerRecipes();
                statusType = statusTypeList;
            }

            // Sort By Element
            // voir controller_doc pour plus d'infos
            let sortDropdown = [], sortValues;

            if(typeof sort == 'undefined' || sort == '') {
                sortDropdown = sortDropdownList;
                console.log('SortID: Nothing to see', ' SortDropdown: ', sortDropdown);
            } else if(isObjEmpty(sort) == false) {
                sort = sort[0];
                const getValuesFromSortList = () => {
                    return sortList.filter(value => value.id == sort).map(content => {content.exec(Recipes); return content})
                };
                sortValues = getValuesFromSortList();
                sortValues.map(content => {sortDropdown.push({id: content.id, title: content.title})});
                console.log('Sort Dropdown: ', sortDropdown);
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = recipeBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Manager - Liste des recettes'
            console.log('THE END OF THE CALL');

            res.render('panel-manager/recipes-list', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, Recipes, statusType, tagTypeList, sortList, sortDropdown, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Recipes-List page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    recipeUpdate: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const {RecipeID} = req.params;
            const {status, title, image, description, imageDescription, labelDescription, labelURL, cookingIngredient, cookingTool, cookingRecipe, inputrecipeticket} = req.body;
            console.log('ID: ', RecipeID);
            let recipeValues = [],recipeFormTextarea = [], recipeFormType = [], statusTypeBtn = [{value:'nothing'}], userValueID, oldUserValueID, userValues = [], content, roleValue, role, peopleNumber = '1', recipeIngredient = [], categoriesList = [], recipeInfo = [], dateNowAPI = dayjs(new Date(), 'M/D/Y').format('YYYY-MM-DD');
            const fetchRecipeValues = async() => {
                let getUserRecipeID = [], getUserRecipeList = [], getUserRecipe = [];
                if(req.roleID == process.env.AUTHOR_ROLE) getUserRecipe = await fetch(`${ApiUrl}/users/me?fields=recipe_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data), getUserRecipeID.push(getUserRecipe);
                else if(req.roleID == process.env.ADMIN_ROLE) getUserRecipeID = await fetch(`${ApiUrl}/users?fields=recipe_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                getUserRecipeID.map(content => {if(isObjEmpty(content.recipe_id) == false) return getUserRecipeList.push(content.recipe_id)});
                getUserRecipeID = getUserRecipeList.reduce((acc,value) => acc + value);
                let filterRecipeID = getUserRecipeID.filter(value => value == RecipeID);
                if(isObjEmpty(getUserRecipeID) == false && isObjEmpty(filterRecipeID) == false) {
                    return await fetch(`${ApiUrl}/items/Recipe/${RecipeID}?fields=id,title,image,description,imageDescription,labelDescription,labelURL,cookingIngredient,cookingTool,cookingRecipe,peopleNumber,date_published,date_archived,date_cancelled,user_id,old_user_id,status,category_id,messageTicketRedirection`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                }
            };
            const pushFormValues = (arrayList, array) => {
                return arrayList.map(content => {
                    if(content.title == 'Titre de la recette') array.push({id: content.id, title: content.title, type: content.type, name: content.name, value: recipeValues[0].title})
                    else array.push({id: content.id, title: content.title, type: content.type, name: content.name, value: recipeValues[0].image})
                });
            };
            const pushTextareaValues = (arrayList, array, result) => {
                return arrayList.map((content,i) => {
                    array.push({id: content.id, title: content.title, placeholder: content.placeholder, maxlength: content.maxlength, name: content.name, value: result[i].value});
                })
            };
            const fetchUserValues = async(id, array2, old_id) => {
                const getUserValues = await fetch(`${ApiUrl}/users/${id}?fields=id,first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data);
                if(getUserValues.length == 0) {
                    const getOldUserValues = await fetch(`${ApiUrl}/items/old_users/${old_id}?fields=id,first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data);
                    content = getOldUserValues;
                    roleValue = getOldUserValues.role;
                } else {
                    content = getUserValues;
                    roleValue = getUserValues.role;
                }
                role = await fetch(`${ApiUrl}/roles/${roleValue}?fields=name,color,icon`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data);

                return array2.push({firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.avatar}?width=50&height=50`, role: role.name, color: role.color, icon: role.icon})
            };
            const getAllCategories = async() => {
                return await fetch(`${ApiUrl}/items/Category?fields=id,title`).then(response => response.json()).then(result => result.data)
            };
            let isValueExist = await fetchRecipeValues();
            if(noAlphaNum(RecipeID) == true && typeof isValueExist !== 'undefined') {
                    recipeValues = [], recipeDateValues = [], statusTypeBtn = [], recipeStatusValue = [];
                    let recipeTempValues = [], recipeFilteredValues = [], categories = [], recipeValue = [], categoryChecked = [];
                    const titre = [{title:'Type de recettes'},{title:'Boulangerie'},{title:'Pâtisserie & Viennoiserie'},{title:'Type de pâtes'},{title:'Autres catégories'}], minmax = [[0,6],[9,14],[13,27],[26,33],[5,10]], propertiesList = ['title','image','description','imageDescription','labelDescription','labelURL','cookingIngredient','cookingTool','cookingRecipe','people'];
                    recipeValues.push(isValueExist);
                    recipeValues.map(content => {
                        if(content.date_published) recipeTempValues.push({date_published: content.date_published})
                        if(content.date_archived) recipeTempValues.push({date_archived: content.date_archived})
                        if(content.date_cancelled) recipeTempValues.push({date_cancelled: content.date_cancelled})
                        statusTypeList.filter(status => status.value == content.status).map(status => {
                            return statusTypeBtn.push({status: status.status, color: status.color, value: status.value}), recipeStatusValue.push({status: status.status, color: status.color, value: status.value, ticket: content.messageTicketRedirection})
                        });
                        recipeInfo.push({id: content.id, title: content.title, image: content.image, imageDescription: content.imageDescription, labelDescription: content.labelDescription, labelURL: content.labelURL})
                        categoryChecked = content.category_id; peopleNumber = content.peopleNumber;
                    })
                    formatDateValues(recipeTempValues, recipeDateValues);
                    // console.log('recipeDateValues: ', recipeDateValues);
                    userValueID = recipeValues[0].user_id, oldUserValueID = recipeValues[0].old_user_id;
                    await fetchUserValues(userValueID, userValues, oldUserValueID);

                    const mapCategoriesList = (title, ctg, minmax, final) => {
                        title.map((content,i) => {
                            let min = minmax[i][0].toString(), max = minmax[i][1].toString(), array = filterCategories(ctg, min, max);
                            return final.push({title: content.title, name: content.name, data: array.map(value => {return {id: value.id, name: value.title, value: value.id}})})
                        })
                    };
                    categories = await getAllCategories(), categories = categories.sort((a,b) => {return a.id - b.id});
                    mapCategoriesList(titre, categories, minmax, categoriesList);
                    recipeFilteredValues = recipeValue; recipeTempValues = [];
                    propertiesList.map(value => {
                        if(Object.prototype.hasOwnProperty.call(recipeValues, value)) {
                            delete recipeValues[value]
                        }
                    });
                    recipeFilteredValues = Object.values(recipeFilteredValues).filter(Boolean), categoriesList.map(content => {return content.data.filter((category,i) => category.id == recipeFilteredValues[i]).map(content => {return recipeTempValues.push(content.id)})}), recipeFilteredValues = recipeTempValues;
                    categoriesList.map(content => {
                        content.data.map(input => {
                            let filter = categoryChecked.filter(value => input.id == value);
                            if(isObjEmpty(filter) == false) {input.checked = 'checked'}
                        })
                    });
                    if(isObjEmpty(recipeValues) == false && recipeFormType.length == 0 && recipeFormTextarea.length == 0) {
                        recipeTempValues = [];
                        recipeValues.map(content => {
                            recipeTempValues.push({value: content.description},{value: content.imageDescription},{value: content.labelDescription},{value: content.labelURL},{value: content.cookingIngredient},{value: content.cookingTool},{value: content.cookingRecipe})
                        })
                        pushFormValues(recipeFormTypeList, recipeFormType);
                        pushTextareaValues(recipeFormTextareaList, recipeFormTextarea, recipeTempValues);
                    }
                    if(typeof status !== 'undefined') {
                        console.log(status);
                        console.log('Input non vide');
                        if(req.roleID == process.env.ADMIN_ROLE && status !== undefined) {
                            console.log('On passe sur status');
                            console.log('Status: ', status);
                            let dateTempValues = []; 
                            const dateAlreadyExisting = () => {
                                return recipeValues.map(content => {
                                    if(typeof content.date_published !== 'undefined' && status == 'published') return dateTempValues.push(content.date_published)
                                    if(typeof content.date_archived !== 'undefined' == false && status == 'archived') return dateTempValues.push(content.date_archived)
                                    if(typeof content.date_cancelled !== 'undefined' && status == 'cancelled') return dateTempValues.push(content.date_cancelled)
                                })
                            }, patchUpdatedStatus = async(date) => {
                                return await fetch(`${ApiUrl}/items/Recipe/${RecipeID}`, {
                                    method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken, 'Content-Type': 'application/json', 'Accept': 'application/json'},
                                    body: JSON.stringify({
                                        'status': status,
                                        'date_published': date.datePublished,
                                        'date_archived': date.dateArchived,
                                        'date_cancelled': date.dateCancelled
                                    })
                                }).then(response => response.json()).then(result => result.data)
                            };
                            statusTypeBtn = [], recipeDate = [], recipeTempValues = [];
                            filterObjectStatus(statusTypeList, recipeDate, status, statusTypeBtn), dateAlreadyExisting();
                            recipeDate = recipeDate.flatMap(e => e).flat(1);
                            recipeDate.map(content => {
                                console.log(content)
                                if(content.date_published) return recipeTempValues.push({datePublished: dateNowAPI})
                                if(content.date_archived) return recipeTempValues.push({dateArchived: dateNowAPI})
                                if(content.date_cancelled) return recipeTempValues.push({dateCancelled: dateNowAPI})
                            });
                            if(isObjEmpty(dateTempValues) == true) {
                                if(isObjEmpty(recipeTempValues) == true) {
                                    await patchUpdatedStatus(recipeTempValues);
                                } else {
                                    await patchUpdatedStatus(recipeTempValues[0]);
                                }
                            } else {
                                await patchUpdatedStatus(recipeTempValues);
                            }
                            return res.redirect(`/panel/manager/recipe/update/${RecipeID}`);
                        }
                    } else if(title) {
                        let filterFormType = recipeFormType.filter(content => content.value !== title).filter(content => content.value !== image);
                        let filterFormTextarea = recipeFormTextarea.filter(content => content.value !== description).filter(content => content.value !== imageDescription).filter(content => content.value !== labelDescription).filter(content => content.value !== labelURL);
                        const patchUpdatedRecipe = async() => {
                            return await fetch(`${ApiUrl}/items/Recipe/${RecipeID}`, {
                                method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                    body: JSON.stringify({
                                        'title': title,
                                        'description': description,
                                        'image': image,
                                        'imageDescription': imageDescription,
                                        'labelDescription': labelDescription,
                                        'labelURL': labelURL,
                                        'cookingTool': cookingTool,
                                        'cookingIngredient': cookingIngredient,
                                        'cookingRecipe': cookingRecipe,
                                        'category_id': recipeTempValues
                                    })
                                }).then(response => response.json()).then(result => result.data)
                        };
                        if(filterFormType || filterFormTextarea) {
                            let UpdatedRecipe = await patchUpdatedRecipe();
                            console.log('Updated Recipe: ', UpdatedRecipe);
                            if(UpdatedRecipe) {
                                res.redirect('/panel/manager/recipes-list');
                                return 
                            }
                        }
                    } else if(inputrecipeticket) {
                        let filterTicketMessage = recipeValues.filter(content => content.messageTicketRedirection == inputrecipeticket).map(content => {return content.messageTicketRedirection});
                        const patchUpdatedRecipeTicket = async(ticket) => {
                            return await fetch(`${ApiUrl}/items/Recipe/${RecipeID}`, {
                                method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken, 'Content-Type': 'application/json', 'Accept': 'application/json'},
                                body: JSON.stringify({
                                    'messageTicketRedirection': ticket
                                })
                            }).then(response => response.json()).then(result => result.data)
                        };
                        if(inputrecipeticket == 0 && isObjEmpty(filterTicketMessage) == true) {
                            await patchUpdatedRecipeTicket(null);
                        } else if(isObjEmpty(filterTicketMessage) == true) {
                            await patchUpdatedRecipeTicket(inputrecipeticket);
                        }
                       return res.redirect(`/panel/manager/recipe/update/${RecipeID}`);
                    }
            } else {
                return res.redirect('/panel/manager/recipes-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = recipeBtnList, userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Modifier une recette'
            console.log('THE END OF THE CALL');

            res.render('panel-manager/recipe-update', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, recipeFormType, recipeFormTextarea, statusTypeList, statusTypeBtn, recipeStatusValue, recipeDateValues, userValues, peopleNumber, recipeIngredient, categoriesList, recipeInfo, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Recipe-Update page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    recipeDelete: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {RecipeID} = req.params;
            const {deleterecipe} = req.body;
            const fetchRecipeValues = async() => {
                let getUserRecipeID;
                if(req.roleID == process.env.AUTHOR_ROLE) getUserRecipeID = await fetch(`${ApiUrl}/users/me?fields=recipe_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                else if(req.roleID == process.env.ADMIN_ROLE) getUserRecipeID = await fetch(`${ApiUrl}/users?fields=recipe_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                getUserRecipeID = getUserRecipeID.recipe_id;
                let filterRecipeID = getUserRecipeID.filter(value => value == RecipeID);
                if(isObjEmpty(getUserRecipeID) == false && isObjEmpty(filterRecipeID) == false) {
                    return await fetch(`${ApiUrl}/items/Recipe/${RecipeID}?fields=id,title,image,imageDescription,labelDescription,labelURL,date_published,status,category_id&filter=[status][_eq]=published`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                }
                
            };
            let recipeValues = await fetchRecipeValues();
            if(noAlphaNum(RecipeID) == true && typeof recipeValues !== 'undefined') {
                if(typeof deleterecipe == 'undefined') {
                    Recipes = [], Recipes.push(recipeValues);
                    console.log(Recipes);
                } else {
                    console.log('Input:', deleterecipe)
                    const postDeletedRecipe = async() => {
                        return await fetch(`${ApiUrl}/items/Recipe/${deleterecipe}`, {method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    };
                    let DeletedRecipe = await postDeletedRecipe();
                    console.log(DeletedRecipe);
                    recipeValues = [];
                    return res.redirect('/panel/manager/recipes-list');
                }
            } else {
                return res.redirect('/panel/manager/recipes-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = recipeBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Supprimer une recette'
            console.log('THE END OF THE CALL');

            res.render('panel-manager/recipe-delete', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, Recipes, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Recipe-Delete page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    statistics: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const {user, recipe} = req.body;
            let usersList = [], userSelected = [], recipesList = [], recipeSelected = [], users = [], roles = [], favoritesValues = []; var recipeValues = [], recipeDates = [], authorID = [];
            const getAllUsersList = async() => {return await fetch(`${ApiUrl}/users?fields=id,first_name,last_name,pseudonyme,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                .then(data => {data.map(content => {return users.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme}),roles.push({role: content.role})})})
            };
            const getUserRecipes = async(id) => {
                let getRecipesID;
                if(req.roleID === process.env.AUTHOR_ROLE) getRecipesID = await fetch(`${ApiUrl}/users/me?fields=recipe_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data);
                else if(req.roleID === process.env.ADMIN_ROLE) getRecipesID = await fetch(`${ApiUrl}/users/${id}?fields=recipe_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data);
                let array = []; array.push(getRecipesID.recipe_id); array = array.reduce((acc, value) => acc + value);
                return await Promise.all(array.map(recipe => {return fetch(`${ApiUrl}/items/Recipe/${recipe}?fields=id,title`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)})).then(data => {data.map(content => {return recipesList.push({id: content.id, title: content.title})})})
            };
            const getRecipeAuthorValues = async() => {
                const getAuthorValues = await fetch(`${ApiUrl}/items/Recipe/${recipe}?fields=id,title,image,user_id,date_published`).then(response => response.json()).then(result => result.data);
                recipeValues.push({id: getAuthorValues.id, title: getAuthorValues.title, image: getAuthorValues.image, date_published: getAuthorValues.date_published});
                return await fetch(`${ApiUrl}/users/${getAuthorValues.user_id}?fields=id,first_name,last_name,pseudonyme,role`).then(response => response.json()).then(result => result.data)
            };
            const getRecipeFavorites = async(id) => {
                return await fetch(`${ApiUrl}/items/Recipe/${id}?fields=favorites_recipes_users`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
            };
            let favorites = await getRecipeFavorites(recipe);
            const filterRecipe = (array) => {return array.filter(content => content.id == recipe)};
            if(req.roleID === process.env.AUTHOR_ROLE) {
                userSelected = [{firstname: 'Vous'}]; usersList = [];
                await getUserRecipes(); recipeSelected = [];
                // console.log('recipesList: ', recipesList);
                if(recipesList.length == 0) recipeSelected = [], recipeSelected.push({title:'Vous n\'avez publié aucune recette'}), recipesList.push({title:'Ouvrir le menu n\'affichera pas plus de recettes qu\'avant'}), favoritesValues.push({error:'Aucune recette publiée'});
                else recipeSelected = [], recipeSelected.push({title:'Veuillez sélectionner une recette'}); console.log(recipeSelected)
            } else if(req.roleID === process.env.ADMIN_ROLE) {
                await getAllUsersList(); roles = await getRoleValues(ApiUrl, roles, req.accessToken);
                users.map((content,i) => {return usersList.push({id: content.id, firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, role: roles[i].name, color: roles[i].color})});
                if(user || recipe) {
                    console.log(user, recipe);
                    let userFilter = usersList.filter(content => content.pseudonyme == user);
                    // console.log('userFilter: ', userFilter);
                    if(isObjEmpty(userFilter) == false && typeof user !== 'undefined') {
                        userFilter.map(content => {return userSelected.push({firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, role: content.role, color: content.color}), authorID.push(content.id)});
                        await getUserRecipes(authorID);
                        if(recipesList.length == 0) recipeSelected = [], recipeSelected.push({title:'Cet utilisateur n\'a publié aucune recette'}), recipesList.push({title:'Ouvrir le menu n\'affichera pas plus de recettes qu\'avant'}), favoritesValues.push({error:'Aucune recette pour cet utilisateur'});
                        else recipeSelected = [], recipeSelected.push({title:'Veuillez sélectionner une recette'});
                    } else {
                        console.log('Rien par ici');
                    }
                } else {
                    userSelected.push({firstname: 'Veuillez sélectionner un utilisateur'});
                    recipeSelected.push({title:'Veuillez sélectionner un utilisateur'});
                }
            }
            if(recipe) {
                if(req.roleID == process.env.AUTHOR_ROLE) {
                    await getRecipeAuthorValues();
                } else if(req.roleID == process.env.ADMIN_ROLE) {
                    authorID.push(await getRecipeAuthorValues());
                    await getUserRecipes(authorID[0].id), roles = await getRoleValues(ApiUrl, authorID, req.accessToken);
                    authorID.map((content,i) => {return userSelected.push({firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, role: roles[i].name, color: roles[i].color})});
                }
                if(!favorites.favorites_recipes_users) favorites = {favorites_recipes_users: []}
                favoritesValues.push({title:'Ajouter aux favoris', value:favorites.favorites_recipes_users.length, content:'fois'});
                if(isObjEmpty(filterRecipe(recipesList)) == false) {
                    recipeSelected = [];
                    formatDateValues(recipeValues, recipeDates);
                    filterRecipe(recipesList).map((content,i) => {return recipeSelected.push({id: content.id, title: content.title, image: recipeValues[i].image, dateTitle: recipeDates[i].title, date: recipeDates[i].date})});
                }
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push(content)});
            managerBtnList = recipeBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Statistiques des recettes'
            console.log('THE END OF THE CALL');

            res.render('panel-manager/statistics', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, userStatusValue, usersList, userSelected, recipesList, recipeSelected, favoritesValues});
        }
        catch(error) {
            console.error('Erreur Statistics page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    adminHomePage: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = adminBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Page d\'administration';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/admin-index', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Admin-Homepage page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    userslist: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {surname, pseudonyme, role, status} = req.body;
            const searchID = req.query.searchuser;
            let usersList = [], users = [];
            const sortingBtnList = [{title:'Image', name:'image', type:'button', value:''},{title:'Surnom', name:'surname', type:'submit', value:'surname'},{title:'Pseudonyme', name:'pseudonyme', type:'submit', value:'pseudonyme'},{title:'Rôle', name:'role', type:'submit', value:'role'},{title:'Status', name:'status', type:'submit', value:'status'}];
            const fetchAllUsers = async() => {
                users = [], usersList = [];

                if(typeof searchID !== 'undefined') {
                    const getSearchedUser = await(
                        await fetch(`${ApiUrl}/users?search=${searchID}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                        userStatusList.filter(status => status.status == content.status).map(status => {
                            users.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, image: content.avatar, status: status.value, statuscolor: status.color, role: content.role})
                        });
                        return users = users.filter(value => value.firstname !== null && value.role !== null);
                    });
                } else {
                    const getAllUsers = await(
                        await fetch(`${ApiUrl}/users`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                        userStatusList.filter(status => status.status == content.status).map(status => {
                            if(isString(content.role) == false) users.push({id: content.id, firstname: '', lastname: content.last_name, pseudonyme: content.pseudonyme, image: '', status: status.value, statuscolor: status.color}); else users.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, image: content.avatar, status: status.value, statuscolor: status.color, role: content.role})
                        });
                        return users = users.filter(value => value.firstname !== null && value.role !== null);
                    });
                }
                const getAllRoles = await getRoleValues(ApiUrl, users, req.accessToken);

                const pushResult = (user, role, final) => {
                    return user.flatMap((content,i) => {
                        if(typeof role[i] == 'undefined') final.push({id: content.id, firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.image}?width=108&height=61`, status: content.status, statuscolor: content.statuscolor, role: 'A valider', color: ''}); else final.push({id: content.id, firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.image}?width=108&height=61`, status: content.status, statuscolor: content.statuscolor, role: role[i].name, color: role[i].color})
                    });
                };
                pushResult(users, getAllRoles, usersList);
                
                return usersList.filter( Boolean )
            };
            if(typeof req.body !== 'undefined') {
                const sortArray = (arr) => {
                    let x; let y;
                    return arr.sort((a,b) => {
                        if(surname) {x = a.firstname; y = b.firstname;}
                        if(pseudonyme) {x = a.pseudonyme; y = b.pseudonyme;}
                        if(role) {x = a.role; y = b.role;}
                        if(status) {x = a.status; y = b.status;}
                        return x == null || y == null ? 0 : x.localeCompare(y)
                    })
                };
                usersList = await fetchAllUsers() && sortArray(usersList);
            } else {
                usersList = await fetchAllUsers();
            }
            // console.log('Userslist: ', usersList);
            
            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = adminBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList); 
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Gestion des utilisateurs';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/users-list', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, usersList, userStatusValue, sortingBtnList});
        }
        catch(error) {
            console.error('Erreur Users-List page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    userUpdate: async(req,res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {role, status, surname, pseudonyme, description, image} = req.body;
            const {pseudonymeID} = req.params;
            let profileInfo = [], user = [], profileUserID, rolesList = [], profileDateValues = [], statusDate = [], profileDate = [];

            const getUserValues = async(user) => {
                return await fetch(`${ApiUrl}/users?search=${user}&fields=id,pseudonyme`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
            }
            let isValueExist = await getUserValues(pseudonymeID);
            if(typeof isValueExist !== 'undefined' && isObjEmpty(isValueExist) == false) {
                const fetchUserData = async() => {
                    const getUserData = await(
                        await fetch(`${ApiUrl}/users?search=${pseudonymeID}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                        if(content.role === process.env.ADMIN_ROLE) {
                            user.push({firstname: content.first_name, lastname: content.last_name, image: content.avatar, pseudonyme: content.pseudonyme, role: content.role, status: content.status, message:'Vous ne pouvez pas éditer les informations de cet utilisateur', error:'Utilisateur non éditable'})
                        } else if(!content.role) {
                            user.push({firstname: '', lastname: content.last_name, image: content.avatar, pseudonyme: content.pseudonyme, email: content.email, description: content.description, role: 'A valider', status: content.status});
                            profileUserID = content.id
                        } else {
                            user.push({firstname: content.first_name, lastname: content.last_name, image: content.avatar, pseudonyme: content.pseudonyme, email: content.email, description: content.description, role: content.role, status: content.status});
                            profileUserID = content.id
                            profileDate.push({date_published: content.date_published},{date_archived: content.date_archived},{date_cancelled: content.date_cancelled});
                            return user = user.filter(value => value.firstname !== null && value.role !== null && value.status !== null), profileDate
                        }
                    });
                    // console.log('User: ', user);
                    const getUserRole = await Promise.all(
                        user.map(content => {
                            return fetch(`${ApiUrl}/roles/${content.role}?fields=name,icon,color`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                        })  
                    );
                    // console.log('Role: ', getUserRole);
                    const pushResult = (user, role, final) => {
                        return user.flatMap((content,i) => {
                            userStatusList.filter(value => value.status == content.status).map(status => {
                                if(content.message) {
                                    final.push({firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.image}?width=250&height=250`, role: role[i].name, color: role[i].color, icon: role[i].icon, message: content.message, error: content.error});
                                } else if(content.role === 'A valider') {
                                    final.push({id: content.id, firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.image}?width=250&height=250`, email: content.email, description: content.description, status: status.value, statuscolor: status.color, role: content.role, color: '', icon: 'edit'})
                                } else {
                                    final.push({id: content.id, firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, image: `${ApiUrl}/assets/${content.image}?width=250&height=250`, email: content.email, description: content.description, status: status.value, statuscolor: status.color, role: role[i].name, color: role[i].color, icon: role[i].icon})
                                }
                            })
                        })
                    };
                    pushResult(user, getUserRole, profileInfo);
                    
                    return profileInfo.filter( Boolean )
                };
                profileInfo = await fetchUserData();
                // console.log('Profile: ', profileInfo);
    
                const fetchAllRoles = async() => {
                    return await fetch(`${ApiUrl}/roles`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                };
                rolesList = await fetchAllRoles();

                const patchUserRole = async(role) => {
                    return await fetch(`${ApiUrl}/users/${profileUserID}`, {method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                        body: JSON.stringify({
                            'role': role[0].role,
                        })
                    }).then(response => response.json()).then(result => result.data)
                };
                const patchUserUpdateProfile = async(array, profileUserID) => {
                    return await Promise.all(array.map(content => {
                        fetch(`${ApiUrl}/users/${profileUserID}`, {
                            method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                            body: JSON.stringify({
                                'first_name': content.surname,
                                'last_name': '',
                                'email': content.email,
                                'description': content.description,
                                'avatar': content.image,
                            })
                        }).then(response => response.json()).then(result => result.data) 
                    }))  
                };
                const patchUpdatedStatus = async(value) => {
                    return await fetch(`${ApiUrl}/users/${profileUserID}`, {method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                        body: JSON.stringify({
                            'status': status,
                            'date_published': value.date_published,
                            'date_archived': value.date_archived,
                            'date_cancelled': value.date_cancelled
                        })
                    }).then(response => response.json()).then(result => result.data)
                };
                formatDateValues(profileDate, profileDateValues);
                // console.log('profileDate: ', profileDate, 'profileDateValues: ', profileDateValues);
                // console.log(profileInfo);
                if(status || role) {
                    if(typeof status !== 'undefined' && status !== profileInfo[0].status) {
                        console.log('Status:', status);
                        filterObjectStatus(statusTypeList, statusDate, status);
                        statusDate = statusDate.flatMap(e => e).flat(1);
                        console.log('statusDate: ', statusDate);
                        await patchUpdatedStatus(statusDate);
                    }
                    if(typeof role !== 'undefined') {
                        if(role !== profileInfo[0].role) {
                            console.log('Role: ', role);
                            let roleValue = [];
                            rolesList.filter(content => content.name == role).map(content => {
                                return roleValue.push({role: content.id})
                            });
                            console.log(roleValue);
                            await patchUserRole(roleValue);
                        }
                    }
                } else if(surname || pseudonyme || description) {
                    console.log('newValue: ', req.body);
                    const surnameFilter = profileInfo.filter(content => content.firstname !== surname), pseudonymeFilter = profileInfo.filter(content => content.pseudonyme !== pseudonyme), descriptionFilter = profileInfo.filter(content => content.description !== description);
                    let userNewValues = [];
                    if(description || pseudonyme || surname) {
                        if(isObjEmpty(surnameFilter) || isObjEmpty(pseudonymeFilter) || isObjEmpty(descriptionFilter)) {
                            if(firstname && surnameFilter) userNewValues.push({surname: surname}); else if(pseudonyme && pseudonymeFilter) userNewValues.push({pseudonyme: pseudonyme}); else if(description && descriptionFilter) userNewValues.push({description: description});
                            let newUserData =  await patchUserUpdateProfile(ApiUrl, req.accessToken, userNewValues, profileUserID);
                            console.log('newUserData: ', newUserData);
                        }
                    }
                } else if(image) {
                    const [file, fileExtension] = image.split(/\.(?=[^\.]+$)/), userName = userValues[0].first_name + ' ' + userValues[0].last_name;
                    let imageType;
                    imageTypeList.filter(content => content.value == fileExtension).map(content => {return imageType = content.type});
                    await deleteProfileImage(ApiUrl, req.accessToken, userValues[0].avatar)
                    const postNewImage = await postProfileImage(ApiUrl, req.accessToken, image, imageType, fileExtension, userName);
                    let imageID = []; imageID.push({image: postNewImage.id})
                    await patchUserUpdateProfile(ApiUrl, req.accessToken, imageID);
                }
            } else {
                res.redirect('/panel/admin/users-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = adminBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Mettre à jour un utilisateur';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/user-update', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, profileInfo, profileDateValues, userStatusList, rolesList, userStatusValue});
        }
        catch(error) {
            console.error('Erreur User-Update page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    userDelete: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const deleteID = req.body.deleteuserbtn;
            const {pseudonymeID} = req.params;
            let userInfo = [], oldUserInfo = [];

            const getUserValues = async() => {
                return await fetch(`${ApiUrl}/users?search=${pseudonymeID}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
            }
            let isValueExist = await getUserValues();
            
            if(typeof isValueExist !== 'undefined' && isObjEmpty(isValueExist) == false) {
                const fetchUserData = () => {
                    isValueExist.map(content => {
                        oldUserInfo.push({id: content.id, firstname: content.first_name, lastname: content.last_name, image: content.avatar, pseudonyme: content.pseudonyme, email: content.email, date_published: content.date_published, date_archived: content.date_archived, date_cancelled: content.date_cancelled, recipe_id: content.recipe_id, comment_id: content.comment_id});
                        userInfo.push({id: content.id, firstname: content.first_name, lastname: content.last_name, image: content.avatar, pseudonyme: content.pseudonyme});
                        return userInfo = userInfo.filter(value => value.firstname !== null), oldUserInfo = oldUserInfo.filter(value => value.firstname !== null)
                    });
                    // console.log('User: ', userInfo);
                    // console.log('oldUser: ', oldUserInfo);
                    return userInfo.filter( Boolean ), oldUserInfo.filter( Boolean )
                };
    
                const postOldUserData = async(value) => {
                    return await fetch(`${ApiUrl}/items/old_users/`, {
                        method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                        body: JSON.stringify({
                            'old_user_id': value.id,
                            'first_name': value.firstname,
                            'last_name': value.lastname,
                            'email': value.email,
                            'pseudonyme': value.pseudonyme,
                            'avatar': value.image,
                            'date_published': value.date_published,
                            'date_archived': value.date_archived,
                            'date_cancelled': value.date_cancelled,
                            'recipe_id': value.recipe_id,
                            'comment_id': value.comment_id,
                        })
                    }).then(response => response.json()).then(result => result.data)
                };
    
                if(deleteID) {
                    console.log('deleteID: ', deleteID);
                    let oldUser = await postOldUserData(oldUserInfo);
                    console.log('oldUser: ', oldUser);
                } else {
                    userInfo = fetchUserData();
                    console.log('Profile: ', userInfo);
                }
            } else {
                res.redirect('/panel/admin/users-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = adminBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);  
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Supprimer un utilisateur';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/user-delete', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, userInfo, userStatusValue});
        }
        catch(error) {
            console.error('Erreur User-Delete page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    roleslist: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            
            const {search, sort} = req.body;
            let rolesList = [];
            const sortingBtnList = [{title:'Icône', name:'icon', type:'button', value:'icon'},{title:'Rôle', name:'role', type:'button', value:'role'},{title:'Utilisateurs', name:'users', type:'button', value:'users'}];

            const fetchAllRoles = async() => {
                if(typeof search !== 'undefined') {
                    await(
                        await fetch(`${ApiUrl}/roles?search=${search}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                        rolesList.push({id: content.id, name: content.name, icon: content.icon, color: content.color, users: content.users.length})
                    });
                } else {
                    await(
                        await fetch(`${ApiUrl}/roles`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                        rolesList.push({id: content.id, name: content.name, icon: content.icon, color: content.color, users: content.users.length})
                    });   
                }
                return rolesList = rolesList.filter(value => value.role !== null)
            };
            await fetchAllRoles();

            // Sort By Element
            // voir controller_doc pour plus d'infos
            let sortDropdown = [], sortValues;

            if(typeof sort == 'undefined' || sort == '') {
                sortDropdown = sortDropdownList;
                console.log('SortID: Nothing to see', ' SortDropdown: ', sortDropdown);
            } else if(isObjEmpty(sort) == false) {
                const getValuesFromSortList = () => {
                    return sortList.filter(value => value.id == sort).map(content => {content.exec(Recipes); return content})
                };
                sortValues = getValuesFromSortList();
                sortValues.map(content => {sortDropdown.push({id: content.id, title: content.title})});
                console.log('Sort Dropdown: ', sortDropdown);
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = rolesBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Gestion des rôles';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/roles-list', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, rolesList, userStatusValue, sortingBtnList, sortPanelList, sortDropdown});
        }
        catch(error) {
            console.error('Erreur Roles-List page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    roleCreate: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {rolename, roleicon, rolecolor} = req.body;
            const rolesFormList = [
                {id:1, title:'Nom du rôle', subtitle:'Un joli nom de rôle', type:'text', name:'rolename'},
                {id:2, title:'Icône du rôle', subtitle:'Icônes de chez Font Awesome', type:'text', name:'roleicon'},
                {id:3, title:'Couleur du rôle', subtitle:'En hexadécimal uniquement : #FFFFFF', type:'text', name:'rolecolor'}
            ];
            const postNewRole = async() => {
                return await fetch(`${ApiUrl}/roles`, {method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                        body: JSON.stringify({
                            'name': rolename,
                            'icon': roleicon,
                            'color': rolecolor
                        })
                    }).then(response => response.json()).then(result => result.data)
            };
            if(typeof rolename !== 'undefined' && typeof roleicon !== 'undefined' && typeof rolecolor !== 'undefined') {
                let newRole = await postNewRole();
                console.log(newRole);
                res.redirect('/panel/admin/roles-list');
                return
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = rolesBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Créer un rôle';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/role-create', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, rolesFormList, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Role-Create page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    roleUpdate: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {roleID} = req.params;
            const {rolename, roleicon, rolecolor, useradded, alluserslist, searchaddeduser, searchalluser} = req.body;
            const permNamesID = Object.keys(req.body), permValuesID = Object.values(req.body);
            let roleFormValues = [], roleFormPerms = [], roleFormUsers = [], roleFormType = [], roleFormUsersList = [], 
            rolesUsers = [], roleValue = [], permKeyValues = [], roleUsersAdded = [], roleUsersList = [], roleUsersAddedRoles = [], roleUsersListRoles = [], usersListRoles, addedUsersRoles;

            const getUserRoleValues = async() => {
                return await fetch(`${ApiUrl}/roles?search=${roleID}&fields=id,name,color,icon,users`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
            }
            let isValueExist = await getUserRoleValues();

            if(typeof isValueExist !== 'undefined' && isObjEmpty(isValueExist) == false) {
                const fetchRoleValues = async() => {
                    isValueExist.map(content => {
                        return roleFormValues.push({value: content.name},{value: content.icon},{value: content.color}), rolesUsers = content.users, roleValue = content.id;
                    });
                    const getRolePerms = await (
                        await fetch(`${ApiUrl}/permissions?search=${roleValue}&fields=action,collection,fields`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                       // console.log('Perm: ', content);
                       return roleFormPerms.push({action: content.action, collection: content.collection, fields: content.fields});
                    });
                    if(isObjEmpty(getRolePerms) == true) {
                        roleFormPerms.push({action: 'read', collection: 'Recipe', fields: ['id']});
                    }
                    if(isObjEmpty(rolesUsers) == false) {
                        const getRoleUsers = await (
                            await fetch(`${ApiUrl}/users?search=${rolesUsers}&fields=id,first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                        ).map(content => {
                           return roleUsersAdded.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, image: content.avatar}), roleUsersAddedRoles.push({role: content.role});
                        });
                    } else {
                        roleUsersAdded = [], roleUsersAddedRoles = []
                    }
                    const getAllUsers = await (
                        await fetch(`${ApiUrl}/users?fields=id,first_name,last_name,pseudonyme,avatar,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                        return roleUsersList.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, image: content.avatar}), roleUsersListRoles.push({role: content.role});
                    });
                    const pushResult = () => {
                        return rolesFormList.flatMap((content,i) => 
                        roleFormType.push({id: content.id, title: content.title, subtitle: content.subtitle, type: content.type, name: content.name, value: roleFormValues[i].value}))
                    };
                    pushResult();
                }
                await fetchRoleValues();
                // console.log('roleFormType: ', roleFormType);
                addedUsersRoles = [], usersListRoles = [];
                addedUsersRoles = await getRoleValues(ApiUrl, roleUsersAddedRoles, req.accessToken);
                usersListRoles = await getRoleValues(ApiUrl, roleUsersListRoles, req.accessToken);
    
                // User -> API (Obtention des permissions à partir d'une clef)
                let roleValues = []; const addedKeysList = [{key:'102001011131436373846', addkey:'01814363839'},{key:'102001011131436373846', addkey:'1180010143637383946'},{key:'102001011131436373846', addkey:'21814'},{key:'102001011131436373846', addkey:'318'},{key:'10600010203040708091028303132333435394041', addkey:'117003947'}];
                const filterPermValues = () => {
                    // console.log('permNames + permValues: ', req.body);
                    if(isObjEmpty(permNamesID) == false) {
                        permNamesID.map((permNames,i) => {
                            rolesValueList.map(form => {form.data.map(collection => {collection.data.map(perm => {perm.data.map(input => {if(input.name == permNames && input.value == permValuesID[i]) {return roleValues.push({key: input.key})}})})})})
                        })
                    }
                };
                // ticket_messages create: 01814363839, ticket_messages read: 1180010143637383946, ticket_messages update: 21814, ticket_messages delete: 318, ticket_directus_users: 1170039 
                let actionValues = [], collectionValues = [], fieldValues = [];
                const splitFindNumber = () => {
                    let actionArray = [], collectionArray = [], fieldsArray = [];
                    roleValues.map(role => {
                        role = role.key;
                        let filterAddedKeys = addedKeysList.filter(content => content.key === role).map(content => {return content.addkey});
                        actionArray.push(role.slice(0,1)), collectionArray.push(role.slice(1,3)), fieldsArray.push(role.slice(3).match(/.{1,2}/g));
                        if(isObjEmpty(filterAddedKeys) == false) filterAddedKeys.map(key => {return actionArray.push(key.slice(0,1)), collectionArray.push(key.slice(1,3)), fieldsArray.push(key.slice(3).match(/.{1,2}/g))});
                    });
                    // console.log('actionArray: ', actionArray, ' collectionArray: ', collectionArray, ' fieldsArray: ', fieldsArray);
                    
                    const filterNumber = (arr1, arr2, arr3) => {
                        let previous;
                        if(arr2.length < 2) {
                            Object.keys(arr1).some(k => {if(k == arr2){return previous = k}});
                            return arr3.push(arr1[previous])
                        } else {
                            arr2.map(content => {
                                // console.log('content: ', content)
                                if(arr2 == fieldsArray) {
                                    if(content !== null) {
                                        let filter = content.map(number => {return arr1.filter(value => Object.keys(value) == Number(number)).map(result => {return Object.values(result).toString()}).reduce((acc, value) => acc + value);});
                                        return arr3.push(filter)
                                    } else {
                                        return arr3.push([''])
                                    }
                                } else {
                                    let filter = arr1.filter(value => Object.keys(value) == Number(content)).map(result => {return Object.values(result).toString()}).reduce((acc, value) => acc + value);
                                    return arr3.push(filter)
                                }
                            });
                        }
                    };
                    filterNumber(actionsList, actionArray, actionValues), filterNumber(collectionsList, collectionArray, collectionValues), filterNumber(fieldsList, fieldsArray, fieldValues)
                };
    
                const patchRolePerm = async(array) => {
                    return await Promise.all(array.map(content => {
                        fetch(`${ApiUrl}/permissions`, {method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                            body: JSON.stringify({
                                'action': content.action,
                                'collection': content.collection,
                                'fields': content.fields,
                            })
                        }).then(response => response.json()).then(result => result.data)
                    }))
                };
    
                // API -> User (Obtention des permissions pour les transformer en une clef)
                var permValues = [];
                if(isObjEmpty(roleFormPerms) == false) {
                    permValues = [];  
                    const filterFormPermValues = (perm, action, collection, fields) => {
                        perm.map(content => {
                            // console.log('action: ', content.action, ' collection: ', content.collection);
                            // console.log('fields: ', content.fields);
                            const actionFilter = action.filter(value => Number(content.action.indexOf(Object.values(value)[0]) !== -1)).map(content => {return Object.keys(content).toString()}); //.reduce((acc, value) => acc + value); // On compare les valeurs des deux tableaux, on récupère la clef (0,1,2) dont on ne retourne que la key (key:value) qui est mise sous forme d'une string puis on utilise reduce pour sortir la valeur de son tableau
                            // const collectionFilter = collection.filter(value => Number(content.collection.indexOf(Object.values(value)[0]) !== -1)).map(content => {return Object.keys(content).toString()}); //.reduce((acc, value) => acc + value); // On compare les valeurs des deux tableaux, on récupère la clef (0,1,2) dont on ne retourne que la key (key:value) qui est mise sous forme d'une string puis on utilise reduce pour sortir la valeur de son tableau
                            let collectionFilter, fieldsFilter, CheckDoubleZero = /^00[0-9].*$/, CheckSimpleZero = /^0[0-9].*$/;
                            if(content.fields == null) {
                                fieldsFilter = '';
                            } else if(content.fields == '*') {
                                // console.log('Etoile');
                                fieldsFilter = fields.filter(value => Number(Object.values(content.fields).indexOf(Object.values(value)[0]) !== -1)).map(content => { return Object.keys(content).toString()}).sort((a,b) => {return a - b}).reduce((acc, value) => acc + value);
                            } else {
                                fieldsFilter = fields.filter(value => Number(Object.values(content.fields).indexOf(Object.values(value)[0]) !== -1)).map(content => { return Object.keys(content).toString()}).sort((a,b) => {return a - b}).reduce((acc, value) => acc + value.padStart(2,'0')); // On compare les valeurs des deux tableaux, on récupère la clef (0,1,2) dont on ne retourne que la key (key:value) qui est mise sous forme d'une string et on tri les valeurs par ordre croissant (0 -> 45), puis on utilise reduce pour sortir les valeurs de leur tableau et padStart pour ajouter des zéros aux valeurs uniques (0 - 9), le premier zéro n'est pas pris en compte par padStart (s'il y en a un), un autre zéro sera ajouté devant par la suite
                                if(CheckDoubleZero.test(fieldsFilter) == true || CheckSimpleZero.test(fieldsFilter) == true) /* console.log('Double/Simple zero: ', fieldsFilter), */ fieldsFilter = fieldsFilter.padStart(fieldsFilter.length+1, '0');
                                else if(fieldsFilter.length % 2 == 1) /* console.log('Manque un zero', fieldsFilter), */ fieldsFilter = fieldsFilter.padStart(fieldsFilter.length+1, '0');
                                // else console.log('Pas de zero');
                            }
                            if(content.collection !== null) {
                                collectionFilter = collection.filter(value => Number(content.collection.indexOf(Object.values(value)[0]) !== -1)).map(content => {return Object.keys(content).toString().padStart(1,'0')});
                                if(isObjEmpty(collectionFilter) == false && collectionFilter[0].length % 2 == 1) {
                                    if(collectionFilter.length == 1) /* console.log('Manque un zero: ', collectionFilter),*/ collectionFilter = collectionFilter.map(value => value.padStart(value.length+1, '0'));
                                    else if(collectionFilter.length > 1) /* console.log('Trop grand: ', collectionFilter),*/ collectionFilter = collectionFilter.splice(collectionFilter.length-1,collectionFilter.length-1);
                                }
                            }
                            // console.log('actionFilter: ', actionFilter, ' collectionFilter: ', collectionFilter, ' fieldsFilter: ', fieldsFilter);
                            return permValues.push(actionFilter + collectionFilter + fieldsFilter);
                        });
                    };
                    filterFormPermValues(roleFormPerms, actionsList, collectionsList, fieldsList);
                    // console.log('permValues: ', permValues);
                }
    
                var rolesValueNewList = [] = rolesValueList;
                const comparePermKey = () => {
                    rolesValueNewList.map(form => {
                        form.data.map(collection => {
                            collection.data.map(perm => {
                                perm.data.map(input => {
                                    let filter = permValues.filter(value => input.key == value);
                                    if(input.key !== '' && isObjEmpty(filter) == false) {
                                        input.checkedValue = 'checked'
                                        // console.log('input: ', input, ' filter: ', filter)
                                    }
                                })
                            })
                        })
                    });
                }
                comparePermKey();
                
                if(permValues[0] == '199' || isValueExist[0].id == process.env.ADMIN_ROLE) {
                    rolesValueNewList = [{error: 'Rôle non éditable', color: roleFormValues[2].value, data:[{
                        content: 'Vous ne pouvez pas éditer le rôle', role: roleID, icon: roleFormValues[1].value
                    }]}];
                }
                
                if(isObjEmpty(permNamesID) == false) {
                    filterPermValues();
                    console.log('roleValues: ', roleValues);
                    if(isObjEmpty(roleValues) == false) {
                        splitFindNumber();
                        let userPermsList = [], editedPermsList = [];
                        actionValues.map((action,i) => {return userPermsList.push({action: action, collection: collectionValues[i], fields: fieldValues[i]})});
                        function compareCollection(obj) {obj.sort((a,b) => (a.collection > b.collection) ? 1 : ((b.collection > a.collection) ? -1 : 0))}
                        
                        if(isObjEmpty(userPermsList) == false) {
                            compareCollection(userPermsList), compareCollection(roleFormPerms);
                            const checkPermissions = (array,toRemove) => {
                                return array.map((content,i) => {
                                    const filterArray = toRemove.filter(value => {content.action === value.action && content.collection === value.collection && content.fields === value.fields});
                                  if(filterArray) {array.splice(i,1)}
                                });
                            };
                            checkPermissions(userPermsList,roleFormPerms);
                            editedPermsList = userPermsList
                            if(isObjEmpty(editedPermsList) == false) {
                                console.log(editedPermsList);
                                // await patchRolePerm(editedPermsList);
                            }
                        }
                    }
                }

                // console.log('User added: ', useradded, ' Users list: ', alluserslist);
                const mapUsersValues = (array1, array2, array3) => {
                    array1.map((user,i) => {return array2.push({firstname: user.firstname, lastname: user.lastname, pseudonyme: user.pseudonyme, image: `${ApiUrl}/assets/${user.image}?width=50&height=50`, role: array3[i].name, color: array3[i].color})});
                };
                /* Barres de recherche pour ajouter un utilisateur au rôle */
                if(searchaddeduser || searchalluser) {
                    console.log('searchaddeduser: ', searchaddeduser, ' searchalluser: ', searchalluser);
                    const getUserValues = async(userID) => {
                        return await(
                            await fetch(`${ApiUrl}/users?search=${userID}&fields=id,first_name,last_name,pseudonyme,role`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                        ).map(content => {
                            if(userID == searchaddeduser) {
                                roleUsersAdded = [], roleUsersAddedRoles = [];
                                return roleUsersAdded.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme}), roleUsersAddedRoles.push({id: content.role});
                            } else if(userID == searchalluser) {
                                roleUsersList = [], roleUsersListRoles = [];
                                return roleUsersList.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme}), roleUsersListRoles.push({id: content.role});
                            }
                        })
                    }
                    if(isObjEmpty(searchaddeduser) == false) {
                        await getUserValues(searchaddeduser);
                        addedUsersRoles = await getRoleValues(ApiUrl, roleUsersAddedRoles, req.accessToken);
                        console.log('Users added: ', roleUsersAdded, ' users Roles: ', addedUsersRoles);
                    } else if(isObjEmpty(searchalluser) == false) {
                        await getUserValues(searchalluser);
                        usersListRoles = await getRoleValues(ApiUrl, roleUsersListRoles, req.accessToken);
                        console.log('Users list: ', roleUsersList, ' users List Roles: ', usersListRoles);
                    }
                }

                mapUsersValues(roleUsersAdded, roleFormUsers, addedUsersRoles), mapUsersValues(roleUsersList, roleFormUsersList, usersListRoles);
                /* Ajouter un utilisateur au rôle */
                if(useradded || alluserslist) {
                    let userID;
                    const filterUserValues = (value) => {
                        return roleUsersList.filter(user => user.pseudonyme == value).map(result => {return result.id})
                    };
                    if(useradded) {
                        userID = filterUserValues(useradded);
                        if(isObjEmpty(userID) == false) {
                            const patchRemoveUserRole = async() => {
                                return await fetch(`${ApiUrl}/users/${userID}?search=${roleID}`, {method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                    body: JSON.stringify({'role': process.env.USER_ROLE})
                                }).then(response => response.json()).then(result => result.data)
                            };
                            console.log('Remove user: ', await patchRemoveUserRole());
                        }
                    } else if(alluserslist) {
                        userID = filterUserValues(alluserslist);
                        if(!userID) {
                            const patchAddUsertoRole = async() => {
                                return await fetch(`${ApiUrl}/roles/${roleID}`, {method: 'PATCH',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                    body: JSON.stringify({'user': userID})
                                }.then(response => response.json()).then(result => result.data)
                            )};
                            console.log('Add user: ', await patchAddUsertoRole());
                        }
                    }
                }
                if(rolename !== 'undefined' && rolecolor !== 'undefined' && roleicon !== 'undefined') {
                    
                }
            } else {
                res.redirect('/panel/admin/roles-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = rolesBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Mettre à jour un rôle';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/role-update', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, rolesValueNewList, roleFormType, roleFormValues, roleFormPerms, roleFormUsers, roleFormUsersList, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Role-Update page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    roleDelete: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const { deleterolebtn } = req.body;
            const {roleID} = req.params;
            let roleInfo = [], roleDeleteInfo = [];

            const getRoleInfos = async() => {
                return await(
                    await fetch(`${ApiUrl}/roles?search=${roleID}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},}).then(response => response.json()).then(result => result.data)
                ).map(content => {
                    return roleInfo.push({name: content.name, icon: content.icon, color: content.color}), roleDeleteInfo.push({id: content.id})
                })
            };
            const deleteRoleInfo = async() => {
                return await fetch(`${ApiUrl}/roles/${roleID}`, {method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},})
            };
            
            let isValueExist = await getRoleInfos();
            if(typeof isValueExist !== 'undefined' && isObjEmpty(isValueExist) == false && roleDeleteInfo[0].id !== process.env.ADMIN_ROLE) {
                if(deleterolebtn) {
                    await deleteRoleInfo();
                    console.log(roleDeleteInfo);
                    res.redirect('/panel/admin/roles-list');
                    return
                } else {
                    isValueExist;
                    // console.log('roleInfo: ', roleInfo);
                }
            } else {
                return res.redirect('/panel/admin/roles-list');
            }

            userStatusList.filter(content => content.status == req.statusID).map(content => {return userStatusValue.push({status: content.status})});
            managerBtnList = rolesBtnList; userHeaderProfile = [], userBtn = [], authorBtn = [], adminBtn = [];
            checkRoleValue(req.roleID, panelBtnList);
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Supprimer un rôle';
            console.log('THE END OF THE CALL');

            res.render('panel-admin/role-delete', {userBtn, authorBtn, adminBtn, managerBtnList, userHeaderProfile, roleInfo, userStatusValue});
        }
        catch(error) {
            console.error('Erreur Role-Delete page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    }
}

export default panelController