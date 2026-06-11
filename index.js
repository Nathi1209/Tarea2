import express from 'express'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { searchSchema } from './src/schemas/search.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const mundiales = JSON.parse(
  readFileSync(join(__dirname, 'src', 'data', 'mundiales.json'), 'utf8')
)

const app = express()
const PORT = 4321

app.use('/imagenes', express.static(join(__dirname, 'public', 'imagenes')))

app.get('/', (req, res) => {
  res.json({
    nombre: 'API Copa Mundial de la FIFA',
    descripcion: 'API REST con informacion de las ediciones de la Copa Mundial.',
    version: '1.0.0',
    endpoints: {
      mundiales: '/mundiales',
      mundialPorSlug: '/mundial/:slug',
      campeonPorPais: '/campeon/:pais',
      random: '/random',
      buscar: '/search/:text',
      imagenes: '/imagenes/*'
    }
  })
})

app.get('/mundiales', (req, res) => {
  const lista = mundiales.map(m => ({
    nombre: m.nombre,
    anio: m.anio,
    sede: m.sede,
    campeon: m.campeon,
    slug: m.slug
  }))
  res.json(lista)
})

app.get('/mundial/:slug', (req, res) => {
  const mundial = mundiales.find(m => m.slug === req.params.slug)
  if (!mundial) {
    return res.status(404).json({
      error: 'Not Found',
      mensaje: `No existe un mundial con slug '${req.params.slug}'`
    })
  }
  res.json(mundial)
})

app.get('/campeon/:pais', (req, res) => {
  const pais = req.params.pais.toLowerCase()
  const slugs = mundiales
    .filter(m => m.campeon.toLowerCase() === pais)
    .map(m => m.slug)
  if (slugs.length === 0) {
    return res.status(404).json({
      error: 'Not Found',
      mensaje: `No hay mundiales ganados por '${req.params.pais}'`
    })
  }
  res.json({ pais: req.params.pais, mundiales: slugs })
})

app.get('/random', (req, res) => {
  const indice = Math.floor(Math.random() * mundiales.length)
  res.json(mundiales[indice])
})

app.get('/search/:text', (req, res) => {
  const parseo = searchSchema.safeParse({ text: req.params.text })
  if (!parseo.success) {
    return res.status(400).json({
      error: 'Bad Request',
      mensaje: parseo.error.issues.map(i => i.message).join(', ')
    })
  }
  const texto = parseo.data.text.toLowerCase()
  const resultados = mundiales.filter(m =>
    [m.nombre, m.sede, m.campeon, m.subcampeon, m.goleador, m.resumen, m.descripcion]
      .some(campo => campo.toLowerCase().includes(texto))
  )
  res.json({ texto: parseo.data.text, total: resultados.length, resultados })
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    mensaje: `Ruta ${req.method} ${req.path} no definida`
  })
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
