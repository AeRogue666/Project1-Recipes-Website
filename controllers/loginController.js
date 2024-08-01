import dotenv from 'dotenv';
dotenv.config();
import { isObjEmpty, isString, compareValues, apiErrorManager, flatErrorResult } from '../dist/controllerModule.js';
import pkg from 'jsonwebtoken';

const ApiUrl = process.env.API_URL;
const {sign, verify} = pkg;

const loginController = {
    login: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const loginID = req.body;
            const {email, pwd} = req.body; // On récupère l'ID des inputs
            let loginValue, loginUser, loginError = [], userHeaderProfile = [];

            // console.log('LoginID: ', loginID);

            const postLoginUser = async() => {
                return await ( // {data: {access_token}}
                    await fetch(`${ApiUrl}/auth/login`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            password: pwd
                        })
                    }).then(response => response.json())
                )
            };

            if(isObjEmpty(loginID) == false) {
                loginUser = await postLoginUser();
                loginError = loginUser.errors, loginValue = loginUser.data;
                if(loginError) {
                    loginError = await flatErrorResult(ApiUrl, loginError);
                    console.log('API Error Reason: ', loginError);
                    loginUser = ''
                } else if (loginValue) {
                    loginError = [];
                    const token = sign(loginValue, process.env.SESSION_SECRET);
                    let tokenLifeTime = loginValue.expires;
                    console.log(tokenLifeTime);
                    return res.cookie("project1_cookie", token, {
                        maxAge: tokenLifeTime,
                        httpOnly: true,
                        secure: false,
                        domain: 'localhost',
                        sameSite: 'strict'
                    }).status(200).redirect('/'); //.json({ message: "Logged in successfully 😊 👌" })
                }
            }

            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar: req.userHeaderAvatar})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);
            res.locals.title = 'Se connecter'
            console.log('THE END OF THE CALL');

            res.render('login', {loginValue, loginError, userHeaderProfile});
        }
        catch(error) {
            console.error('Erreur Login page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    register: async(req, res) => {
        try {
            if (req.url === '/favicon.ico') {
                res.end();
                console.log('Favicon');
                return;
            }
            const registerID = req.body;
            const {pseudo, email, pwd} = req.body; // On récupère l'ID des inputs
            let pwdconfirm = req.body.pwdrepeat, registerValue, registerError = [], register, userHeaderProfile = [];
            const getRegisteredUser = async() => {
                return await fetch(`${ApiUrl}/users?search=${email}&fields=id`).then(response => response.json()).then(content => {if(content.data) {return content.data} else {return content.errors}})
            };
            const getRegisteredOldUser = async() => {
                return await fetch(`${ApiUrl}/items/old_user?search=${email}&fields=old_user_id`).then(response => response.json()).then(content => {if(content.data) {return content.data} else {return content.errors}})
            };
            const getUserPseudonyme = async() => {
                return await fetch(`${ApiUrl}/users?search=${pseudo}&fields=id`).then(response => response.json()).then(content => {if(content.data) {return content.data} else {return content.errors}})
            };
            const postRegisterNewUser = async() => {
                return await fetch(`${ApiUrl}/users`, {method: 'POST',headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pseudonyme: pseudo,email: email,password: pwd})}).then(response => response.json())
            };
            console.log(pseudo, email, pwd, pwdconfirm);
            if(pseudo && email && pwd && pwdconfirm) {
                let comparePwd = compareValues(pwd, pwdconfirm);
                const registeredUser = await getRegisteredUser(), registeredOldUser = await getRegisteredOldUser(), registeredPseudonyme = await getUserPseudonyme();
                console.log(registeredOldUser);
                if(isObjEmpty(registeredUser) == true && isObjEmpty(registeredOldUser) == true && comparePwd == true && isObjEmpty(registeredPseudonyme) == true) {
                    register = await postRegisterNewUser();
                    registerError = register.errors, registerValue = register.data;
                    console.log('Same value');
                    if(registerError) {
                        registerError = await flatErrorResult(ApiUrl, registerError);
                        console.log('Error: ', registerError);
                    } else if(registerValue) {
                        // console.log('Register: ', register);
                        registerError = [];
                        return res.redirect('/login');
                    }
                } else if(comparePwd !== true || isObjEmpty(pwd) == true || isObjEmpty(email) == true || isObjEmpty(pseudo) == true) {
                    console.log('Not the same value'); 
                    registerError.push({code:'INVALID_DATA'});
                    return registerError = await apiErrorManager(ApiUrl, registerError);
                } else {
                    console.log('Already registered');
                    registerError.push({code: 'RECORD_NOT_UNIQUE'});
                    registerError = await apiErrorManager(ApiUrl, registerError);
                    console.log(registerError);
                }
            }

            const userHeaderData = async(array) => {return array.push({id: req.userID, firstname: req.userHeaderFirstname, lastname: req.userHeaderLastname, pseudonyme: req.userHeaderPseudonyme, avatar: req.userHeaderAvatar})};
            if(typeof req.userID !== 'undefined')  userHeaderData(userHeaderProfile);
            res.locals.title = 'Créer un compte'
            console.log('THE END OF THE CALL');
    
            res.render('register', {registerValue, registerError, userHeaderProfile});
        } catch(error) {
            console.error('Erreur Register page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    },
    logout: async(req, res) => {
        try {
            const postRefreshTokenDeleting = async() => {
                return await fetch(`${ApiUrl}/auth/logout`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Authorization': 'Bearer ' + req.accessToken,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        'refresh_token': req.refreshToken,
                        'mode': 'json'
                    })
                }).then(response => console.log(JSON.stringify(response)))
            };
            await postRefreshTokenDeleting();
            return res.clearCookie("project1_cookie").status(200).redirect('/'); //.json({ message: "Successfully logged out 😏 🍀" });

        } catch(error) {
            console.error('Erreur Logout page: ', error);
            res.status(500).send(`An error occured with the database: ${error.message}`);
        }
    }
}

export default loginController;