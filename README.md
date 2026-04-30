# NextRep V2 - Arquitectura Base Escalable (Web + iOS + Android)

Base técnica para una red social multiplataforma con foco en:

- mantenibilidad máxima
- escalabilidad real (MVP -> producto grande)
- separación de responsabilidades por capas
- reutilización de código entre web y mobile
- backend desacoplado de UI y proveedor

---

## 1) Recomendación de arquitectura final

Arquitectura recomendada: **Monorepo TypeScript con arquitectura feature-based + capas limpias**:

- **Apps**: `web`, `mobile`, `api` (backend separado).
- **Packages compartidos**: dominio, UI, auth, cliente API, i18n, assets, config.
- **Capas obligatorias en backend y en lógica compartida**:
  - `presentation`
  - `application`
  - `domain`
  - `infrastructure`

Decisión clave: **Supabase solo como implementación de infraestructura**, nunca como dependencia directa de dominio/aplicación.

---

## 2) Stack técnico recomendado (y por qué)

- **Monorepo**: `pnpm` + `Turborepo`
  - pipelines rápidos, caché, workspace serio para equipos grandes.
- **Lenguaje**: `TypeScript` end-to-end
  - contratos tipados compartidos entre apps y backend.
- **Web**: `Next.js (App Router)` + `React`
  - SSR/ISR, routing robusto, edge/server actions opcionales.
- **Mobile**: `Expo (React Native)` + `expo-router`
  - DX alta, builds EAS, compatibilidad iOS/Android.
- **Backend**: `NestJS` (API-first)
  - modular, testable, DI nativo, ideal para equipos múltiples.
- **DB/Auth/Storage/Reatime inicial**: `Supabase`
  - acelera MVP, pero encapsulado mediante repositorios/adapters.
- **API contracts**: `OpenAPI` (REST) + generación de cliente tipado
  - estabilidad de contratos y consumo limpio desde web/mobile.
- **Server state**: `TanStack Query`
  - cache, invalidación, retries y sincronización óptima.
- **State cliente (UI/session efímero)**: `Zustand`
  - simple, escalable y sin boilerplate excesivo.
- **Forms**: `React Hook Form`
  - rendimiento y ergonomía.
- **Validación**: `Zod`
  - schema único compartible entre cliente/backend.
- **UI cross-platform + tokens**: `Tamagui`
  - tokens + componentes compartidos web/native con theming robusto.
- **Testing**:
  - unit/integration: `Vitest`
  - backend e2e: `Jest` + `Supertest`
  - mobile/web e2e: `Detox` (mobile) + `Playwright` (web)
- **Observabilidad**:
  - errores: `Sentry`
  - métricas/logs backend: `OpenTelemetry` + collector (Grafana/Datadog compatible)

---

## 3) Estructura completa de carpetas y archivos

