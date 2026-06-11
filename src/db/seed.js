import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { db } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const JSON_PATH = join(__dirname, '..', 'data', 'mundiales.json')

const mundiales = JSON.parse(readFileSync(JSON_PATH, 'utf8'))

db.exec('DELETE FROM mundiales')

const insert = db.prepare(`
  INSERT INTO mundiales
    (slug, nombre, anio, sede, campeon, subcampeon, goleador, equipos, imagen, resumen, descripcion)
  VALUES
    (@slug, @nombre, @anio, @sede, @campeon, @subcampeon, @goleador, @equipos, @imagen, @resumen, @descripcion)
`)

const insertarTodos = db.transaction(filas => {
  for (const fila of filas) insert.run(fila)
})

insertarTodos(mundiales)

console.log(`Insertados ${mundiales.length} mundiales en la base de datos.`)
