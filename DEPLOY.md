# Guía de despliegue — `carlosylauraboda`

App estática (Create React App) desplegada en GitHub Pages mediante GitHub Actions. Cada push a `main` despliega automáticamente.

URL final: `https://<tu-usuario>.github.io/carlosylauraboda/`
URL para invitados: `https://<tu-usuario>.github.io/carlosylauraboda/?c=CODIGO`

---

## 1. Apps Script (Google Sheet)

1. Abre la hoja con la pestaña `invitados por parejas`.
2. **Extensiones → Apps Script**.
3. Pega el script actualizado (ver `apps-script.gs` o el bloque del plan: incluye `doGet` + escritura de `Hijo 1..4`).
4. **Deploy → New deployment**:
   - Tipo: *Web app*
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Pulsa *Deploy*. Acepta los permisos (la primera vez Google avisa de "app no verificada"; *Avanzado → ir al proyecto*).
5. Copia la URL `https://script.google.com/macros/s/AK.../exec`. **Esta URL es el endpoint** que usará React.
6. Cada vez que cambies el script, ve a *Manage deployments → editar → Versión: nueva versión → Deploy* (la URL no cambia).

> **Importante**: la seguridad del formulario depende de que el `Código` sea difícil de adivinar. Usa cadenas aleatorias de al menos 8 caracteres.

---

## 2. Crear el repositorio en GitHub

```bash
# Renombrar la rama local (el workflow se dispara con 'main').
git branch -M main

# Crear el repo en GitHub (web): https://github.com/new
#   Nombre: carlosylauraboda
#   Visibilidad: Public (necesario para GitHub Pages gratuito)
#   NO inicialices con README/license

# Conectar y subir
git remote add origin git@github.com:<tu-usuario>/carlosylauraboda.git
git push -u origin main
```

## 3. Configurar GitHub Pages

1. En el repo: **Settings → Pages**.
2. En *Build and deployment → Source* selecciona **GitHub Actions**.

## 4. Añadir el secreto del endpoint

1. **Settings → Secrets and variables → Actions → New repository secret**.
2. Nombre: `REACT_APP_SHEET_ENDPOINT`
3. Valor: la URL `/exec` del paso 1.

> El valor está disponible solo durante el build de Actions. No se commitea al repo. En local usa `.env.development.local` (ya gitignored por CRA).

## 5. Probar

- Tras el primer push a `main`, ve a la pestaña **Actions** y observa el workflow `Deploy to GitHub Pages`.
- Cuando termine en verde, abre `https://<tu-usuario>.github.io/carlosylauraboda/?c=IEDLMH` (con un código real de la hoja).
- Verifica que ves los nombres correctos y que al enviar se actualizan las columnas G–K.

## 6. Desarrollo local

```bash
npm install
cp .env.production.example .env.development.local   # ya está creado en este repo
npm start
# abre http://localhost:3000/?c=IEDLMH
```

## Resolución de problemas

| Síntoma | Causa probable |
|---|---|
| `REACT_APP_SHEET_ENDPOINT no está configurado` | Falta el secret en GitHub o el `.env.development.local` en local. |
| Página en blanco bajo `/carlosylauraboda/` | Falta `"homepage": "."` en `package.json` (ya está añadido). |
| `Código no válido` con un código correcto | Apps Script no se redeployó tras editar (haz *New version* en *Manage deployments*). |
| Error CORS | Asegúrate de que el `fetch` POST envía `Content-Type: text/plain;charset=utf-8` (lo hace `src/api/sheet.js`). |
| El POST devuelve HTML/login | El deployment no está como *Anyone*. Revísalo. |
