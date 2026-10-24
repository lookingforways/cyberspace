# cyberspace

Sitio web educativo de ciberseguridad creado con [v0](https://v0.app) y Next.js 16 (React 19, Tailwind CSS 4).

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Despliegue en Enhance

Sitio **100 % estático** (Next.js con `output: 'export'` y `trailingSlash: true`), publicado en `cyberspace.aulaciber.top` mediante *Desplegar desde GitHub*. No necesita ningún proceso Node en ejecución.

| Ajuste | Valor |
| --- | --- |
| Script de compilación | `npx --yes pnpm@12.3.4 install --frozen-lockfile && npx pnpm@12.3.4 build` |
| Directorio de publicación | `out` |
| Runtime | Ninguno |
| Variables de entorno | ninguna |

Requisitos del entorno de compilación: Node.js 20.9 o superior (Next.js 16). Cada ruta se genera como `<ruta>/index.html` dentro de `out/`.

## Autor

**Jesús Sanabria** — Estudiante de ciberseguridad en FUSALMO. Autor original de cyberspace.

- GitHub: [github.com/jess300605](https://github.com/jess300605)
- Proyecto original: [github.com/jess300605/cyberspace](https://github.com/jess300605/cyberspace)

Esta copia se adapta como sitio estático para el curso de Ciberseguridad de FUSALMO (aulaciber.top). Si reutilizas o modificas el proyecto, mantén la atribución al autor original.
