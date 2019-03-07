# APViz
## Projet - Visualisation de l'activité physique

*Site Web : [aubed.github.io/APViz/](https://aubed.github.io/APViz/index.html)*

Projet mené par :
 * Caroline Bettinger
 * Océane Bligand
 * Jeanne Auvray

 ## Contenu du projet
 ### Contexte
 Le 21e siècle a vu les technologies de la communication exploser et rentrer dans le quotidien de tout un chacun. Le téléphone portable s'est vu doté petit à petit de nouvelles fonctions (GPS, appareil photo...), tendance encouragée par l'utilisation d'applications. En parallèle, une attention grandissante est portée à la santé et à l'amélioration de la qualité de vie au quotidien ; ainsi, ont commencé à fleurir un certain nombre d'applications permettant de mesurer les performances sportives, ou, plus généralement, l'activité physique quotidienne.
 
 ### Question posée
 Puisque nous devions utiliser des données personnelles, nous nous sommes demandées dans quelle mesure le rythme de vie d'un étudiant peut impacter son activité physique quotidienne, en particulier la marche (et éventuellement la course à pied). Cette activité est donnée par des mesures de distance parcourue, de durée, de vitesse...
 Nous avons donc souhaité confronter ces données à l'emploi du temps, et ajouter un élément de comparaison supplémentaire : la météo. Peut-on observer une corrélation entre ces différentes données ?
 
 ### Utilisateurs ciblés
 Nous avons ciblé un public large non expert. En effet, il nous a semblé que la quantité de données et la taille de l'échantillon d'étudiants (en l'occurence, un seul ici) étaient trop faibles pour en tirer des données quantitatives qui puissent être utiles à des spécialistes.
 
 ### Résultats
 [Screenshots et analyse brève décrite dans le Gdoc "notes"]
 
 ## Ensembles de données
 ### Données utilisées
 Ayant à notre disposition des applications pré-enregistrées sur nos smartphones, ou des montres connectées, nous avons choisi de nous pencher sur les données qu'ils pourraient nous fournir. Toutefois, après une première analyse des mesures, nous avons opté pour les données smartphone que nous avons jugées plus fiables : en effet, une montre utilise un accéléromètre pour compter le nombre de pas et ainsi extrapoler la distance, ainsi que les calories brûlées. Deux inconvénients surgissent alors :
 * Les mesures peuvent donc être aisément faussées par des mouvements de bras parasites.
 * Il n'est pas possible de distinguer la source de ces mesures (elles auraient pu être utiles si l'on pouvait différencier la marche, la danse, etc.).
 
 Le téléphone, quant à lui, semble se baser également sur les mesures GPS (il ne mesure automatiquement que les activités de marche où la cadence - et donc la vitesse - est suffisamment élevée pour la différencier des piétinements en intérieur). Il conserve cependant l'inconvénient de ne pas différencier les activités (sauf éventuellement la course si le rythme et la durée sont suffisants), et, contrairement à la montre, tend à mesurer et enregistrer moins d'activité qu'il n'en est réellement. On considère toutefois que le biais est moins fort et que les données sont dans ce cas plus lisibles : une activité relevée est réellement liée à la marche ou la course à pied, et pas d'interférences quelconques. 
 
 ### Sources des données 
  Données | Source | Fichier(s) obtenu(s) | Commentaire |
 --- | --- | --- | ---
 Activité physique | Application Samsung Health (Android v7.0) | 8 fichiers CSV (dont com.samsung.health.exercise.csv), 3 dossiers de fichiers JSON (dont les live data de com.samsung.health.exercise) | ...
 Emploi du temps | Intranet de l'école : [https://edt.ec-lyon.fr/](https://edt.ec-lyon.fr/) | 1 fichier au format `.ics` | Conversion nécessaire en `csv`
 Météo | En France : [public.opendatasoft.com/](https://public.opendatasoft.com/explore/dataset/donnees-synop-essentielles-omm/export/), à Londres : [data.urban-climate.net/](http://data.urban-climate.net/southwark_plots/#) | Dans les deux cas : plusieurs fichiers `csv` | Météo de Rennes et Lyon obtenues séparément sur le site, en plusieurs fichiers à agréger lors du traitement 

 ### Nettoyage réalisé
 
 ### Comment implémenter vos propres données dans ce code

## Enjeux
### Principaux risques liés
Les données liées à l’activité physique sont évidemment des données très personnelles qui révèlent la santé de la personne concernée. Il est aisé d’en déduire si la personne est malade ou en bonne forme et ainsi avoir une estimation de son espérance de vie ou de ses besoins de santé (médicament, aliments à éviter…). Ces données seraient donc particulièrement intéressantes pour les assureurs qui pourraient modifier leurs tarifs en fonction de l’état de santé de l’assuré. Elles peuvent aussi être convoitées pour vendre différents produits, comme des suppléments alimentaires ou des médicaments. Il faut donc faire attention lorsque l’on révèle nos données de santé.

### Enjeux éthiques
Les enjeux éthiques sont donc de protéger les données de santé générées par des applications sur portable (Samsung Health) ou des montres connectées. Ces données peuvent être très utile pour l’utilisateur et l’aider à améliorer ses habitudes sportives cependant elles peuvent être utilisées à mauvais escient.
Dans le cadre de ce projet, les données seront fournies par une personne consentante, seront utilisées pour une audience relativement restreinte et nous ferons attention à ne pas dévoiler de détails sensibles si nous en rencontrerons, comme un problème de santé particulier. 
