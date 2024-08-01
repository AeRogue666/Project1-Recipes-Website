import dotenv from 'dotenv';
import express from 'express';
import router from './routeur.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import pkg from 'jsonwebtoken';
import { isObjEmpty } from './dist/controllerModule.js';
import { permsValuesList } from './dist/controllerArrayList.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
const ApiUrl = process.env.API_URL;
const app = express();
const {verify} = pkg;

app.set('view engine', 'ejs');
app.set('views', './views'); // On déclare qu'ejs doit utiliser les views
app.use(express.static('public')); // On passe le dossier public (css, img, js) en statique afin de le rendre visible par l'utilisateur

app.use(express.json()); // Pour parse application/json
app.use(express.urlencoded({extended: true})); // Pour parser application/x-www-form-urlencoded
const scriptSrcUrls = ["https://cdnjs.cloudflare.com","https://upload.wikimedia.org"], imageSrcUrls = ["http://0.0.0.0:8055","https://upload.wikimedia.org","https://assets.afcdn.com","https://images.pexels.com/"];
/* app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            'script-src': ["'self'", ...scriptSrcUrls],
            'img-src': ["'self'", "http:", ...imageSrcUrls],
        }},
        reportOnly:true
    })
); */
app.use(hpp()); // Pour prévenir les pollutions des requêtes HTTP (Exemple: localhost:5500/page?firstname=MonNom&firstname=MonNom)
app.disable('x-powered-by'); // Désactive le X-Powered-By Header qui permet de connaître les technologies utilisées pour encoder l'application web renvoyée à l'API, notamment les scripts.

// Limite le nombre de requêtes à 100 toutes les 10 minutes par route, par IP
const limiter = rateLimit({
    validate: {
        xForwardedForHeader: false,
        default: true,
        positiveHits: true,
        ip: true
    },
    windowMs: 10 * 60 * 1000,    // 10 minutes
    max: 100,                    // 100 requêtes par IP
    standardHeaders: true,
    legacyHeaders: false,
    requestWasSuccessful: async(res) => res.statusCode < 400,
});
app.use(limiter);
app.use(cookieParser());
// middleware to test if authenticated
const authorization = async(req, res, next) => {
    const token = req.cookies.project1_cookie;
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (!token) {
        console.log('Erreur 403 - Cookie expiré');
        return res.redirect('/');
    }
    try {
        const data = verify(token, process.env.SESSION_SECRET);
        // console.log(data);
        req.accessToken = data.access_token, req.refreshToken = data.refresh_token;
        const getUserData = async() => {return await fetch(`${ApiUrl}/users/me?fields=id,role,status`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-Type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)};
        const postRefreshToken = async() => {return await fetch(`${ApiUrl}/auth/refresh`, {method: 'POST',headers: {'Authorization': 'Bearer ' + req.accessToken}, body: JSON.stringify({refresh_token: req.refreshToken,mode: 'json'})}).then(response => response.json()).then(result => result.data)};
        let userValues = await getUserData(), refreshValues = await postRefreshToken();
        if(!userValues) {
            console.log('Erreur 403 - Token invalide');
            console.log('refreshValues: ', refreshValues);
            if(!refreshValues) {
                return res.redirect('/');
            }
            else {
                const signRefreshToken = sign(refreshValues, process.env.SESSION_SECRET);
                let tokenLifeTime = refreshValues.expires;
                console.log('INFO: Token refresh');
                return res.clearCookie("project1_cookie").status(200),
                res.cookie("project1_cookie", signRefreshToken, {
                    maxAge: tokenLifeTime,
                    httpOnly: true,
                    secure: false,
                    domain: 'localhost',
                    sameSite: 'strict'
                }).status(200); //.redirect('/');
            }
        } else {
            console.log('INFO: Token valide');
            req.roleID = userValues.role; req.userID = userValues.id, req.statusID = userValues.status;
            const notAnUrl = URL.canParse(fullUrl) && new URL(fullUrl);
            let crudCheck = [{value: 'update'},{value:'delete'},{value:'ticket'}], crudFilter = crudCheck.filter(value => notAnUrl.pathname.includes(value.value)), newUrl;
            const checkAccessGranted = async(url) => {
                let permsValues = [];
                permsValuesList.filter(value => value.path == url || value.aliases == url).map(content => {content.data.map(value => {return permsValues.push({action: value.action, collection: value.collection})})});
                const getCheckRolePermissions = async() => {return await Promise.all(permsValues.map(perm => fetch(`${ApiUrl}/permissions?search=${req.roleID}&fields=action,collection&filter=[collection]=${perm.collection}`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken}}).then(response => response.json()).then(result => result.data)))};
                let checkRole = await getCheckRolePermissions();
                checkRole = checkRole.flatMap(e => e).flat(1); console.log(permsValues, url);
                return permsValues.map(value => {return checkRole.filter(content => content.collection == value.collection && content.action == value.action)})
            };
            /* if(req.refreshToken !== null) {
                const signRefreshToken = sign(refreshValues, process.env.SESSION_SECRET);
                let tokenLifeTime = refreshValues.expires;
                console.log('INFO: Token refresh');
                return res.clearCookie("project1_cookie").status(200),
                res.cookie("project1_cookie", signRefreshToken, {
                    maxAge: tokenLifeTime,
                    httpOnly: true,
                    secure: false,
                    domain: 'localhost',
                    sameSite: 'strict'
                }).status(200); //.redirect('/');
            } */
            let nbUrl;
            if(isObjEmpty(crudFilter) == false) newUrl = crudFilter.map(content => {return notAnUrl.pathname.split(content.value, 1) + content.value}).reduce((acc,value) => acc + value), nbUrl = crudFilter.map(content => {return notAnUrl.pathname.split(content.value, -1)[1].split('/', -1)[1]}).reduce((acc,value) => acc + value);
            else newUrl = notAnUrl.pathname;
            let checkAccess = ((await checkAccessGranted(newUrl))/*.reduce((acc,value) => acc + value)*/);
            const panelUrlList = [{value:'/panel/manager/recipe/update'},{value:'/panel/manager/recipe/delete'},{value:'/panel/support/ticket'},{value:'/panel/support/ticket/delete'}];
            let filterPanelUrl = panelUrlList.filter(content => content.value == newUrl).map(content => {return content.value});
            if(isObjEmpty(filterPanelUrl) == false && typeof nbUrl !== 'undefined') {
                filterPanelUrl = filterPanelUrl.reduce((acc,value) => acc + value); let userInfoID = []; var filterInfosID = [];
                const getUserInfo = async() => {return await fetch(`${ApiUrl}/users/me?fields=recipe_id,ticket_id,addedtickets_id`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-Type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)};
                userInfoID.push(await getUserInfo());
                userInfoID.map(content => {
                    if(filterPanelUrl == panelUrlList[0].value || filterPanelUrl == panelUrlList[1].value) {
                        if(isObjEmpty(content.recipe_id) == false) filterInfosID = content.recipe_id.filter(value => value == nbUrl);
                        else if(req.roleID == process.env.ADMIN_ROLE) filterInfosID = [Number(nbUrl)]
                    }
                    else if(filterPanelUrl == panelUrlList[2].value || filterPanelUrl == panelUrlList[3].value) {
                        if(isObjEmpty(content.ticket_id) == false) filterInfosID = content.ticket_id.filter(value => value == nbUrl); if(isObjEmpty(filterInfosID) == true && !filterInfosID.length >= 1) {filterInfosID = content.addedtickets_id.filter(value => value == nbUrl)}
                        else if(req.roleID == process.env.ADMIN_ROLE)  filterInfosID = [Number(nbUrl)]
                    }
                });
            }
            if(isObjEmpty(checkAccess) == false && req.statusID == 'active' || req.roleID == process.env.ADMIN_ROLE && req.statusID == 'active') {
                console.log(filterInfosID)
                if(typeof filterInfosID !== 'undefined') {
                    if((isObjEmpty(filterInfosID) == false || req.roleID == process.env.ADMIN_ROLE)) {
                        console.log(`Access granted to ${newUrl}!`);
                        return next();
                    } else {
                        return res.redirect('/panel');
                    }
                } else {
                    console.log(`Access granted to ${newUrl}!`);
                    return next();
                }
            } else if(req.statusID && req.statusID !== 'active') {
                if(newUrl !== '/panel') return res.redirect('/panel');
                return next();
            } else if(typeof req.roleID == 'undefined' && typeof req.statusID == 'undefined') {
                if(newUrl === '/panel' || newUrl === '/logout') return next();
                else return res.redirect('/panel');
            }else {
                return res.redirect('/');
            }
        }
    } catch(error) {
        console.warn('Erreur 403 - Forbidden: ', error);
        return res.redirect('/');
    }
};

