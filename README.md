# Bunker Force Bello — Tienda Táctica

E-commerce de ropa y equipamiento táctico construido con Next.js 16 App Router y Supabase.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Base de datos | Supabase (PostgreSQL) |
| Tipografía | Barlow Condensed + DM Sans |
| Deploy | Vercel |

---

## Requisitos previos

- **Node.js** v20 o superior
- **npm** v10 o superior
- Acceso al proyecto en [Supabase](https://supabase.com) — pídele las credenciales a Daniel
- Acceso al repositorio en GitHub

---

## Instalación local

### 1. Clonar el repositorio y pararse en la rama de desarrollo

```bash
git clone https://github.com/daniellelooo/bunker-force.git
cd bunker-force
git checkout develop
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido (pídele los valores a Daniel):

```env
ADMIN_PASSWORD=
ADMIN_SECRET_TOKEN=
NEXT_PUBLIC_WHATSAPP_NUMBER=

# Supabase
SUPABASE_URL=https://mukdypbfefzbhtfqzbei.supabase.co
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> `.env.local` está en `.gitignore` — **nunca lo subas al repositorio**.

### 4. Correr el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Configuración de Supabase

El proyecto usa Supabase como base de datos. Las tablas ya están creadas y los datos sembrados. Solo necesitas las credenciales.

### Dónde encontrar las claves

1. Ve a [supabase.com](https://supabase.com) e inicia sesión con la cuenta del proyecto
2. Selecciona el proyecto **bunker-force-bello**
3. Ve a **Settings → API**
4. Copia:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Tablas existentes

| Tabla | Descripción |
|---|---|
| `products` | Catálogo de productos (columnas en snake_case) |
| `orders` | Pedidos realizados por clientes |

### Clientes Supabase en el código

```
lib/supabase.ts
├── supabase      → cliente anon (lectura pública de productos)
└── supabaseAdmin → cliente service_role (operaciones admin, pedidos)
```

---

## Flujo de trabajo con Git

> **Regla principal: nunca trabajes directamente en `master`.**

### Ramas

| Rama | Uso |
|---|---|
| `master` | Producción — solo recibe merges desde `develop` vía PR |
| `develop` | Rama principal de desarrollo — trabaja aquí |
| `feature/nombre` | Ramas para features nuevas, se mergean a `develop` |

### Flujo estándar

```bash
# 1. Asegúrate de estar en develop y actualizado
git checkout develop
git pull origin develop

# 2. Crea una rama para tu feature
git checkout -b feature/nombre-de-la-feature

# 3. Trabaja, haz commits
git add .
git commit -m "feat: descripción del cambio"

# 4. Sube tu rama
git push origin feature/nombre-de-la-feature

# 5. Abre un Pull Request en GitHub hacia develop
# 6. Otro miembro revisa y aprueba
# 7. Se hace merge a develop
```

### Formato de commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
style:    cambios de estilos/UI
refactor: cambio de código sin nueva funcionalidad
chore:    mantenimiento (dependencias, configs)
```

---

## Estructura del proyecto

```
bunker-force-bello/
├── app/
│   ├── api/                  # API routes (Next.js server)
│   │   ├── orders/           # POST pedido desde checkout
│   │   ├── products/         # GET productos (búsqueda)
│   │   └── admin/            # Endpoints del panel admin
│   ├── admin/                # Panel de administración
│   ├── catalog/              # Catálogo con filtros
│   ├── product/[slug]/       # Página de producto
│   ├── checkout/             # Flujo de compra
│   └── globals.css           # Tokens de color y tipografía
├── components/
│   ├── layout/               # Header, Footer, Nav, Search
│   ├── home/                 # Secciones de la home
│   ├── catalog/              # Grid y filtros del catálogo
│   ├── product/              # Galería, tallas, carrito
│   ├── cart/                 # Vista del carrito
│   ├── admin/                # Formularios del panel admin
│   └── ui/                   # Componentes reutilizables
├── lib/
│   ├── supabase.ts           # Clientes de Supabase
│   ├── products.ts           # Funciones async para productos
│   ├── types.ts              # Tipos TypeScript del dominio
│   └── validation.ts         # Validaciones de API
├── public/
│   └── logo.png              # Logo de Bunker Force
└── data/
    └── products.json         # Backup local (ya migrado a Supabase)
```

---

## Panel de administración

Accede en `/admin/login`. Las credenciales están en `.env.local` (`ADMIN_PASSWORD`).

Funcionalidades:
- Ver, crear, editar y eliminar productos
- Ver y gestionar pedidos
- Subir imágenes de productos

---

## Deploy en Vercel

El deploy es automático al hacer push a `master`. Antes de mergear a `master`, asegúrate de que las variables de entorno estén configuradas en el dashboard de Vercel:

**Vercel → proyecto → Settings → Environment Variables**

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
ADMIN_SECRET_TOKEN
NEXT_PUBLIC_WHATSAPP_NUMBER
```

---

## Contacto

Para acceso a Supabase, Vercel o cualquier duda del proyecto, contacta a **Daniel** (owner del repositorio).
