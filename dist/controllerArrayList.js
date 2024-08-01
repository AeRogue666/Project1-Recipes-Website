import {sortDateAsc, sortDateDsc, sortTitleAsc, sortTitleDsc, sortNameAsc, sortNameDsc} from '../dist/sortModule.js';

/* HOME CONTROLLER */
/* About-Me Page */
export const aboutme = [
    {id:1, content:'Bonjour, je me nomme AurelDev, je suis Développeur Web Front-End et je conçois des sites internet de A à Z pour des grosses ou petites entreprises, des associations, des auto-entrepreneurs.'}
];
export const aboutjob = [{id:1, content:'Ayant obtenu mon diplôme récent, mon expérience est encore limitée mais je ne cesse d\'apprendre et de m\'améliorer, en utilisant notamment mes connaissances acquises au cours de ma vie.'},{id:2, content:'Issue d\'un Baccalauréat Technologique, je savais déjà ce que je voulais faire : Devenir Développeur Web.'},{id:3, content:'J\'ai donc passé un Titre Professionnel pour devenir Développeur web, chez O\'Clock de Janvier à Juin 2023.'},{id:4, content:'Cette passion de la création me vient de ma grande curiosité, adorant notamment apprendre des tas de choses sur tout un tas de domaines, ce qui se révèle parfois utile.'},{id:5, content:'Force de proposition, je n\'hésite pas à suggérer des idées novatrices afin d\'améliorer les sites internet de mes clients.'},{id:6, content:'Je vous souhaite une agréable visite de ce site internet !'}];
export const aboutskills = [{id:1, content:'HTML, CSS, JavaScript, SQL'},{id:2, content:'ExpressJS, VueJS, Svelte, Vite, NodeJS'},{id:3, content:'Sequelize'},{id:4, content:'Font Awesome, TailWind, Bootstrap'},{id:5, content:'PostGreSQL, MySQL'}];

