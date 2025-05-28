# DailyLama Discord Bot

## Description
Bot Discord structuré en JavaScript avec une base de données MySQL.

## Structure du projet

- `src/` : Code source du bot
  - `index.js` : Point d'entrée
  - `config/` : Configuration (connexion BDD, variables d'environnement)
  - `commands/` : Commandes du bot
  - `events/` : Gestionnaires d'événements Discord
  - `database/` : Fonctions liées à la BDD
- `.env` : Variables d'environnement (token, infos BDD)

## Installation

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Copier le fichier `.env.example` en `.env` et remplir les valeurs.
3. Lancer le bot :
   ```bash
   npm start
   ``` 