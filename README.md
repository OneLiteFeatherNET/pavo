# Pavo

Pavo is OneLiteFeather's Material 3 library for Nuxt 4 and Vue 3. It ships the design tokens (colour roles from one
seed, Tailwind v4 theme), a set of components prefixed `M3` (`M3Button`, `M3AppFrame`, ...), composables for theme,
snackbar and media queries, and German and English built-in texts.

Pavo is published as `@onelitefeathernet/pavo` on GitHub Packages.

## Install

Pavo is public, but GitHub Packages requires a token with `read:packages` even to download it. Add an `.npmrc` to the
project:

```ini
@onelitefeathernet:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Then install the package:

```sh
pnpm add @onelitefeathernet/pavo tailwindcss @tailwindcss/vite
```

Register the module in `nuxt.config.ts`. Tailwind is wired through `@tailwindcss/vite`:

```ts
export default defineNuxtConfig({
  modules: ['@onelitefeathernet/pavo'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
})
```

The module registers the `M3` components and the composables with auto-imports. With `fonts: true` (the default)
it adds the Roboto weights 400, 500 and 700 to the app styles.

## Styles

`app/assets/css/main.css` must import Tailwind first and Pavo second, so Pavo's base layer and utilities come after
Tailwind's:

```css
@import "tailwindcss";
@import "@onelitefeathernet/pavo/css";
```

### Custom seed colour

The default seed is OLF blue `#114cc8`. For another brand colour, generate the tokens once and import the theme
instead of `/css`:

```sh
pnpm exec pavo-tokens --seed '#ff6600' --out app/assets/css/pavo-tokens.css
```

```css
@import "tailwindcss";
@import "@onelitefeathernet/pavo/css/theme";
@import "./pavo-tokens.css";
```

## Plain Vue

Outside Nuxt, import from the plain-Vue entry. It only depends on `vue` and needs no `#imports`:

```ts
import { useColorTheme, useSnackbar } from '@onelitefeathernet/pavo/vue'
```

Import the CSS the same way as above (`@onelitefeathernet/pavo/css`). Your bundler must handle `.vue` files from the
package, because the entry re-exports the components as single-file components.

## Development

```sh
pnpm install
pnpm dev:prepare   # stubs the module and generates the playground types
pnpm dev           # playground on http://localhost:3000
pnpm tokens        # regenerates src/runtime/css/tokens.css after changing the generator
pnpm test
```

## CI and Docker

- **GitHub Actions:** a job that installs a Pavo release needs `permissions: packages: read` and the `GITHUB_TOKEN`
  passed as `NODE_AUTH_TOKEN`, with `registry-url: https://npm.pkg.github.com` and `scope: '@onelitefeathernet'`
  on `actions/setup-node`.
- **Docker:** do not copy the token into an image layer. Pass the `.npmrc` as a BuildKit secret:

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc pnpm install --frozen-lockfile
```

```sh
docker build --secret id=npmrc,src=$HOME/.npmrc -t my-app .
```

## Release

Releases are cut by release-please from Conventional Commits on `main`. A merged release is published to GitHub
Packages by the `publish` job of `.github/workflows/release-please.yml`.

## License

Apache-2.0