/* PANEL CONTROLLER */
/* Homepage Panel / Burger Panel */
export const panelBtnList = [{id:1, title:'Accueil', url:'/panel', icon:'home'},{id:2, title:'Profil', url:'/panel/profile', icon:'user'},{id:3, title:'Support (v2)', url:'/panel/support', icon:'ticket'},{id:4, title:'Gestion des recettes', url:'/panel/manager/recipe', icon:'kitchen-set'},{id:5, title:'Gestion des commentaires', url:'/panel/manager/recipe/comment', icon:'comment'},{id:6, title:'Statistiques', url:'/panel/manager/stats', icon:'chart-simple'},{id:7, title:'Gestion des utilisateurs', url:'/panel/admin', icon:'user-plus'}];
/* Homepage Recipe Manager */
export const recipeBtnList = [{id:1, title:'Créer une recette', url:'/panel/manager/recipe/create', icon:'plus'},{id:2, title:'Liste de vos recettes', url:'/panel/manager/recipes-list', icon:'clipboard-list'}];
/* Homepage Support */
export const supportBtnList = [{id:1, title:'Créer un ticket', url:'/panel/support/ticket/create', icon:'ticket'},{id:2, title:'Liste des tickets', url:'/panel/support/tickets-list', icon:'calendar-days'},{id:3, title:'Devenir un auteur', url:'/panel/become-an-author', icon:'calendar-xmark'}];
/* Homepage Admin */
export const adminBtnList = [{id:1, title:'Gérer les rôles', url:'/panel/admin/roles-list', icon:'clipboard'},{id:2, title:'Gérer les utilisateurs', url:'/panel/admin/users-list', icon:'user-plus'},{id:3, title:'Gérer les signalements', url:'/panel/admin/report', icon:'flag'}];
/* Homepage Roles */
export const rolesBtnList = [{id:1, title:'Gérer les rôles', url:'/panel/admin/roles-list', icon:'clipboard'},{id:2, title:'Créer un rôle', url:'/panel/admin/roles-list/create', icon:'plus'}];
/* Profile Update */
export const formValueList = [{id:1, name:'surname', title:'Nouveau surnom', type:'text', arrayName:'formValue'},{id:2, name:'profimg', title:'Image par URL', type:'url', arrayName:'formImgValue', valuename:'image', pattern:'https://.*'},{id:3, name:'profimg', title:'Image par Upload (Non utilisable)', type:'file', arrayName:'formImgValue', valuename:'avatar', pattern:''},{id:4, name:'description', title:'Nouvelle description', type:'text', arrayName:'formDescValue'},{id:5, name:'email', title:'Nouvel email', type:'email', arrayName:'formValue'},{id:6, name:'resetpwd', title:'Pour réinitialiser votre mot de passe, veuillez renseigner votre adresse mail', type:'email', arrayName:'formValue'}];
/* Recipe Create Page */
export const recipeFormTextareaList = [
    {id:3, title:'Description courte de la recette', placeholder:'', maxlength:'500', name:'description'},
    {id:4, title:'Description de l\'image', placeholder:'', maxlength:'300', name:'imageDescription'},
    {id:5, title:'Informations sur l\'auteur de l\'image', placeholder:'Nom et page de l\'auteur',maxlength:'250', name:'labelDescription'},
    {id:6, title:'Informations sur la source de l\'image', placeholder:'Lien de la page où est stocké l\'image (Pas PNG/JPEG/WEBP/SVG):\n https://open.wikimedia.org/lien-de-la-page-de-l-image-sourcee/', maxlength:'250', name:'labelURL'},
    {id:7, title:'Ingrédients', placeholder:'Veuillez écrire à la ligne chacun des ingrédients comme suit:\n 1 Ingredient\n 2 De celui-ci\n 15 De celui-là', maxlength:'1000', name:'cookingIngredient'},
    {id:8, title:'Matériels', placeholder:'Veuillez écrire à la ligne chacun des ustensiles', maxlength:'1000', name:'cookingTool'},
    {id:9, title:'Préparation', placeholder:'Veuillez écrire à la ligne chacune des étapes comme suit:\n ETAPE 1\n blabla\n ETAPE 2\n blabla\n ETAPE 3\n blabla..', maxlength:'5000', name:'cookingRecipe'}
];
export const recipeFormTypeList = [{id:1, title:'Titre de la recette', type:'text', name:'title'},{id:2, title:'Image (URL)', type:'url', name:'image'}];
/* Recipes Manager List */
export const statusTypeList = [{value:'draft', status:'En attente', color:'yellow', date:''},{value:'need_edit', status:'A modifier', color:'orange', date:''},{value:'published', status:'Publiée', color:'skyblue', date:'date_published'},{value:'resolved', status:'Résolu', color:'green', date:''},{value:'archived', status:'Archivée', color:'redorange', date:'date_archived'},{value:'cancelled', status:'Rejetée', color:'red', date:'date_cancelled'}];
/* Ticket Create Page */
export const ticketFormTypeList = [{id:1, title:'Titre du ticket', subtitle:'Un titre clair et précis', name:'title', type:'input'}];
export const ticketFormProblemLevelList = [
    {id:2, title:'Niveau du problème', subtitle:'Choisissez en fonction de ce que vous pensez être le niveau de votre problème (soyez réaliste)', name:'problemlevel', data:[
        {title:'Faible', name:'problemlevel', value:'1', icon:'hand-peace', color:'yellow', key:''},
        {title:'Classique', name:'problemlevel', value:'2', icon:'hand-peace', color:'green', key:''},
        {title:'Moyennement Important', name:'problemlevel', value:'3', icon:'hand', color:'orange', key:''},
        {title:'Important', name:'problemlevel', value:'4', icon:'exclamation', color:'redorange', key:''},
        {title:'Urgent', name:'problemlevel', value:'5', icon:'triangle-exclamation', color:'red', key:''},
]}];
export const ticketFormProblemTypeList = [{id:3, title:'Type de problème', subtitle:'Choisissez en fonction du type de problème rencontré', name:'problemtype', data:[
    {title:'Une simple question', name:'problemtype', value:'question', icon:'question', color:'yellow', key:''},
    {title:'Devenir Auteur', name:'problemtype', value:'upranking_to_author', icon:'warning', color:'green', key:''},
    {title:'Un message à signaler', name:'problemtype', value:'report_message', icon:'message', color:'orange', key:''},
    {title:'Une personne à signaler', name:'problemtype', value:'report_user', icon:'person', color:'redorange', key:''},
    {title:'Un problème à signaler', name:'problemtype', value:'report_problem', icon:'warning', color:'red', key:''},
]}];
export const ticketFormTextareaList = [{id:4, title:'Description du ticket', subtitle:'Décrivez votre problème en 1000 caractères', placeholder:'Bonjour,', value:'Bonjour,', maxlength:'1000', name:'description'}];
/* Ticket Page */
export const ticketSettingsList = [
    {id:'settings', title:'Paramètres', data:[
        {id:1, title:'Titre du ticket', name:'tickettitle', type:'input'},
        {id:2, title:'Niveau', data:[
            {id:1, title:'Faible', name:'level', value:'1', color:'skyblue'},
            {id:2, title:'Classique', name:'level', value:'2', color:'yellow'},
            {id:3, title:'Moyennement Important', name:'level', value:'3', color:'orange'},
            {id:4, title:'Important', name:'level', value:'4', color:'redorange'},
            {id:5, title:'Urgent', name:'level', value:'5', color:'red'}
        ]},
        {id:3, title:'Type', data:[
            {id:1, title:'Question', name:'type', value:'question'},
            {id:2, title:'Signaler un problème', name:'type', value:'problem_report'},
            {id:3, title:'Signaler un utilisateur', name:'type', value:'user_report'},
            {id:4, title:'Signaler un message', name:'type', value:'comment_report'},
            {id:5, title:'Devenir Auteur', name:'type', value:'upranking_to_author'}
        ]},
        {id:4, title:'Status', data:[
            {id:1, title:'Mettre en attente', name:'status', value:'draft', color:'yellow'},
            {id:2, title:'Ouvrir le ticket', name:'status', value:'published', color:'green'},
            {id:3, title:'Clôturer le ticket', name:'status', value:'resolved', color:'skyblue'},
            {id:4, title:'Archiver le ticket', name:'status', value:'archived', color:'orange'},
            {id:5, title:'Refuser le ticket', name:'status', value:'cancelled', color:'redorange'},
        ]}
    ]}
];
export const ticketInformationsList = [{id:'infos', title:'Informations', data:[]}];
export const colorful = [{color:'yellow'},{color:'skyblue'},{color:'orange'},{color:'redorange'},{color:'red'},];
export const problemList = [{problem:'Faible', value:'draft', status:'En attente', type:'question', typevalue:'Question', color:'skyblue'},{problem:'Classique', value:'published', status:'En cours de traitement', type:'problem_report', typevalue:'Signaler un problème', color:'yellow'},{problem:'Moyennement Important', value:'resolved', status:'Résolu', type:'user_report', typevalue:'Signaler un utilisateur', color:'green'},{problem:'Important', value:'archived', status:'Archivé', type:'comment_report', typevalue:'Signaler un message', color:'redorange'},{problem:'Urgent', value:'cancelled', status:'Refusé', type:'upranking_to_author', typevalue:'Devenir Auteur', color:'red'},];

