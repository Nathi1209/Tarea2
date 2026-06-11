# Tarea 2 - API REST Copa Mundial de la FIFA

API REST construida con Node.js, Express, SQLite (better-sqlite3) y Zod para validacion.
Expone informacion sobre las distintas ediciones de la Copa Mundial de la FIFA.

## Requisitos

- Node.js 20 o superior
- npm

## Instalacion

```bash
npm install
```

## Poblar la base de datos

```bash
npm run seed
```

Esto crea el archivo `mundiales.db` con los datos de las ediciones del Mundial.

## Ejecutar el servidor

```bash
npm start
```

O en modo desarrollo (con recarga automatica):

```bash
npm run dev
```

El servidor corre en `http://localhost:4321`.

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/` | Informacion del API |
| GET | `/mundiales` | Lista de mundiales (resumen). `?include=full` devuelve todos los campos |
| GET | `/mundial/:slug` | Detalle de un mundial por slug |
| GET | `/campeon/:pais` | Slugs de las ediciones ganadas por un pais |
| GET | `/random` | Mundial al azar |
| GET | `/search/:text` | Busqueda por texto (minimo 3 caracteres) |
| GET | `/imagenes/*` | Imagenes de los mundiales |

## Codigos de respuesta

- `200 OK` - peticion exitosa
- `400 Bad Request` - validacion Zod fallida
- `404 Not Found` - recurso o ruta no encontrada

## Pruebas con xh / httpie

```bash
xh GET :4321/mundiales
xh GET :4321/mundiales include==full
xh GET :4321/mundial/qatar-2022
xh GET :4321/mundial/inexistente
xh GET :4321/campeon/Argentina
xh GET :4321/random
xh GET :4321/search/final
xh GET :4321/search/ab
```
