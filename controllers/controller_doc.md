# Documentation controller

### Checked properties
On veut donner le status ```Checked``` aux checkboxes sur lesquelles l'utilisateur a cliqué avant envoie du formulaire.
``` if (isObjEmpty(inputID) == false) {
    let tempInputCtg = inputID.input;
    let tempCategoryList = [];

    console.log('Is this a string? ', isString(tempInputCtg), ' if not, what is it? ', toString.call(tempInputCtg))

    const AddCheckedProperty = () => {
        for(var i=0; i < inputID.length; i++) {
            let tempId = inputID[i];
            let placeId = tempId -1;
            console.log('categorie value: ', tempId)
            console.log('place id: ', placeId);
                
            const filterCategory = AllCategories
            .filter(category => category.id == tempId)
            .map(category => ({...category, checked: 'checked'}));
            // console.log('Filter Category: ', filterCategory);
            // tempCategoryList.push(filterCategory);
                
            const replaceCategory = AllCategories
            .toSpliced(placeId,1, filterCategory)
            .toSorted((a, b) => a - b);
            // console.log('Replace Category: ', replaceCategory)
            if (tempCategoryList.indexOf(replaceCategory) === -1) {
                tempCategoryList.push(replaceCategory);
            }
        }
        console.log(tempCategoryList);
        return tempCategoryList;
    }
    tempCategoryList = AddCheckedProperty();
    console.log('Temp ctg: ', tempCategoryList);
} 
```
### Filter Categories

Pâtisserie : Gâteaux, Crèmes, Tartes (sucrées/salées), Chocolat, Confiserie, Entremets, Quiches, Tourtes, etc.
Boulangerie (Pâtes fermentées/levées (levure,levain)): Pains, Sandwichs, Pizza
Viennoiserie (Pâtes fermentées/levées/feuilletées souvent sucrés et gras): Croissants, Pains au chocolat, Brioches, Beignets, Chaussons, Pâtes à choux (Chouquettes, Corniottes, etc.), Pains au lait, Pains aux raisins, Pain viennois, Palmiers, Sacristain,  etc.

### Sort by Element

##### ! NE FONCTIONNE QUE POUR LES MOTS !

``` sort() ``` => Trie par ordre alphabétique (Ascending order)
``` reverse() ``` => Trie par ordre analphabétique (Descending order)

##### ! POUR LES CHIFFRES VOIR CI-DESSOUS !

(Fonctionne mais n'est pas ce qu'il y a de plus efficient)
``` sort((a,b){return a - b}) ``` => Trie par ordre alphabétique les chiffres
``` sort((a,b){return b - a}) ``` => Trie par ordre analphétique les chiffres 
(Fonctionne pour les arrays contenant des objets)
``` sort((a, b){return a.year - b.year}) ``` => Trie par ordre alphabétique les objets en fonction de l'année
``` sort(function(a, b){let x = a.type.toLowerCase(); let y = b.type.toLowerCase(); if (x < y) {return -1;} if (x > y) {return 1;} return 0;}); ``` => Trie par ordre alphabétique les strings (par exemple un titre)
