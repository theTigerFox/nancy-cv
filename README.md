# NancyCV ✨ - Le Générateur de CV qui va (peut-être) Bluffer Tout le Monde !

Marre des CV moches qui finissent direct à la poubelle (numérique) ? Fatigué de lutter avec Word ou Canva pour un résultat... disons... *perfectible* ?

Bienvenue dans **NancyCV** ! L'objectif ? Créer une application web permettant de générer **LE** CV parfait : professionnel, élégant, moderne, bref, le genre de CV qui fait dire "Wow !" au recruteur avant même qu'il ait lu la première ligne. (Bon, ok, on vise haut !)

Ce projet, né d'une amitié solide (❤️ Dédicace spéciale à **Nancy**, la meilleure amie qui inspire ce projet ! Tu auras ton petit avatar !), est une application React + TypeScript + TailwindCSS.

Au début, soyons honnêtes, le résultat était... *nuuuuuul*. Mais on est en pleine mission **"Extreme Makeover: CV Edition"** pour transformer ça en pépite !

## Aperçu (Work in Progress !)

Voici un petit avant-goût de ce à quoi ça ressemble (ou ressemblera bientôt de manière encore plus bluffante !) :

![Aperçu de NancyCV](screens/1.png)
### Apercu d'un CV (expérimental)
<img src="screens/2.png" height=500px>

## Fonctionnalités Clés (Actuelles et Voulues)

*   📝 **Formulaire Intuitif & Structuré :** Saisissez vos informations personnelles, formations, expériences, compétences et langues sans vous arracher les cheveux.
*   👀 **Aperçu en Temps Réel :** Voyez votre chef-d'œuvre prendre forme instantanément à côté du formulaire. Fini les allers-retours !
*   🎨 **Design "Qui Blufte" :** Objectif : un look moderne, épuré, avec des couleurs d'accent personnalisables (fini le texte blanc sur fond blanc, promis !). On utilise des icônes pros (bye bye les emojis !).
*   ✨ **Effets Subtils & Animations :** Transitions fluides, effets de survol discrets, peut-être même quelques micro-interactions pour rendre l'expérience agréable.
*   📄 **Sections Modulaires :** Gérez facilement les différentes parties de votre CV.
*   📥 **Export PDF :** Téléchargez votre CV au format PDF, optimisé et prêt à être envoyé aux recruteurs les plus exigeants.
*   🖨️ **Impression Facile :** Une option pour imprimer directement depuis le navigateur (via CSS `@media print`).
*   💖 **Dédicace Spéciale :** Un petit clin d'œil à Nancy, caché quelque part avec son avatar stylisé !

## Stack Technique

On utilise du solide pour construire cette merveille :

*   ⚛️ **React :** Pour une interface utilisateur dynamique et composable.
*   🔷 **TypeScript :** Parce que typer c'est la vie (et ça évite les `undefined is not a function` à 3h du matin).
*   💨 **TailwindCSS :** Pour un stylisme rapide, flexible et qui permet de créer des designs modernes sans écrire 10 000 lignes de CSS.
*   ⚡ **Vite :** Pour un environnement de développement et un build qui vont plus vite que l'éclair (ou presque).
*   📄 **jsPDF & html2canvas-pro :** Le duo de choc pour transformer notre joli HTML en PDF impeccable.
*   🆔 **uuid :** Pour donner des identifiants uniques à chaque élément dynamique (parce que `Math.random()` c'est mal).
*   🦸 **Heroicons :** Pour des icônes SVG élégantes et professionnelles.

## Getting Started / Lancer le Projet

Prêt à mettre la main à la pâte ou juste à tester cette fusée en construction ?

1.  **Clonez ce magnifique dépôt :**
    ```bash
    git clone https://github.com/Tiger-Foxx/CV-creator.git
    ```

2.  **Naviguez dans le dossier :**
    ```bash
    cd CV-creator
    ```

3.  **Installez les dépendances** (le moment idéal pour un café ☕) :
    ```bash
    npm install
    # ou si vous êtes plutôt du genre 'fil'
    yarn install
    ```

4.  **Lancez le serveur de développement** (Que la magie commence !) :
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

5.  Ouvrez votre navigateur préféré à l'adresse indiquée (souvent `http://localhost:5173`).

## Contribuer

Vous avez des idées de génie pour rendre NancyCV encore plus bluffant ? Vous avez repéré un bug plus sournois qu'un recruteur fantôme ? Les contributions sont les bienvenues !

1.  Forkez le projet.
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/MaSuperIdee`).
3.  Codez votre amélioration (en essayant de garder le code aussi propre que le CV final visé !).
4.  Commitez vos changements (`git commit -m 'Ajout de MaSuperIdee'`).
5.  Pushez vers la branche (`git push origin feature/MaSuperIdee`).
6.  Ouvrez une Pull Request.

N'hésitez pas non plus à ouvrir une *issue* pour discuter d'une idée ou signaler un problème.

## Licence

Ce projet est sous licence MIT. En gros, faites-en (presque) ce que vous voulez, mais à vos risques et périls si ça explose ! 😉

---

Développé avec 💻, ☕ et une bonne dose d'optimisme par [Tiger-Foxx](https://github.com/Tiger-Foxx).

Un immense merci à **Nancy**  ✨

Alors, prêt à créer le CV qui va (enfin) impressionner ? C'est parti !