/* Roles Update */
export const rolesValueList = 
    [{title:'Permissions', data:[
        {title:'Categories', data:[
            {title:'Créer ', data:[
                {name:'createcategory', value:'c0', key:'0000', title:'Non'},
                {name:'createcategory', value:'c1', key:'00001140', title:'Oui'},]
            },
            {title:'Lire', data:[
                {name:'readcategory', value:'r0', key:'1000', title:'Non'},
                {name:'readcategory', value:'r1', key:'100001140', title:'Oui'},]
            },
            {title:'Modifier', data:[
                {name:'updatecategory', value:'u0', key:'2000', title:'Non'},
                {name:'updatecategory', value:'u1', key:'20', title:'Oui'},]
            },
            {title:'Supprimer', data:[
                {name:'deletecategory', value:'d0', key:'3000', title:'Non'},
                {name:'deletecategory', value:'d1', key:'30', title:'Oui'},]
            },
        ]},
        {title:'Recettes', subtitle:'1 : Visiteur, 2 : Utilisateur, 3: Auteur', data:[
            {title:'Créer ', data:[
                {name:'createrecipe', value:'c0', key:'0100', title:'Non'},
                {name:'createrecipe', value:'c1', key:'010009111516171819202142', title:'Oui'},]
            },
            {title:'Lire', data:[
                {name:'readrecipe', value:'r0', key:'1100', title:'Non'},
                {name:'readrecipe', value:'r1', key:'', title:'1'},
                {name:'readrecipe', value:'r2', key:'101000910111516171819202130363738414246', title:'2'},
                {name:'readrecipe', value:'r3', key:'11000910111215161718192021303132363738414246', title:'3'},]
            },
            {title:'Modifier', data:[
                {name:'updaterecipe', value:'u0', key:'2100', title:'Non'},
                {name:'updaterecipe', value:'u1', key:'2109111516171819202142', title:'Oui'},]
            },
            {title:'Supprimer', data:[
                {name:'deleterecipe', value:'d0', key:'3100', title:'Non'},
                {name:'deleterecipe', value:'d1', key:'31', title:'Oui'},]
            },
        ]},
        {title:'Tickets', subtitle:'1: Utilisateur, 2: Administrateur', data:[
            {title:'Créer ', data:[
                {name:'createticket', value:'c0', key:'0200', title:'Non'},
                {name:'createticket', value:'c1', key:'00211131438', title:'Oui'},]
            },
            {title:'Lire', data:[
                {name:'readticket', value:'r0', key:'1200', title:'Non'},
                {name:'readticket', value:'r1', key:'1020010111314363738464849', title:'1'},
                {name:'readticket', value:'r2', key:'102001011121314363738464849', title:'2'}]
            },
            {title:'Modifier', data:[
                {name:'updateticket', value:'u0', key:'2200', title:'Non'},
                {name:'updatetticket', value:'u1', key:'2021114', title:'Oui'},]
            },
            {title:'Supprimer', data:[
                {name:'deleteticket', value:'d0', key:'3200', title:'Non'},
                {name:'deleteticket', value:'d1', key:'32', title:'Oui'},]
            },
        ]},
        {title:'Commentaires', subtitle:'Lire : (1 : Visiteur, 2 : Utilisateur, 3: Auteur), Modifier: (1 : Utilisateur, 2 : Auteur)', data:[
            {title:'Créer ', data:[
                {name:'createcomment', value:'c0', key:'00300', title:'Non'},
                {name:'createcomment', value:'c1', key:'003111440', title:'Oui'},]
            },
            {title:'Lire', data:[
                {name:'readcomment', value:'r0', key:'10300', title:'Non'},
                {name:'readcomment', value:'r1', key:'', title:'1'},
                {name:'readcomment', value:'r2', key:'1030011143637384046', title:'2'},
                {name:'readcomment', value:'r3', key:'1300101112143637384046', title:'3'},]
            },
            {title:'Modifier', data:[
                {name:'updatecomment', value:'u0', key:'20300', title:'Non'},
                {name:'updatecomment', value:'u1', key:'2031114', title:'1'},
                {name:'updatecomment', value:'u2', key:'2310111440', title:'2'},]
            },
            {title:'Supprimer', data:[
                {name:'deletecomment', value:'d0', key:'3300', title:'Non'},
                {name:'deletecomment', value:'d1', key:'33', title:'Oui'},]
            },
        ]},
        {title:'Mentions légales', data:[
            {title:'Créer ', data:[
                {name:'createlm', value:'c0', key:'0400', title:'Non'},
                {name:'createlm', value:'c1', key:'', title:'Oui'},]
            },
            {title:'Lire', data:[
                {name:'readlm', value:'r0', key:'1400', title:'Non'},
                {name:'readlm', value:'r1', key:'104001011143037', title:'Oui'},]
            },
            {title:'Modifier', data:[
                {name:'updatelm', value:'u0', key:'2400', title:'Non'},
                {name:'updatelm', value:'u1', key:'', title:'Oui'},]
            },
            {title:'Supprimer', data:[
                {name:'deletelm', value:'d0', key:'3400', title:'Non'},
                {name:'deletelm', value:'d1', key:'34', title:'Oui'},]
            },
        ]},
        {title:'Liste des erreurs', data:[
            {title:'Créer ', data:[
                {name:'createerror', value:'c0', key:'0500', title:'Non'},
                {name:'createerror', value:'c1', key:'', title:'Oui'},]
            },
            {title:'Lire', data:[
                {name:'readerror', value:'r0', key:'1500', title:'Non'},
                {name:'readerror', value:'r1', key:'105002324', title:'Oui'},]
            },
            {title:'Modifier', data:[
                {name:'updateerror', value:'u0', key:'2500', title:'Non'},
                {name:'updateerror', value:'u1', key:'', title:'Oui'},]
            },
            {title:'Supprimer', data:[
                {name:'deleteerror', value:'d0', key:'3500', title:'Non'},
                {name:'deleteerror', value:'d1', key:'35', title:'Oui'},]
            },
        ]},
        {title:'Utilisateurs', subtitle:'1 : Utilisateur, 2 : Administrateur', data:[
            {title:'Créer ', data:[
                {name:'createuser', value:'c0', key:'0600', title:'Non'},
                {name:'createuser', value:'c1', key:'', title:'Oui'},]
            },
            {title:'Voir', data:[
                {name:'readuser', value:'r0', key:'1600', title:'Non'},
                {name:'readuser', value:'r1', key:'10600010203040708091028303132333435394041', title:'1'},
                {name:'readuser', value:'r2', key:'1060001020304070809101128303132333435394041', title:'2'},]
            },
            {title:'Modifier', data:[
                {name:'updateuser', value:'u0', key:'2600', title:'Non'},
                {name:'updateuser', value:'u1', key:'206010204050809', title:'1'},
                {name:'updateuser', value:'u2', key:'26', title:'2'},]
            },
            {title:'Supprimer', data:[
                {name:'deleteuser', value:'d0', key:'3600', title:'Non'},
                {name:'deleteuser', value:'d1', key:'36', title:'Oui'},]
            },
        ]},
        {title:'Rôles', subtitle:'1 : Utilisateur, 2 : Administrateur', data:[
            {title:'Créer ', data:[
                {name:'createrole', value:'c0', key:'0700', title:'Non'},
                {name:'createrole', value:'c1', key:'', title:'Oui'},]
            },
            {title:'Voir', data:[
                {name:'readrole', value:'r0', key:'1700', title:'Non'},
                {name:'readrole', value:'r1', key:'10700252627', title:'1'},
                {name:'readrole', value:'r2', key:'1799', title:'2'},]
            },
            {title:'Modifier', data:[
                {name:'updaterole', value:'u0', key:'2700', title:'Non'},
                {name:'updaterole', value:'u1', key:'', title:'Oui'},]
            },
            {title:'Supprimer', data:[
                {name:'deleterole', value:'d0', key:'3700', title:'Non'},
                {name:'deleterole', value:'d1', key:'37', title:'Oui'},]
            },
        ]},
        {title:'Anciens utilisateurs', subtitle:'1 : Utilisateur, 2 : Administrateur', data:[
            {title:'Créer ', data:[
                {name:'createolduser', value:'c0', key:'0800', title:'Oui'},
                {name:'createolduser', value:'c1', key:'', title:'Non'},]
            },
            {title:'Voir', data:[
                {name:'readolduser', value:'r0', key:'1800', title:'Non'},
                {name:'readolduser', value:'r1', key:'10801020307082839404146', title:'1'},
                {name:'readolduser', value:'r2', key:'', title:'2'},]
            },
            {title:'Modifier', data:[
                {name:'updateolduser', value:'u0', key:'2800', title:'Non'},
                {name:'updateolduser', value:'u1', key:'', title:'Oui'},]
            },
            {title:'Supprimer', data:[
                {name:'deleteolduser', value:'d0', key:'3800', title:'Non'},
                {name:'deleteolduser', value:'d1', key:'38', title:'Oui'},]
            },
        ]},
        {title:'CGU', data:[
            {title:'Créer ', data:[
                {name:'createcgu', value:'c0', key:'', title:'Non'},
                {name:'createcgu', value:'c1', key:'', title:'Oui'},
            ]},
            {title:'Lire ', data:[
                {name:'readcgu', value:'r0', key:'', title:'Non'},
                {name:'readcgu', value:'r1', key:'1150011143037', title:'Oui'},
            ]},
            {title:'Modifier ', data:[
                {name:'updatecgu', value:'u0', key:'', title:'Non'},
                {name:'updatecgu', value:'u1', key:'', title:'Oui'},
            ]},
            {title:'Supprimer ', data:[
                {name:'deletecgu', value:'d0', key:'', title:'Non'},
                {name:'deletecgu', value:'d1', key:'', title:'Oui'},
            ]}
        ]},
        {title:'Cookies', data:[
            {title:'Créer ', data:[
                {name:'createcookie', value:'c0', key:'', title:'Non'},
                {name:'createcookie', value:'c1', key:'', title:'Oui'},
            ]},
            {title:'Lire ', data:[
                {name:'readcookie', value:'r0', key:'', title:'Non'},
                {name:'readcookie', value:'r1', key:'1160011143037', title:'Oui'},
            ]},
            {title:'Modifier ', data:[
                {name:'updatecookie', value:'u0', key:'', title:'Non'},
                {name:'updatecookie', value:'u1', key:'', title:'Oui'},
            ]},
            {title:'Supprimer ', data:[
                {name:'deletecookie', value:'d0', key:'', title:'Non'},
                {name:'deletecookie', value:'d1', key:'', title:'Oui'},
            ]}
        ]},
    ]}];
    
