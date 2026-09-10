// Script pour uploader les vidéos sur Supabase Storage
// Usage: node upload-videos.js <SERVICE_ROLE_KEY>

const fs = require('fs')
const path = require('path')
const https = require('https')

const SUPABASE_URL = 'https://lhcnjulgrgsanmvvttjz.supabase.co'
const BUCKET = 'menu-tv'

const SERVICE_ROLE_KEY = process.argv[2]

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SERVICE_ROLE_KEY requis')
  console.error('Usage: node upload-videos.js <SERVICE_ROLE_KEY>')
  console.error('\nRécupérer la clé dans: https://supabase.com/dashboard/project/lhcnjulgrgsanmvvttjz/settings/api')
  process.exit(1)
}

const files = [
  'menu-republique.mp4',
  'menu-asnieres.mp4',
  'menu-odeon.mp4',
  'menu-nantes.mp4'
]

async function uploadFile(filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'videos', filename)

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Fichier non trouvé: ${filePath}`)
      resolve(false)
      return
    }

    const fileStats = fs.statSync(filePath)
    const fileStream = fs.createReadStream(filePath)

    console.log(`📤 Upload ${filename} (${(fileStats.size / 1024 / 1024).toFixed(2)} MB)...`)

    const options = {
      hostname: 'lhcnjulgrgsanmvvttjz.supabase.co',
      port: 443,
      path: `/storage/v1/object/${BUCKET}/${filename}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'video/mp4',
        'Content-Length': fileStats.size,
        'x-upsert': 'true'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ ${filename} uploadé avec succès`)
          resolve(true)
        } else {
          console.error(`❌ Erreur ${res.statusCode} pour ${filename}:`, data)
          resolve(false)
        }
      })
    })

    req.on('error', (error) => {
      console.error(`❌ Erreur réseau pour ${filename}:`, error)
      resolve(false)
    })

    fileStream.pipe(req)
  })
}

async function uploadAll() {
  console.log('🚀 Upload des vidéos sur Supabase Storage...\n')

  let success = 0
  let failed = 0

  for (const file of files) {
    const result = await uploadFile(file)
    if (result) success++
    else failed++
  }

  console.log(`\n✨ Terminé: ${success} succès, ${failed} échecs`)

  if (success > 0) {
    console.log('\n📺 URLs des vidéos:')
    files.forEach(file => {
      console.log(`   https://lhcnjulgrgsanmvvttjz.supabase.co/storage/v1/object/public/${BUCKET}/${file}`)
    })
  }
}

uploadAll()
