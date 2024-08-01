import express from 'express';
import controller from './controllers/controller.js';
import loginController from './controllers/loginController.js';
import panelController from './controllers/panelController.js';
import hpp from 'hpp';

const router = express.Router();

// On définit chaque route du projet
/* Routes accessibles sans connexion */
router.get('/', controller.home);
router.get('/recipes', controller.recipes).use(hpp({whitelist: ['input','tag','sort']}));
router.get('/recipe/:RecipeID', controller.recipe);
router.post('/recipe/:RecipeID', controller.recipe).use(hpp({whitelist: ['fav','like','dislike']}));
router.post('/recipes', controller.recipes);
router.get('/recipes?search=:QueryID', controller.recipes);
router.get('/legalMentions', controller.legalMentions);
router.get('/contact', controller.contact);
router.get('/cgu', controller.cgu);
router.get('/cookies', controller.cookies);
router.get('/about', controller.aboutus);
router.get('/profile/:PseudonymeID', controller.publicProfile);
/* Routes de connexion */
router.get('/login', loginController.login);
router.post('/login', loginController.login);
router.get('/register', loginController.register);
router.post('/register', loginController.register);
router.get('/logout', loginController.logout);
/* Routes nécessitant une connexion */
router.get('/panel', panelController.home);
router.get('/panel/profile', panelController.profile);
router.post('/panel/profile', panelController.profile);
router.get('/panel/profile/update', panelController.profileUpdate);
router.post('/panel/profile/update', panelController.profileUpdate);
router.get('/panel/support', panelController.supportHomePage);
router.get('/panel/support/ticket/create', panelController.ticketCreate);
router.post('/panel/support/ticket/create', panelController.ticketCreate);
router.get('/panel/support/tickets-list', panelController.ticketsList);
router.post('/panel/support/tickets-list', panelController.ticketsList);
router.get('/panel/support/ticket/:ticketID', panelController.ticket);
router.post('/panel/support/ticket/:ticketID', panelController.ticket);
router.get('/panel/support/ticket/delete/:ticketID', panelController.ticketDelete);
router.post('/panel/support/ticket/delete/:ticketID', panelController.ticketDelete);
router.get('/panel/become-an-author', panelController.becomeAnAuthor);
router.get('/panel/manager/recipe', panelController.recipesManagerHomePage);
router.get('/panel/manager/recipe/create', panelController.recipeCreate);
router.post('/panel/manager/recipe/create', panelController.recipeCreate);
router.get('/panel/manager/recipes-list', panelController.recipesList).use(hpp({whitelist: ['input','tag','sort']}));
router.post('/panel/manager/recipes-list', panelController.recipesList).use(hpp({whitelist: ['input','tag','sort']}));
router.get('/panel/manager/recipe/update/:RecipeID', panelController.recipeUpdate);
router.post('/panel/manager/recipe/update/:RecipeID', panelController.recipeUpdate);
router.get('/panel/manager/recipe/delete/:RecipeID', panelController.recipeDelete);
router.post('/panel/manager/recipe/delete/:RecipeID', panelController.recipeDelete);
router.get('/panel/manager/stats', panelController.statistics);
router.post('/panel/manager/stats', panelController.statistics).use(hpp({whitelist: ['user','recipe']}));
router.get('/panel/admin', panelController.adminHomePage);
router.get('/panel/admin/users-list', panelController.userslist).use(hpp({whitelist: ['surname','pseudonyme','role','status']}));
router.post('/panel/admin/users-list', panelController.userslist).use(hpp({whitelist: ['surname','pseudonyme','role','status']}));
router.get('/panel/admin/users-list/update/:pseudonymeID', panelController.userUpdate);
router.post('/panel/admin/users-list/update/:pseudonymeID', panelController.userUpdate);
router.get('/panel/admin/users-list/delete/:pseudonymeID', panelController.userDelete);
router.post('/panel/admin/users-list/delete/:pseudonymeID', panelController.userDelete);
router.get('/panel/admin/roles-list', panelController.roleslist);
router.post('/panel/admin/roles-list', panelController.roleslist);
router.get('/panel/admin/roles-list/create', panelController.roleCreate);
router.post('/panel/admin/roles-list/create', panelController.roleCreate);
router.get('/panel/admin/roles-list/update/:roleID', panelController.roleUpdate);
router.post('/panel/admin/roles-list/update/:roleID', panelController.roleUpdate);
router.get('/panel/admin/roles-list/delete/:roleID', panelController.roleDelete);
router.post('/panel/admin/roles-list/delete/:roleID', panelController.roleDelete);
/* Route de secours si aucune route disponible */
router.get('*', controller.notfound);
/* router.get('/recipe/:id', (req,res) => {res.send(req.params.id)}) */
export default router;