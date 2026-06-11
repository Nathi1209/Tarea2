import Database from 'better-sqlite3'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '..', '..', 'mundiales.db')

export const db = new Database(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS mundiales (
    slug        TEXT PRIMARY KEY,
    nombre      TEXT NOT NULL,
    anio        INTEGER NOT NULL,
    sede        TEXT NOT NULL,
    campeon     TEXT NOT NULL,
    subcampeon  TEXT NOT NULL,
    goleador    TEXT NOT NULL,
    equipos     INTEGER NOT NULL,
    imagen      TEXT NOT NULL,
    resumen     TEXT NOT NULL,
    descripcion TEXT NOT NULL
  )
`)
