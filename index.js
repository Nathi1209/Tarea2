import express from 'express'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { db } from './src/db/db.js'
import { searchSchema } from './src/schemas/search.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = 4321

app.use('/imagenes', express.static(join(__dirname, 'public', 'imagenes')))

const selectResumen = db.prepare('SELECT nombre, anio, sede, campeon, slug FROM mundiales ORDER BY anio DESC')
const selectTodos = db.prepare('SELECT * FROM mundiales ORDER BY anio DESC')
const selectPorSlug = db.prepare('SELECT * FROM mundiales WHERE slug = ?')
const selectSlugsPorCampeon = db.prepare('SELECT slug FROM mundiales WHERE LOWER(campeon) = LOWER(?)')
const selectRandom = db.prepare('SELECT * FROM mundiales ORDER BY RANDOM() LIMIT 1')
const buscarTexto = db.prepare(`
  SELECT * FROM mundiales
  WHERE LOWER(nombre)      LIKE '%' || LOWER(?) || '%'
     OR LOWER(sede)        LIKE '%' || LOWER(?) || '%'
     OR LOWER(campeon)     LIKE '%' || LOWER(?) || '%'
     OR LOWER(subcampeon)  LIKE '%' || LOWER(?) || '%'
     OR LOWER(goleador)    LIKE '%' || LOWER(?) || '%'
     OR LOWER(resumen)     LIKE '%' || LOWER(?) || '%'
     OR LOWER(descripcion) LIKE '%' || LOWER(?) || '%'
  ORDER BY anio DESC
`)

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
  if (req.query.include === 'full') {
    return res.json(selectTodos.all())
  }
  res.json(selectResumen.all())
})

app.get('/mundial/:slug', (req, res) => {
  const mundial = selectPorSlug.get(req.params.slug)
  if (!mundial) {
    return res.status(404).json({
      error: 'Not Found',
      mensaje: `No existe un mundial con slug '${req.params.slug}'`
    })
  }
  res.json(mundial)
})

app.get('/campeon/:pais', (req, res) => {
  const filas = selectSlugsPorCampeon.all(req.params.pais)
  if (filas.length === 0) {
    return res.status(404).json({
      error: 'Not Found',
      mensaje: `No hay mundiales ganados por '${req.params.pais}'`
    })
  }
  res.json({ pais: req.params.pais, mundiales: filas.map(f => f.slug) })
})

app.get('/random', (req, res) => {
  res.json(selectRandom.get())
})

app.get('/search/:text', (req, res) => {
  const parseo = searchSchema.safeParse({ text: req.params.text })
  if (!parseo.success) {
    return res.status(400).json({
      error: 'Bad Request',
      mensaje: parseo.error.issues.map(i => i.message).join(', ')
    })
  }
  const t = parseo.data.text
  const resultados = buscarTexto.all(t, t, t, t, t, t, t)
  res.json({ texto: t, total: resultados.length, resultados })
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