```txt
.
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/                     # Next App Router
│  │  │  ├─ features/
│  │  │  │  └─ feed/
│  │  │  │     ├─ presentation/
│  │  │  │     ├─ application/
│  │  │  │     └─ composition/
│  │  │  ├─ providers/
│  │  │  └─ middleware.ts
│  │  └─ package.json
│  │
│  ├─ mobile/
│  │  ├─ src/
│  │  │  ├─ app/                     # expo-router
│  │  │  ├─ features/
│  │  │  │  └─ feed/
│  │  │  │     ├─ presentation/
│  │  │  │     ├─ application/
│  │  │  │     └─ composition/
│  │  │  └─ providers/
│  │  └─ package.json
│  │
│  └─ api/
│     ├─ src/
│     │  ├─ modules/
│     │  │  └─ feed/
│     │  │     ├─ presentation/      # controllers/dto/http mappers
│     │  │     ├─ application/       # use-cases
│     │  │     ├─ domain/            # entities/value objects/contracts
│     │  │     ├─ infrastructure/    # repositories/adapters/providers
│     │  │     └─ feed.module.ts
│     │  ├─ shared/
│     │  └─ main.ts
│     └─ package.json
│
├─ packages/
│  ├─ shared/
│  │  ├─ src/
│  │  │  ├─ types/
│  │  │  ├─ constants/
│  │  │  └─ utils/
│  │  └─ package.json
│  │
│  ├─ ui/
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  ├─ primitives/
│  │  │  ├─ themes/
│  │  │  └─ tokens/
│  │  └─ package.json
│  │
│  ├─ domain/
│  │  ├─ src/
│  │  │  ├─ user/
│  │  │  ├─ feed/
│  │  │  └─ notification/
│  │  └─ package.json
│  │
│  ├─ config/
│  │  ├─ eslint/
│  │  ├─ tsconfig/
│  │  ├─ prettier/
│  │  └─ package.json
│  │
│  ├─ assets/
│  │  ├─ src/
│  │  │  ├─ icons/
│  │  │  ├─ images/
│  │  │  ├─ fonts/
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ i18n/
│  │  ├─ src/
│  │  │  ├─ locales/
│  │  │  │  ├─ en/
│  │  │  │  └─ es/
│  │  │  ├─ formatters/
│  │  │  ├─ routing/
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ auth/
│  │  ├─ src/
│  │  │  ├─ domain/
│  │  │  ├─ application/
│  │  │  ├─ infrastructure/
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  └─ api-client/
│     ├─ src/
│     │  ├─ generated/               # OpenAPI generated
│     │  ├─ adapters/
│     │  ├─ hooks/
│     │  └─ index.ts
│     └─ package.json
│
├─ infra/
│  ├─ supabase/
│  │  ├─ migrations/
│  │  ├─ seeds/
│  │  └─ policies/
│  ├─ docker/
│  └─ terraform/                     # opcional para escalar
│
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
```

---

## 4) Responsabilidad de cada carpeta

- `apps/web`: capa de presentación web + composición de features web.
- `apps/mobile`: capa de presentación mobile + composición de features mobile.
- `apps/api`: API, casos de uso, dominio de backend, integraciones externas.
- `packages/shared`: tipos puros, constantes y utilidades agnósticas.
- `packages/ui`: design system cross-platform (tokens, themes, componentes base).
- `packages/domain`: modelos y reglas de negocio transversales reutilizables.
- `packages/config`: estándares técnicos (eslint, tsconfig, prettier, etc).
- `packages/assets`: fuente única de iconos, imágenes y fuentes.
- `packages/i18n`: traducciones, formatters y helpers i18n.
- `packages/auth`: lógica de auth desacoplada de proveedor.
- `packages/api-client`: cliente API tipado + hooks de consumo.
- `infra/supabase`: infraestructura y SQL/policies del proveedor inicial.

---

## 5) Qué se comparte entre web y mobile (y qué no)

**Se comparte:**

- contratos API (`packages/api-client`, DTOs)
- dominio (`packages/domain`)
- autenticación de negocio (`packages/auth`)
- i18n (`packages/i18n`)
- assets (`packages/assets`)
- design tokens y componentes base (`packages/ui`)
- validaciones Zod reutilizables (`shared`/`domain`)

**No se comparte (o poco):**

- routing concreto por plataforma
- componentes de navegación nativos específicos
- capacidades hardware (cámara, push, biometría)
- detalles SSR/SEO solo web

---

## 6) Librerías/herramientas recomendadas por área

- routing:
  - web: `next/navigation` + App Router
  - mobile: `expo-router`
- state management (client/UI):
  - `Zustand`
- server state / fetching:
  - `TanStack Query`
  - fetcher base desde `packages/api-client`
- forms:
  - `react-hook-form`
- validation:
  - `zod` + adaptador RHF
- auth:
  - módulo propio en `packages/auth`
  - proveedor inicial: adapter Supabase en `infrastructure`
- theming:
  - `Tamagui` + tokens centralizados en `packages/ui/tokens`
