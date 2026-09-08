# Houssine Belbaz — Portfolio

Portfolio personnel premium, responsive et multilingue (français, anglais et arabe) construit avec React 18, Vite, TypeScript, Tailwind CSS, Framer Motion et react-i18next.

## Lancer le projet

```bash
npm install
npm run dev
```

Vite affiche ensuite l’adresse locale du site, généralement `http://localhost:5173`.

## Construire la version de production

```bash
npm run build
npm run preview
```

Le dossier `dist/` généré peut être déployé sur Vercel, Netlify ou GitHub Pages. La base Vite est relative (`./`) pour fonctionner également dans un sous-dossier GitHub Pages.

## Modifier le contenu et les traductions

Tous les textes sont centralisés ici :

- `src/locales/fr.json`
- `src/locales/en.json`
- `src/locales/ar.json`

Conservez les mêmes clés dans les trois fichiers. Le passage à l’arabe applique automatiquement `dir="rtl"` à tout le document.

## CV

Les fichiers téléchargeables se trouvent dans `public/cv/`. Le site utilise la version française en FR et la version anglaise en EN/AR.

## Formulaire de contact

Le formulaire utilise FormSubmit et envoie les messages vers `belbaz.houssine@gmail.com`. Lors du premier envoi, FormSubmit adresse un e-mail d’activation à cette boîte. Il faut cliquer sur le lien reçu une seule fois pour activer les envois.

## Commandes

- `npm run dev` : serveur de développement
- `npm run build` : vérification TypeScript et build optimisé
- `npm run lint` : analyse ESLint
- `npm run preview` : aperçu local de la version de production