const headerValidation = async(req, res, next) => {
    const token = req.cookies.project1_cookie;
    try {
        if(token) {
            const data = verify(token, process.env.SESSION_SECRET);
            if(data) {
                req.accessToken = data.access_token, req.refreshToken = data.refresh_token;
                const getUserValues = async() => {return await fetch(`${ApiUrl}/users/me?fields=id,first_name,last_name,pseudonyme,avatar`, {method: 'GET',credentials: 'include',headers: {'Authorization': 'Bearer ' + req.accessToken,'Content-Type': 'application/json','Accept': 'application/json'}}).then(response => response.json()).then(result => result.data)};
                let userData = await getUserValues();
                // console.log('userData: ', userData);
                req.userID = userData.id;
                if(isObjEmpty(userData) == false || typeof userData !== undefined) {
                    req.userHeaderFirstname = userData.first_name, req.userHeaderLastname = userData.last_name, req.userHeaderPseudonyme = userData.pseudonyme, req.userHeaderAvatar = userData.avatar;
                } else {
                    req.userHeaderFirstname = '', req.userHeaderLastname = '', req.userHeaderPseudonyme = '', req.userHeaderAvatar = '';
                    return res.redirect('/');
                }
            }
        }
        next();
    } catch(error) {
        console.warn('Erreur 403 - headerValidation: ', error);
    }
};
const isAllowed = async(req, res, next) => {
    try {
        const urlList = [{value:'/login'},{value:'/register'},{value:'/logout'}];
        let filter = urlList.filter(url => url.value == req.originalUrl).map(content => {return content.value});
        if(isObjEmpty(filter) == false) {
            filter = filter.reduce((acc,value) => acc + value);
            if(req.accessToken) {
                if(filter == urlList[2].value) next(); else return res.redirect('/')
            } else {
                if(filter !== urlList[2].value) next(); else return res.redirect('/')
            }
        } else next();
    } catch(error) {
        console.warn('Erreur 403 - isAllowed: ', error);
    }
};

app.use('/panel/', authorization);
app.use('/logout', headerValidation, isAllowed);
app.use('/', headerValidation, isAllowed, router);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message)
});
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message)
});

app.listen(PORT, () => {
    console.log(`Run on: http://localhost:${PORT}`);
});