- i18n:
  - `i18next` + `react-i18next`
  - en web, opcional `next-intl` para rutas localizadas de App Router
- assets:
  - paquete central `packages/assets`
- SVGs:
  - web: `@svgr/webpack`
  - mobile: `react-native-svg` + `react-native-svg-transformer`
- fonts:
  - web: `next/font`
  - mobile: `expo-font`
  - catálogo central y naming en `packages/assets/fonts`

---

## 7) Cómo organizar el backend para no volverse caótico

Backend modular por **feature** (no por tipo técnico global):

- `modules/feed`, `modules/profile`, `modules/auth`, etc.
- cada módulo contiene sus 4 capas internas.
- reglas:
  - `presentation` solo llama `application`
  - `application` depende de interfaces de `domain`
  - `infrastructure` implementa interfaces
  - `domain` no depende de frameworks ni SDK externos

Esto evita "mega-carpetas" (`controllers`, `services`, `repositories`) que escalan mal.

---

## 8) Cómo permitir trabajo paralelo de varios equipos sin conflictos

- ownership por feature/módulo (equipo feed, equipo auth, equipo profile).
- contratos API versionados y validados por CI.
- ADRs ligeros para decisiones arquitectónicas.
- monorepo + turborepo cache para pipelines rápidos.
- reglas de importación (boundary lint): cada capa importa solo lo permitido.
- releases por app usando cambiosets (si hay paquetes versionables).
- definición de "done" con tests, lint, observabilidad y docs mínimos.

---

## 9) Cómo empezar con MVP sin hipotecar escalabilidad

MVP:

- usar Supabase para auth/db/storage/realtime.
- backend `apps/api` pequeño pero con capas desde día 1.
- 3 features críticas bien hechas (auth, profile, feed).
- UI base + tokens + tema dark/light desde inicio.

No hacer al inicio:

- microservicios
- event bus complejo
- over-abstraction innecesaria

Sí hacer al inicio:

- límites de capas claros
- contratos tipados
- tests básicos por módulo

---

## 10) Migración de base simple a arquitectura grande

Camino recomendado:

1. **Fase 1 (MVP)**: Supabase adapter principal.
2. **Fase 2**: introducir repositorios de dominio por feature y cubrirlos con tests.
3. **Fase 3**: reemplazar implementación Supabase por Postgres propio/servicios internos, manteniendo interfaces.
4. **Fase 4**: separar cargas pesadas (media/feed ranking) en servicios dedicados si hace falta.

Impacto mínimo porque UI y casos de uso nunca dependen del SDK de Supabase.

---

## 11) Errores de arquitectura a evitar desde el inicio

- meter lógica de negocio en componentes React.
- acoplar auth/autorización al SDK del proveedor.
- usar carpetas genéricas globales (`utils`, `services`) sin boundaries.
- mezclar DTOs de API con entidades de dominio.
- duplicar validaciones en cada plataforma sin compartir esquemas.
- ignorar i18n/theme/assets hasta "después".
- no definir convenciones de import/lint/test desde el día 1.

---

## 12) Ejemplo real de una feature completa: `profile`

```txt
apps/api/src/modules/profile/
├─ presentation/
│  ├─ profile.controller.ts
│  ├─ dto/
│  │  ├─ update-profile.request.ts
│  │  └─ profile.response.ts
│  └─ mappers/
│     └─ profile-http.mapper.ts
├─ application/
│  ├─ use-cases/
│  │  ├─ get-profile.use-case.ts
│  │  └─ update-profile.use-case.ts
│  └─ ports/
│     └─ profile.repository.port.ts
├─ domain/
│  ├─ entities/profile.entity.ts
│  ├─ value-objects/display-name.vo.ts
│  └─ services/profile-policy.service.ts
└─ infrastructure/
   ├─ repositories/supabase-profile.repository.ts
   └─ mappers/profile-db.mapper.ts
```

