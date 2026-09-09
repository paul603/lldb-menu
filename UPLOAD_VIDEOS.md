# Upload des vidéos sur Supabase Storage

Les vidéos sont trop volumineuses (~400MB) pour être incluses dans Git/Vercel.
Elles doivent être uploadées sur Supabase Storage (projet "Fidelite LLDB").

## Bucket Supabase
- Projet: `lhcnjulgrgsanmvvttjz` (Fidelite LLDB)
- Bucket: `menu-tv` (public)
- URL de base: `https://lhcnjulgrgsanmvvttjz.supabase.co/storage/v1/object/public/menu-tv/`

## Fichiers à uploader

Les vidéos se trouvent dans `C:\Users\33661\lldb-menu\videos\`:

1. **menu-republique.mp4** (69MB) - Portrait
   - Source: `C:\Users\33661\Downloads\MENU 2026 (1).mp4`
   - Pour: République (orientation portrait)

2. **menu-asnieres.mp4** (83MB) - Paysage
   - Source: `C:\Users\33661\Downloads\Copie de MENU 2026 (2).mp4`
   - Pour: Asnières (orientation paysage)

3. **menu-odeon.mp4** (83MB) - Paysage
   - Source: `C:\Users\33661\Downloads\Copie de MENU 2026 (2).mp4`
   - Pour: Odéon (orientation paysage)

4. **menu-nantes.mp4** (83MB) - Paysage
   - Source: `C:\Users\33661\Downloads\Copie de MENU 2026 (2).mp4`
   - Pour: Nantes (orientation paysage)

## Méthode 1: Upload manuel via le dashboard Supabase

1. Aller sur https://supabase.com/dashboard/project/lhcnjulgrgsanmvvttjz
2. Aller dans Storage → menu-tv
3. Uploader les 4 fichiers .mp4 depuis `C:\Users\33661\lldb-menu\videos\`
4. S'assurer que les fichiers sont publics (le bucket est déjà public)

## Méthode 2: Upload avec Supabase CLI

```bash
# Installer Supabase CLI (si pas déjà fait)
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
cd C:\Users\33661\lldb-menu
supabase link --project-ref lhcnjulgrgsanmvvttjz

# Uploader les vidéos
supabase storage upload menu-tv videos/menu-republique.mp4
supabase storage upload menu-tv videos/menu-asnieres.mp4
supabase storage upload menu-tv videos/menu-odeon.mp4
supabase storage upload menu-tv videos/menu-nantes.mp4
```

## Méthode 3: Upload avec script Node.js

Créer un fichier `upload.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://lhcnjulgrgsanmvvttjz.supabase.co',
  'YOUR_SERVICE_ROLE_KEY' // À récupérer dans Settings → API
)

const files = [
  'menu-republique.mp4',
  'menu-asnieres.mp4',
  'menu-odeon.mp4',
  'menu-nantes.mp4'
]

async function uploadVideos() {
  for (const file of files) {
    const filePath = path.join(__dirname, 'videos', file)
    const fileBuffer = fs.readFileSync(filePath)

    console.log(`Uploading ${file}...`)
    const { data, error } = await supabase.storage
      .from('menu-tv')
      .upload(file, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (error) {
      console.error(`Error uploading ${file}:`, error)
    } else {
      console.log(`✓ ${file} uploaded successfully`)
    }
  }
}

uploadVideos()
```

Puis exécuter:
```bash
npm install @supabase/supabase-js
node upload.js
```

## Vérification

Une fois uploadé, vérifier que les URL fonctionnent :
- https://lhcnjulgrgsanmvvttjz.supabase.co/storage/v1/object/public/menu-tv/menu-republique.mp4
- https://lhcnjulgrgsanmvvttjz.supabase.co/storage/v1/object/public/menu-tv/menu-asnieres.mp4
- https://lhcnjulgrgsanmvvttjz.supabase.co/storage/v1/object/public/menu-tv/menu-odeon.mp4
- https://lhcnjulgrgsanmvvttjz.supabase.co/storage/v1/object/public/menu-tv/menu-nantes.mp4
