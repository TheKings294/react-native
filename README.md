# React Native Project

## 📋 Description

Projet React Native avec backend API PHP et base de données.

## 🏗️ Structure du Projet

```
react-native/
├── mobile-app/          # Application mobile React Native
├── backend-api/         # API Backend PHP
├── database/            # Scripts et configuration base de données
└── README.md
```

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- React Native CLI
- Expo CLI (si vous utilisez Expo)
- PHP (v7.4 ou supérieur)
- Composer
- Docker

### 1. Cloner le Repository

```bash
git clone https://github.com/TheKings294/react-native.git
cd react-native
```

### 2. Installation du Backend (API)

```bash
cd backend-api
composer install
cp .env.example .env
# Configurer les variables d'environnement dans .env
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

L'API sera accessible sur `http://localhost:8000`

### 3. Configuration de la Base de Données

```bash
cd ../database
# Importer le fichier SQL si présent
docker-compose up -d
```

Ou configurer manuellement :
- Créer une base de données
- Exécuter les migrations depuis le backend

### 4. Installation de l'Application Mobile

```bash
cd ../mobile-app
npm install
# ou
yarn install
```

## 📱 Lancer l'Application

### Pour Android

```bash
cd mobile-app
npx react-native run-android
# ou si vous utilisez Expo
npx expo start --android
```

### Pour iOS (Mac uniquement)

```bash
cd mobile-app
cd ios && pod install && cd ..
npx react-native run-ios
# ou si vous utilisez Expo
npx expo start --ios
```

### Mode Développement (Expo)

```bash
cd mobile-app
npx expo start
```

Scannez le QR code avec :
- **Android** : Application Expo Go
- **iOS** : Caméra native

## 🔧 Scripts Disponibles

### Backend

```bash
# Démarrer le serveur de développement
symfony server:start

# Exécuter les migrations
php bin/console doctrine:migrations:migrate
```

### Mobile App

```bash
# Démarrer en mode développement
npx expo start

# Build Android
npm run android

# Build iOS
npm run ios

# Nettoyer le cache
npm run clean
```

## 🔐 Variables d'Environnement

### Backend (.env)

```env
APP_ENV=dev
APP_SECRET=

DEFAULT_URI=http://localhost

###> doctrine/doctrine-bundle ###
DATABASE_URL=""
###< doctrine/doctrine-bundle ###

JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=
```

### Mobile App (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

## 🛠️ Résolution des Problèmes

### Erreur "Unable to resolve module"
```bash
cd mobile-app
npm install
npx react-native start --reset-cache
```

### Problème avec les pods iOS
```bash
cd mobile-app/ios
pod deintegrate
pod install
cd ..
```

### Erreur de connexion à l'API
- Vérifier que le backend est lancé
- Sur appareil physique, utiliser l'IP locale au lieu de localhost
- Vérifier les paramètres CORS dans le backend

## 👥 Contributeurs

- [TheKings294](https://github.com/TheKings294)

## 📄 Licence

Ce projet est sous licence [insérer type de licence].

## 📞 Support

Pour toute question ou problème, ouvrir une [issue](https://github.com/TheKings294/react-native/issues) sur GitHub.