// Les numéros sont générés comme suivant : Action (Par un - Premier chiffre) + Collection (Par un - Second chiffre) + Champs (Par deux - Les autres nombres)
export const rolesFormList = [{id:1, title:'Nom du rôle', subtitle:'Un joli nom de rôle', type:'text', name:'rolename'},{id:2, title:'Icône du rôle', subtitle:'Icônes de chez Font Awesome', type:'text', name:'roleicon'},{id:3, title:'Couleur du rôle', subtitle:'En hexadécimal uniquement : #FFFFFF', type:'text', name:'rolecolor'}];
export const actionsList = [{0:'create'},{1:'read'},{2:'update'},{3:'delete'},{4:'share'}];
export const collectionsList = [{0:'Category'},{1:'Recipe'},{2:'ticket'},{3:'Comment'},{4:'legalmention'},{5:'errorlist'},{6:'directus_users'},{7:'directus_roles'},{8:'old_user'},{9:'directus_files'},{10:'directus_dashboards'},{11:'directus_panels'},{12:'directus_folders'},{13:'directus_shares'},{14:'directus_flows'},{15:'cgu'},{16:'cookies'},{17:'ticket_directus_users'},{18:'ticket_messages'}];
export const fieldsList = [{0:'id'},{1:'first_name'},{2:'last_name'},{3:'pseudonyme'},{4:'email'},{5:'password2'},{6:'email2'},{7:'role'},{8:'avatar'},{9:'description'},{10:'status'},{11:'title'},{12:'sort'},{13:'problemLevel'},{14:'content'},{15:'image'},{16:'imageDescription'},{17:'labelDescription'},{18:'labelURL'},{19:'cookingTool'},{20:'cookingIngredient'},{21:'cookingRecipe'},{22:'datetime'},{23:'code'},{24:'reason'},{25:'color'},{26:'name'},{27:'icon'},{28:'role'},{29:'users'},{30:'date_published'},{31:'date_archived'},{32:'date_cancelled'},{33:'time_published'},{34:'time_archived'},{35:'time_cancelled'},{36:'date_created'},{37:'date_updated'},{38:'user_id'},{39:'ticket_id'},{40:'recipe_id'},{41:'comment_id'},{42:'category_id'},{43:'collection'},{44:'fields'},{45:'action'},{46:'old_user_id'},{47:'directus_users_id'},{48:'user_created'},{49:'user_updated'},{99:'*'}];
/* Recipe Update & User Update pages */
export const datesContentList = [{title:'Date de publication', date:'Non publiée', value:'date_published'},{title:'Date d\'archivage', date:'', value:'date_archived'},{title:'Date de rejet', date:'', value:'date_cancelled'},{title:'Date de publication', date:'Non publiée', value:'date_created'}];

