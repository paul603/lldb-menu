// Script pour uploader les vidéos sur Vercel Blob
// Prérequis: npm install @vercel/blob
// Usage: BLOB_READ_WRITE_TOKEN=xxx node upload-to-vercel-blob.js

const { put } = require('@vercel/blob')
const fs = require('fs')
const path = require('path')

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN manquant')
  console.error('\nGénérer un token sur: https://vercel.com/paul603/lldb-menu/stores')
  console.error('Puis exécutez: BLOB_READ_WRITE_TOKEN=xxx node upload-to-vercel-blob.js')
  process.exit(1)
}

const files = [
  'menu-republique.mp4',
  'menu-asnieres.mp4',
  'menu-odeon.mp4',
  'menu-nantes.mp4'
]

async function uploadFile(filename) {
  const filePath = path.join(__dirname, 'videos', filename)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier non trouvé: ${filePath}`)
    return null
  }

  const fileStats = fs.statSync(filePath)
  console.log(`📤 Upload ${filename} (${(fileStats.size / 1024 / 1024).toFixed(2)} MB)...`)

  try {
    const fileBuffer = fs.readFileSync(filePath)

    const blob = await put(filename, fileBuffer, {
      access: 'public',
      token: BLOB_TOKEN,
      contentType: 'video/mp4'
    })

    console.log(`✅ ${filename} → ${blob.url}`)
    return blob.url
  } catch (error) {
    console.error(`❌ Erreur pour ${filename}:`, error.message)
    return null
  }
}

async function uploadAll() {
  console.log('🚀 Upload des vidéos sur Vercel Blob...\n')

  const urls = {}

  for (const file of files) {
    const url = await uploadFile(file)
    if (url) urls[file] = url
  }

  console.log('\n✨ URLs des vidéos:')
  console.log(JSON.stringify(urls, null, 2))

  console.log('\n📝 Mettez à jour index.html avec:')
  console.log('var BASE = "https://[votre-blob].public.blob.vercel-storage.com/";')
}

uploadAll()
