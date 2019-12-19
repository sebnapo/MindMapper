# MindMapper

Notre projet pour le Hackathon X5-GON !
Membre de l'équipe : 
* Napoleon Sébastien 
* Farce Damien 
* Xinyao jiang

## Analyse réfléxive

Nous sommes plutôt satisfait de la finalité de ce Hackathon. C'est dommage d'avoir un problème avec
le JSON généré qui n'est pas pris en compte par D3.js. L'éxpérience utilisateur en est donc impacté
car impossible d'utiliser le champ recherche pour l'instant mais cela ne doit pas être
très compliqué à fixer. Nous pensons que nous avons perdu beaucoup de temps sur la création
de canvas (que nous avons abandonnés à la fin de la journée de dev). Avec ce temps supplémentaire,
nous aurions pu résoudre les différents problèmes auxquels nous nous sommes confrontés 
juste avant notre présentation.

## Répartition du travail
---TOTAL---
* 33% pour tout le monde

---API---
* 100% Sébastien

---word2vec---
* 100% Sébastien

---Graphique---
* canvas : 100% Damien
* D3.js : 25% Xinyao 75% Damien
* Recherche de la bibliothèque : 80% Xinya 20% Damien

###Ce qu'on a fait :
* Une API en Python utilisant Flask :
    * Pour l'utiliser, installer au préalable Flask avec :
    ``` 
    pip install flask
    ```
  * Puis lancer le serveur : (il faut se placer dans le repertoire API)
  ```
  set FLASK_APP=api.py
  flask run
  ```
  
  * Installer les librairies python qu'il manque si erreur..
 
 * Un site web, pour l'utiliser il faut démarrer un petit serveur http 
    * On peux le faire avec python3 (se placer au préalable dans le dossier
    Website)
    ```
   py -m http.server
    ```

   * Ensuite on peut naviguer au localhsot:8000/ pour se rendre sur le site
   * Pour charger un JSON que l'on génère dans la console, le copier et le coller 
   dans le fichier good.json dans Website/assets/data/good.json
   
  * Un Modèle word2vec à partir des concepts clés de chaques texte (pour faire
  tourner l'API, il faut que vous genereriez le modèle SKIP-GRAM à partir du
  Jupyter Notebook X5GON_HACKATON_NANTES), dans les premières cellules, vous 
  verrez les instructions pour le faire en commentaires. (En dessous des question
  1,2,3,4).
   
   