/* ALL CONTROLLERS */
/* Index */
export const permsValuesList = [
    {path:'/panel', aliases:'/panel/', data:[{action:'read', collection:'directus_users'}]},{path:'/panel/profile', data:[{action:'update', collection:'directus_users'}]},{path:'/panel/profile/update', data:[{action:'update', collection:'directus_users'}]},
    {path:'/panel/support', data:[{action:'read', collection:'ticket'}]},{path:'/panel/support/ticket', data:[{action:'read', collection:'ticket'},{action:'update', collection:'ticket'}]},{path:'/panel/support/tickets-list', data:[{action:'read', collection:'ticket'}]},{path:'/panel/support/ticket/create', data:[{action:'create', collection:'ticket'}]},{path:'/panel/support/ticket/delete', data:[{action:'delete', collection:'ticket'}]},{path:'/panel/become-an-author', data:[{action:'create', collection:'ticket'}]},
    {path:'/panel/manager/recipe', data:[{action:'create', collection:'Recipe'}]},{path:'/panel/manager/recipes-list', data:[{action:'read', collection:'Recipe'}]},{path:'/panel/manager/recipe/create', data:[{action:'create', collection:'Recipe'}]},{path:'/panel/manager/recipe/update', data:[{action:'update', collection:'Recipe'}]},{path:'/panel/manager/recipe/delete', data:[{action:'delete', collection:'Recipe'}]},{path:'/panel/manager/stats', data:[{action:'update', collection:'Recipe'}]},
    {path:'/panel/admin', data:[{action:'update', collection:'directus_roles'}]},{path:'/panel/admin/roles-list', data:[{action:'update', collection:'directus_roles'}]},{path:'/panel/admin/roles-list/create', data:[{action:'create', collection:'directus_roles'}]},{path:'/panel/admin/roles-list/update', data:[{action:'update', collection:'directus_roles'}]},{path:'/panel:admin/roles-list/delete', data:[{action:'delete', collection:'directus_roles'}]},{path:'/panel/admin/users-list', data:[{action:'update', collection:'directus_users'}]},{path:'/panel:admin/users-list/create', data:[{action:'create', collection:'directus_users'}]},{path:'/panel/admin/users-list/update', data:[{action:'update', collection:'directus_users'}]},{path:'/panel/admin/users-list/delete', data:[{action:'delete', collection:'directus_users'}]},
];
/* Sorting Recipes */
export const sortList = [{id:1, title:'Ordre ascendant (A -> Z)', exec:sortTitleAsc},{id:2, title:'Ordre descendant (Z -> A)', exec:sortTitleDsc},{id:3, title:'Plus récent -> Plus ancien', exec:sortDateAsc},{id:4, title:'Plus ancien -> Plus récent', exec:sortDateDsc},{id:5, title:'Aucun élément'}];
export const sortDropdownList = [{id:3, title:'Plus récent -> Plus ancien'}];
export const sortPanelList = [{id:1, title:'Ordre ascendant (A -> Z)', exec:sortNameAsc},{id:2, title:'Ordre descendant (Z -> A)', exec:sortNameDsc}];