```txt
apps/web/src/features/profile/
├─ presentation/
│  ├─ screens/profile-screen.tsx
│  └─ components/profile-form.tsx
├─ application/
│  ├─ hooks/use-profile.ts
│  └─ hooks/use-update-profile.ts
└─ composition/profile.providers.tsx
```

Flujo de datos:

1. Pantalla llama `use-update-profile` (application web/mobile).
2. Hook usa `api-client` y valida con `zod`.
3. API controller transforma DTO -> comando de caso de uso.
4. Use case ejecuta reglas de dominio y llama `ProfileRepositoryPort`.
5. Adapter Supabase implementa el port y persiste datos.
6. Respuesta vuelve mapeada a DTO para cliente.

---

## Capas: qué va en cada una

- **presentation**
  - UI, controllers, DTOs HTTP, serialización/deserialización, navegación.
- **application**
  - casos de uso, orquestación, puertos/interfaces, políticas de aplicación.
- **domain**
  - entidades, value objects, invariantes, reglas puras de negocio.
- **infrastructure**
  - acceso a DB, SDKs externos (Supabase), colas, storage, adapters.

Regla de oro: dependencias siempre hacia adentro (presentation -> application -> domain). Infrastructure implementa contratos definidos en domain/application.

---

## Supabase desacoplado correctamente

- crear interfaces de repositorio (`UserRepository`, `SessionRepository`, etc).
- implementar adapters Supabase en `infrastructure`.
- prohibir import directo de `@supabase/supabase-js` fuera de infraestructura.
- centralizar políticas RLS, migraciones y scripts en `infra/supabase`.
- autenticar en backend; frontend consume API del backend (BFF/API-first), no lógica crítica directa contra Supabase.

---

## Estrategia de estilos, tokens y temas (dark/light)

- tokens únicos en `packages/ui/src/tokens`:
  - color, spacing, typography, radius, shadow, z-index.
- themes en `packages/ui/src/themes`:
  - `light`, `dark`.
- componentes base (`Button`, `Text`, `Card`, `Avatar`) en `packages/ui/src/primitives`.
- componentes de negocio viven en cada feature (no en ui base).

Tema único para web/mobile: mismo token source y adaptadores de plataforma.

---

## Internacionalización desde el diseño inicial

- `packages/i18n/src/locales/{en,es,...}` por namespace de feature (`auth.json`, `feed.json`).
- claves estables (`profile.edit.save`).
- formatters centralizados para fechas, números y moneda por locale.
- rutas localizadas:
  - web con prefijo locale (`/es/profile`, `/en/profile`)
  - mobile con locale en estado global + detector de dispositivo.

---

## Assets, iconografía y tipografía (estrategia)

- `packages/assets/src/icons`: SVG source-of-truth.
- pipeline para generar:
  - componente React (web via SVGR)
  - componente RN (react-native-svg).
- `packages/assets/src/fonts`: tipografías versionadas con naming consistente.
- `packages/assets/src/images`: imágenes optimizadas, variantes por densidad.
- `index.ts` exporta catálogo tipado para uso consistente.

---

## Checklist de inicio del proyecto (práctico)

1. Inicializar monorepo con `pnpm` + `turbo`.
2. Crear `apps/web`, `apps/mobile`, `apps/api`.
3. Crear packages base (`ui`, `domain`, `api-client`, `auth`, `i18n`, `assets`, `config`).
4. Implementar feature vertical mínima `auth`.
5. Configurar CI: lint + typecheck + tests.
6. Añadir observabilidad (Sentry + trazas backend).
7. Documentar ADR-001 (arquitectura de capas + boundaries).

---

## Nota final de enfoque

Esta base evita sobreingeniería, pero deja preparadas las decisiones que más cuestan cambiar tarde: límites de capas, contratos API, design system, i18n, assets y desacoplo de proveedor.
#   N e x t R e p V 2  
 