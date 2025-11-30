/* import dotenv from "dotenv";
dotenv.config(); // Not needed anymore (from Node.JS 20+) */
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import store from 'store2';
import { aboutme, aboutjob, aboutskills, sortList, sortDropdownList } from '../dist/controllerArrayList.js';
import { isObjEmpty, isString, filterCategories, noAlphaNum, hasNumber, replaceNumber, getMessageAuthorValues } from '../dist/controllerModule.js';

const ApiUrl = process.env.API_URL;
let Recipes = [], userHeaderProfile = [];
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

const controller = {
    home: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const fetchLatestRecipes = async() => {return await fetch(`${ApiUrl}/items/Recipe?limit=3&fields=id,title,description,image,imageDescription,labelDescription,labelURL,user_id,date_published,favorites_recipes_users&filter[year(date_published)][_eq]=2024&filter=[status][_eq]=published`).then(response => response.json()).then(result => result.data)}, 
            fetchFavoritesRecipes = async() => {return await fetch(`${ApiUrl}/items/Recipe?fields=id,title,description,image,imageDescription,labelDescription,labelURL,user_id,date_published,favorites_recipes_users&filter=[status][_eq]=published&sort=date_published`).then(response => response.json()).then(result => result.data)},
            getRecipesAuthorValues = async(array) => {return await Promise.all(array.map(user => fetch(`${ApiUrl}/users/${user.user_id}?fields=first_name,last_name,pseudonyme,avatar`).then(response => response.json()).then(result => result.data)))};
            const LatestRecipes = await fetchLatestRecipes(), favoritesRecipes = await fetchFavoritesRecipes();
            let authorLatestRecipes, authorFavoritesRecipes, favoritesFilteredRecipes = [], favoritesRecipesList = [], latestRecipesList = [], latestRecipesDate = [], favoritesRecipesDate = [];
            authorLatestRecipes = await getRecipesAuthorValues(LatestRecipes), authorFavoritesRecipes = await getRecipesAuthorValues(favoritesRecipes);
            dateConverter(LatestRecipes, latestRecipesDate), dateConverter(favoritesRecipes, favoritesRecipesDate);
            const pushRecipes = (array, final, date, author) => {array.map((recipe,i) => {return final.push({id: recipe.id, title: recipe.title, description: recipe.description, image: recipe.image, imageDescription: recipe.imageDescription, labelDescription: recipe.labelDescription, labelURL: recipe.labelURL, date_published: date[i].datePublished, favorites: recipe.favorites_recipes_users.length, name: author[i].first_name + '' + author[i].last_name})})};
            favoritesRecipes.map(recipe => {return favoritesFilteredRecipes.push(recipe)}); favoritesFilteredRecipes = favoritesFilteredRecipes.filter(recipe => recipe.favorites_recipes_users.length >= 1).sort((a,b) => a.favorites_recipes_users.length - b.favorites_recipes_users.length);
            pushRecipes(favoritesFilteredRecipes, favoritesRecipesList, favoritesRecipesDate, authorFavoritesRecipes), pushRecipes(LatestRecipes, latestRecipesList, latestRecipesDate, authorLatestRecipes);

            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Accueil'
            console.log('THE END OF THE CALL');

            res.render('index', {latestRecipesList, favoritesRecipesList, userHeaderProfile});
        }
        catch(error) {
            console.error('Erreur HomePage: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    recipes: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const inputID = req.body; // On récupère l'ID des inputs
            const queryID = req.query.search; // On récupère l'ID de la recherche
            const {input, tag} = req.body, sort = req.body.sort;
            let AllCategories = [], categoryList = [], AllCategoriesList = [], inputList = [], recipesList = [], authorList = [], recipesDateList = []; Recipes = [];
            if (input > 32 || input <= 0) { // !parseInt(input) || isNaN(input)
                res.redirect('..');
            }
            const fetchAllRecipes = async() => {
                return await fetch(`${ApiUrl}/items/Recipe?fields=id,sort,title,description,image,imageDescription,labelDescription,labelURL,date_published,user_id,category_id,favorites_recipes_users&filter=[status][_eq]=published&sort=date_published`).then(response => response.json()).then(result => result.data);
            }, getRecipesAuthorValues = async(array) => {return await Promise.all(array.map(user => fetch(`${ApiUrl}/users/${user.user_id}?fields=first_name,last_name,pseudonyme,avatar`).then(response => response.json()).then(result => result.data)))};
            recipesList = await fetchAllRecipes(); authorList = await getRecipesAuthorValues(recipesList);
            const pushRecipes = (array, final, date, author) => {array.map((recipe,i) => {return final.push({id: recipe.id, title: recipe.title, description: recipe.description, image: recipe.image, imageDescription: recipe.imageDescription, labelDescription: recipe.labelDescription, labelURL: recipe.labelURL, date_published: date[i].datePublished, favorites: recipe.favorites_recipes_users.length, name: author[i].first_name + '' + author[i].last_name})})};
            dateConverter(recipesList, recipesDateList); pushRecipes(recipesList, Recipes, recipesDateList, authorList);
            // console.log('recipes: ', Recipes);
            
            const fetchAllCategories = async() => {
                return await fetch(`${ApiUrl}/items/Category?fields=id,title,recipe_id&filter=[status][_eq]=published&sort=id`).then(response => response.json()).then(result => result.data);
            };
            AllCategoriesList = await fetchAllCategories();
            // console.log('categories: ', AllCategoriesList);
            
            console.log('inputID: ', inputID);
            console.log('queryID: ', queryID);
            console.log('sortID: ', sort);
            
            if(isObjEmpty(inputID) == false) {
                let recipesID = [], data = [], dataValue = [], TempInput, getTempInput;
                // console.log('Input value: ', input);

                if(input || tag) {
                    if(input) {
                        if(input.length <= 2) data.push(input.toString()), data = data.reduce((acc,value) => acc + value);
                        else input.map(content => {return data.push(content.toString())});
                        if(isObjEmpty(data) == false) {
                            TempInput = store.set('TempInput', data); // On stocke les ids dans localStorage
                            if(data.length >= 3) data.map(input => {inputList.push(Number(input))})
                            else inputList.push(Number(data));
                        } else {
                            console.log('TempInput is null');
                            inputList = [];
                        }
                        console.log('Session Input: ', store.get('TempInput'));
                    } 
                    else if(tag) {
                        getTempInput = store.get('TempInput'); // On appelle les ids contenus dans localStorage
                        // console.log('Is this a string? ', isString(getTempInput), ' if not, what is it? ', toString.call(getTempInput))

                        if(getTempInput === null || getTempInput === undefined) {
                            console.log('Filter error redirect');
                            res.redirect('.');
                        } else {
                            if (isString(getTempInput) == false) {
                                let filterData = getTempInput.filter((ids) => ids !== tag); // On filtre les ids en fonction de l'id contenu dans tag
                                data = Array.from(filterData); // On transforme le résultat en un array
                                console.log('Input: ', inputID, ' data: ', data);
                                store.remove('TempInput'), store.set('TempInput', data);
                                getTempInput = store.get('TempInput');
                                if(data.length >= 2) data.map(tag => {inputList.push(Number(tag))})
                                else inputList.push(Number(data))
                            } else if (isString(getTempInput) == true) {
                                console.log('Je suis un string pas un array')
                                console.log('TempInput: ', TempInput, ' GetTempInput: ', store.get('TempInput'));
                                console.log('Input: ', inputID, ' data: ', data);
                            }
                        }
                    }

                    if (typeof data == 'undefined' || data == '') {
                        console.log('Je suis Undefined');
                        res.redirect('recipes'); // Data n'étant pas défini, on retourne l'utilisateur vers la page des recettes et on termine
                        return;
                    } else {
                        if (isString(data) == false) {
                            data.forEach(element => {return dataValue.push({id: element})});
                            // console.log('Split: ', dataValue);
                        }
                        else {
                            dataValue.push({id: data});
                            // console.log('No split: ', dataValue);
                        }                    
                        const getFilteredCategoriesByInput = async() => {
                            return await Promise.all(dataValue.map(value =>{return fetch(`${ApiUrl}/items/Category/${value.id}?fields=id,title&filter=[status][_eq]=published`).then(response => response.json()).then(result => result.data)}));
                        };
                        categoryList = await getFilteredCategoriesByInput();
                        console.log('Category value: ', categoryList);
                        if(typeof(input) !== 'undefined') {
                            const getFilteredCategories = async() => {
                                recipesID = dataValue.map(value => {return AllCategoriesList.filter(content => content.id == Number(value.id)).map(content => {return content}).reduce((acc,value) => acc + value)});
                                if(isObjEmpty(recipesID) == false) {
                                    return Recipes = await Promise.all(recipesID.map(recipe => {return fetch(`${ApiUrl}/items/Recipe/${recipe.recipe_id}?fields=id,title,description,image,imageDescription,labelDescription,labelURL,date_published&filter=[status][_eq]=published`).then(response => response.json()).then(result => result.data)}));
                                }
                            }
                            Recipes = await getFilteredCategories() && Recipes.filter( Boolean );
                        }
                    }
                } 
                if (inputID.resetbtn) {
                    store.remove('TempInput'), inputList = [], categoryList = [];
                }
            } else if (isObjEmpty(inputID) == true) {
                console.log('InputID NaN: ', isObjEmpty(inputID))
            } 

            AllCategoriesList.map(input => {
                let filter = inputList.filter(value => input.id == value);
                if(input.id !== '' && isObjEmpty(filter) == false) {
                    AllCategories.push({id: input.id, title: input.title, recipe_id: input.recipe_id, checked:'yes'})
                } else {
                    AllCategories.push(input)
                }
            });
            // console.log('AllCategories: ', AllCategories);
            
            // Filtrage des catégories pour la liste des recettes
            const MenuType = filterCategories(AllCategories,0,6), OtherType = filterCategories(AllCategories,5,10), BakeryType = filterCategories(AllCategories,9,14), PastryType = filterCategories(AllCategories,13,27), DoughType = filterCategories(AllCategories,26,33);

            let queryResult;
            if(queryID !== undefined) {
                console.log(queryID.length);
                const getARecipeByQuery = async() => {
                    return await(await fetch(`${ApiUrl}/items/Recipe?search=${queryID}`).then(response => response.json()).then(result => result.data))
                };
                queryResult = await getARecipeByQuery();
                console.log('Query result: ', queryResult);
                Recipes = queryResult;
            } else if(queryID == undefined) {
                console.log('QueryID: Nothing to see');
                queryResult = ''
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

            userHeaderProfile = [];
            const userHeaderData = (array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Liste des recettes'
            console.log('THE END OF THE CALL');

            res.render('recipes', {Recipes, userHeaderProfile, MenuType, OtherType, PastryType, BakeryType, DoughType, categoryList, sortList, sortDropdown});
        }
        catch(error) {
            console.error('Erreur Recipes page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    recipe: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const {favorite, like, dislike, people} = req.body;
            const {RecipeID} = req.params; // RecipeID = Number(req.params.RecipeID); // On call l'ID de la recette afin de récupérer la recette dans l'API
            let userID, roleID, categoryID, oldUserID, authorValues = [], 
            recipe = [], ingredient = [], tool = [], preparation = [], 
            nonFormatDate, categoryList = [], authorData, categoryIDList = [], favorisList = [], likeList = [], dislikeList = [], peopleNumber;
            /*let commentID, commentUserID, commentsList, commentUserList, recipeComments;*/
            console.log('recipeID: ', RecipeID, noAlphaNum(RecipeID))

            if(noAlphaNum(RecipeID) == true) {
                // On récupère la recette réclamée par l'utilisateur
                const fetchRecipe = async() => {
                    return await fetch(`${ApiUrl}/items/Recipe/${RecipeID}`).then(response => response.json()).then(result => result.data)
                };
                recipe.push(await fetchRecipe());
                // console.log('Recipe: ', recipe);
                if(typeof recipe !== 'undefined') {
                    // On split les ingrédients, le matériel et la recette pour éviter les pavés illisibles
                    recipe.map(recipe => {
                        ingredient = recipe.cookingIngredient.split('\n'), tool = recipe.cookingTool.split('\n'), preparation = recipe.cookingRecipe.split('\n');
                        nonFormatDate = recipe.date_published, userID = recipe.user_id, oldUserID = recipe.old_user_id, categoryID = recipe.category_id, peopleNumber = recipe.peopleNumber;
                        // commentID = recipe.comment_id;
                    });

                    let ingredientList = [];
                    if(hasNumber(ingredient) === true && !people) {
                        // console.log('ingredient: ', ingredient);
                        replaceNumber(ingredient, ingredientList, peopleNumber);
                        ingredient = [], ingredientList.map(content => {ingredient.push(content + '\n')});
                        // console.log('Sortie: ', ingredient);
                    } else if(hasNumber(ingredient) === true && isString(people)) {
                        replaceNumber(ingredient, ingredientList, people);
                        ingredient = [], ingredientList.map(content => {ingredient.push(content + '\n')}), peopleNumber = people;
                    }
                    const fetchAuthorValues = async() => {
                        const getUserName = await fetch(`${ApiUrl}/users/${userID}?fields=id,first_name,last_name,pseudonyme,avatar,role`).then(response => response.json()).then(result => result.data);
                        const getOldUserName = await fetch(`${ApiUrl}/items/old_user/${oldUserID}?fields=id,first_name,last_name,pseudonyme,avatar,role`).then(response => response.json()).then(result => result.data);
                        if(!getUserName) {
                            authorData = getOldUserName; roleID = getOldUserName.role;
                        } else {
                            authorData = getUserName; roleID = getUserName.role;
                        }
                        const getUserRole = await fetch(`${ApiUrl}/roles/${roleID}`).then(response => response.json()).then(result => result.data);
                        return authorValues.push({id: userID, firstname: authorData.first_name, lastname: authorData.last_name, pseudonyme: authorData.pseudonyme, image: `${ApiUrl}/assets/${authorData.avatar}?width=50&height=50`, role: getUserRole.name, roleicon: getUserRole.icon, rolecolor: getUserRole.color});
                    };
                    await fetchAuthorValues();
                    if(req.userID && req.accessToken && req.statusID === 'active') {
                        const fetchFavAndLikeValues = async() => {
                            const getFavValues = await fetch(`${ApiUrl}/users/${req.userID}?fields=id,favorites_recipes`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data);
                            let favorites = [];
                            favorites.push(getFavValues);
                            const filterValues = (array, final, value) => {
                                if(array === favorites) {
                                    array.map(content => {return content.favorites_recipes.filter(v => v == value).map(fav => {return final.push({id: fav, selected:'yes'})})})
                                }
                            };
                            filterValues(favorites, favorisList, RecipeID);
                        };
                        await fetchFavAndLikeValues();
                        console.log('favorisList: ', favorisList, ' likeList: ', likeList, ' dislikeList: ', dislikeList);
                        if(favorite && req.statusID === 'active') {
                            console.log('favoris: ', favorite);
                            const favFilter = favorisList.filter(content => content.user == req.userID);
                            console.log('favFilter: ', favFilter);
                            if(isObjEmpty(favFilter) == false) {
                                const deleteRemoveRecipeFromFavorites = async() => {
                                    return await Promise.all(favFilter.map(content => fetch(`${ApiUrl}/items/Recipe_directus_users/${content.id}`, {method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'}}))).then(response => response.json())
                                };
                                let removedFavorite = await deleteRemoveRecipeFromFavorites();
                                console.log('removedFavorite: ', removedFavorite);
                            } else {
                                const postAddRecipeToFavorites = async() => {
                                    await fetch(`${ApiUrl}/items/Recipe_directus_users`, {
                                        method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                        body: JSON.stringify({
                                            recipe_id: RecipeID,
                                            directus_users: req.userID,
                                        })
                                    }).then(response => response.json()).then(result => result.data)
                                };
                                let addedFavorite = await postAddRecipeToFavorites();
                                console.log('addedFavorite: ', addedFavorite);
                            }
                        }
                        if(like && req.statusID === 'active' || dislike && req.statusID === 'active') {
                            console.log('like: ', like, ' dislike: ', dislike);
                            const likeFilter = likeList.filter(content => content.user == req.userID), dislikeFilter = dislikeList.filter(content => content.user == req.userID);
                            const postRecipeLike = async() => {
                                await fetch(`${ApiUrl}/items/like_recipe`, {
                                    method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                    body: JSON.stringify({recipe_id: RecipeID, directus_users: req.userID})
                                }).then(response => response.json()).then(result => result.data)
                            };
                            const postRecipeDislike = async() => {
                                await fetch(`${ApiUrl}/items/dislike_recipe`, {
                                    method: 'POST',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                    body: JSON.stringify({recipe_id: RecipeID, directus_users: req.userID})
                                }).then(response => response.json()).then(result => result.data)
                            };
                            const deleteRecipeLike = async() => {
                                await fetch(`${ApiUrl}/items/like_recipe/${RecipeID}`, {
                                    method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                }).then(response => response.json()).then(result => result.data)
                            };
                            const deleteRecipeDislike = async() => {
                                await fetch(`${ApiUrl}/items/dislike_recipe/${RecipeID}`, {
                                    method: 'DELETE',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-type': 'application/json','Accept': 'application/json'},
                                }).then(response => response.json()).then(result => result.data)
                            };
                            if(like) {
                                if(dislikeFilter) await deleteRecipeDislike();
                                likeFilter ? await deleteRecipeLike() : await postRecipeLike();
                            } else if(dislike) {
                                if(likeFilter) await deleteRecipeLike();
                                dislikeFilter ? await deleteRecipeDislike() : await postRecipeDislike();
                            }
                        }
                    }
                    
                    console.log('Is this a string? ', isString(categoryID), ' if not, what is it? ', toString.call(categoryID));
                    isObjEmpty(categoryID) == false && isString(categoryID) == false ? categoryID.map(element => { categoryIDList.push({id: element}) }) : categoryIDList.push({id: categoryID});
                    categoryID = categoryIDList;

                    const getCategoryTitle = async() => {
                        return await Promise.all(categoryID.map(value => {return fetch(`${ApiUrl}/items/Category/${value.id}`).then(response => response.json()).then(result => result.data)}))
                    };
                    // On clear le tableau avant d'y ajouter les résultats du call API sinon cela s'empile
                    categoryList = [];
                    categoryList = await getCategoryTitle();
                    console.log('Category list: ', categoryList)
                    /* const getRecipeComments = async() => {
                        const RecipeComments = await (await fetch(`${ApiUrl}/items/Comment?fields=id,title,content,user_id,recipe_id,date_published&filter=[id][_eq]=${commentID}&sort=date_published`)).json();
                        commentsList = RecipeComments.data;
                        return commentsList
                    };
                    commentsList = await getRecipeComments();
                    console.log('Comments List: ', commentsList);
                    commentUserID =  commentsList[0].user_id;
                    console.log('UserID: ', commentUserID);

                    const getRecipeUserInfo = async() => {
                        const RecipeUserInfo = await (await fetch(`${ApiUrl}/users/${commentUserID}?fields=id,first_name,last_name,role`)).json();
                        commentUserList = RecipeUserInfo.data;
                        return commentUserList;
                    }
                    commentUserList = await getRecipeUserInfo();
                    console.log('Comments User List: ', commentUserList);*/
                    
                    // On convertit la date de publication : YYYY-MM-DD -> DD/MM/YYYY
                    dayjs.extend(updateLocale) // On convertit les noms des mois de l'anglais au français
                    dayjs.updateLocale('en', {
                    months: [
                        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
                        "Août", "Septembre", "Octobre", "Novembre", "Decembre"
                    ]});
                    var date_published = dayjs(nonFormatDate, 'M/D/Y').format('DD MMMM YYYY (DD/MM/YYYY)');
                } else {
                    res.redirect('/recipes');
                    return
                }
            } else {
                res.redirect('/recipes');
                return
            }

            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = recipe.map(content => {return 'Recette de ' + content.title})
            console.log('THE END OF THE CALL');

            res.render('recipe', {recipe, userHeaderProfile, ingredient, tool, preparation, date_published, authorValues, categoryList, favorisList, likeList, dislikeList, peopleNumber});
        }
        catch(error) {
            console.error('Erreur Recipe page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    legalMentions: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            let legalMentionsContent = [];

            const getLegalMentionsContent = async() => {
                let MentionID = [];
                var MentionContent = [], Mentionlist = [];
                const getMentionsID = await fetch(`${ApiUrl}/items/legalmention?fields=id&filter=[status][_eq]=published`).then(response => response.json()).then(result => result.data);
                MentionID = getMentionsID;
                console.log('Call des mentions légales / MentionID: ', MentionID);

                const getMentionsContent = async() => {
                    const getContent = await Promise.all(
                        MentionID.map(value =>
                            fetch(`${ApiUrl}/items/legalmention/${value.id}?fields=id,title,content,date_published`).then(response => response.json()).then(result => result.data)
                          )).then(data => {
                            // console.log('Element content: ', data)
                            data.map(element => {
                                MentionContent = element.content.split('\\n');
                                Mentionlist.push({id: element.id, title: element.title, content: MentionContent, date_published: element.date_published})
                            })
                            return Mentionlist
                          });
                    // console.log('Get Content: ', getContent);
                    return getContent
                };
                return MentionContent = await getMentionsContent();
            }

            legalMentionsContent = await getLegalMentionsContent();
            
            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Mentions légales'
            console.log('THE END OF THE CALL');

            res.render('legalmentions', {legalMentionsContent, userHeaderProfile});
        }
        catch(error) {
            console.error('Erreur LegalMentions page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    contact: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const contactList = [{id:1, title:'Page de contact'}];
            
            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Contact'
            console.log('THE END OF THE CALL');

            res.render('contact', {contactList, userHeaderProfile});
        }
        catch(error) {
            console.error('Erreur Contact page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    cgu: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            let cguList, cguContentList = [], cguContent;
            console.log('Call des CGU');

            const getCguContent = async() => {
                cguContentList = [];
                const getCguValues = await fetch(`${ApiUrl}/items/cgu?fields=id,title,content,date_published,date_updated&filter=[status][_eq]=published`).then(response => response.json()).then(result => result.data);
                cguList = getCguValues;

                return await Promise.all(
                    cguList.map(element => {
                        cguContent = element.content.split('\n');
                        cguContentList.push({id: element.id, title: element.title, content: cguContent});
                        return cguContentList
                    })
                )
            };
            await getCguContent();
            // console.log('Content: ', cguContentList);

            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Conditions Générales d\'Utilisation'
            console.log('THE END OF THE CALL');
            
            res.render('cgu', {cguContentList, userHeaderProfile});
        }
        catch(error) {
            console.error('Erreur CGU page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    cookies: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            let cookiesContentList = [], cookiesList, cookiesContent;

            const getCookieContent = async() => {
                cookiesContentList = [];
                const getCookiesValues = await fetch(`${ApiUrl}/items/cookies?fields=id,title,content,date_published,date_updated&filter=[status][_eq]=published`).then(response => response.json()).then(result => result.data);
                cookiesList = getCookiesValues;
                return await Promise.all(
                    cookiesList.map(element => {
                        cookiesContent = element.content.split('\n');
                        return cookiesContentList.push({id: element.id, title: element.title, content: cookiesContent});
                    })
                )
            };
            await getCookieContent();

            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Cookies'
            console.log('THE END OF THE CALL');

            res.render('cookies', {cookiesContentList, userHeaderProfile});
        }
        catch(error) {
            console.error('Erreur Cookies page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    aboutus: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'About me'
            console.log('THE END OF THE CALL');

            res.render('about-us', {aboutme, aboutjob, aboutskills, userHeaderProfile});
        } catch(error) {
            console.error('Erreur About-Us page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    publicProfile: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const pseudonymeID = Object.values(req.params);
            console.log('Pseudonyme: ', pseudonymeID);
            let recipeID = [], publicProfile = [], user = [];

            const fetchUserData = async() => {
                Recipes = [];
                const getSearchedUser = await(
                    await fetch(`${ApiUrl}/users?search=${pseudonymeID}`).then(response => response.json()).then(result => result.data)
                ).map(content => {
                    if(content.length == 0) {return 0} 
                    else {
                        user.push({id: content.id, firstname: content.first_name, lastname: content.last_name, pseudonyme: content.pseudonyme, description: content.description, imageProfile: content.avatar, imageDescription:'Image de profil', role: content.role})
                        recipeID.push(content.recipe_id);
                        return user = user.filter(value => value.firstname !== null && value.role !== null), recipeID = recipeID.flatMap(e => e).flat(1)
                    }
                });
                if(isObjEmpty(getSearchedUser.length == 0 || getSearchedUser) == true) {
                    const getSearchedOldUser = await(
                        await fetch(`${ApiUrl}/items/old_users?search=${pseudonymeID}`).then(response => response.json()).then(result => result.data)
                    ).map(content => {
                        if(content.length == 0) {
                            res.redirect('/*');
                            return
                        } else {
                            user.push({id: content.id, firstname: content.first_name, lastname: content.last_name, description: content.description, pseudonyme: content.pseudonyme, imageProfile: content.avatar, imageDescription:'Image de profil', role: content.role})
                            recipeID.push(content.recipe_id);
                            return user = user.filter(value => value.firstname !== null && value.role !== null), recipeID = recipeID.flatMap(e => e).flat(1)
                        }
                    });
                    res.redirect('/*');
                    return
                }
                
                const getUserRole = await Promise.all(
                    user.map(content => {
                        return fetch(`${ApiUrl}/roles/${content.role}?fields=name,icon,color`).then(response => response.json()).then(result => result.data)
                    })
                );
                const getUserRecipes = await Promise.all(
                    recipeID.map(value => {
                        return fetch(`${ApiUrl}/items/Recipe/${value}?fields=id,title,description,image,imageDescription,labelDescription,labelURL`).then(response => response.json()).then(result => result.data)
                    })
                );
                Recipes = getUserRecipes;

                const pushResult = (user, role, profile) => {
                    return user.flatMap((content,i) => profile.push({id: content.id, firstname: content.firstname, lastname: content.lastname, pseudonyme: content.pseudonyme, description: content.description, imageProfile: `${ApiUrl}/assets/${content.imageProfile}?width=250&height=250`, imageDescription: content.imageDescription, role: role[i].name, roleicon: role[i].icon, rolecolor: role[i].color}))
                };
                pushResult(user, getUserRole, publicProfile);
                return publicProfile.filter( Boolean )
            };
            publicProfile = await fetchUserData();
            //console.log('Profile: ', publicProfile);
            //console.log('Recipes: ', Recipes);

            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Profil public'
            console.log('THE END OF THE CALL');

            res.render('public-profile', {publicProfile, Recipes, userHeaderProfile});
        } catch(error) {
            console.error('Erreur Public-Profile page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    notfound: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }

            const fetchLatestRecipes = async() => {
                // On retourne le tableau "data" contenu dans recipes
                return await fetch(`${ApiUrl}/items/Recipe?limit=3&fields=id,title,description,image,imageDescription,labelDescription,labelURL,date_published,user_id&filter=[status][_eq]=published&sort=date_published`).then(response => response.json()).then(result => result.data)
            };
            let LatestRecipes = await fetchLatestRecipes();

            userHeaderProfile = [];
            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar : `${ApiUrl}/assets/${req.userHeaderAvatar}?width=50&height=50`})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);

            res.locals.title = 'Page non trouvée'
            console.log('THE END OF THE CALL');

            res.render('not-found', {LatestRecipes, userHeaderProfile});

        } catch(error) {
            console.error('Erreur Not-found page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    }
}

export default controller;