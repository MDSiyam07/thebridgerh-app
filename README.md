# TheBridgeRH – Mini application de gestion de candidatures

## Objectif

Ce projet a été réalisé dans le cadre d’un exercice technique visant à développer une application web de gestion de candidatures techniques, avec un formulaire côté candidat et un tableau de bord côté RH.

## Choix techniques

### Pourquoi Next.js ?

J’ai choisi **Next.js** pour les raisons suivantes :

- **Basé sur React**, il respecte la stack suggérée dans l’énoncé.
- Il permet de gérer à la fois le **frontend et le backend** dans un seul projet grâce aux **API Routes**.
- Il simplifie le **routing**, la **gestion des formulaires**, et le **déploiement** (notamment sur Vercel).
- Il offre une structure claire et évolutive, idéale pour un projet qui pourrait être enrichi (authentification, base de données, notifications, etc.).

Ce choix me permet de livrer une application **fonctionnelle, maintenable et facilement déployable**, tout en respectant les fonctionnalités demandées.

## Fonctionnalités implémentées

- Formulaire de soumission de candidature (Prénom, Nom, Email, LinkedIn, CV, Compétences, Poste)
- Tableau de bord RH avec :
  - Liste des candidatures
  - Filtres et tri
  - Modification du statut
  - Ajout de commentaires
- Notifications en console lors d’une nouvelle candidature (bonus)

## Stack utilisée

- **Framework** : Next.js (React)
- **Stockage** : Cloudinary pour les fichiers CV, Neon pour les candidats couplé à Prisma ORM
- **Style** : Tailwind CSS (ou autre, selon choix)
- **Déploiement** : Vercel

## Lancer le projet

```bash
npm install
npm run dev
