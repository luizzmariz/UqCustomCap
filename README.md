# UQ Bonés — Customizador de Bonés (Vetores/SVG)

Plataforma web da **UQ Bonés** para personalizar bonés com pré-visualização em
**vetores (SVG)** no navegador (desktop e mobile): escolher o modelo, alternar
entre as vistas (frente/lado/trás), trocar a cor de cada parte e enviar um logo
aplicado na frente — tudo em tempo real.

> **Idiomas:** Português 🇧🇷 e Inglês 🇺🇸 (seletor no topo).
> **Publicação:** GitHub Pages (branch `gh-pages`) em `https://luizzmariz.github.io/UqCustomCap/`.

---

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

Build de produção (base path `/UqCustomCap/`): `npm run build && npm run preview`.
Outros scripts: `npm run typecheck`, `npm run lint`, `npm run format`.

## Stack

- **React + Vite + TypeScript**
- **Zustand** (estado) · **Tailwind CSS** (UI)
- Os bonés são **SVGs** renderizados inline; cada parte é colorida via variáveis CSS.

## Como funciona a coloração por parte

Os 3 modelos (Americano, Baseball, Trucker) têm 3 vistas cada (frente, lado,
trás) — 9 SVGs em `src/caps/`. Esses SVGs são **desenhos técnicos**; um passo de
pré-processamento (`tools/tag-caps.mjs`) classifica cada forma preenchida pela
sua posição geométrica e adiciona `data-part="crown|brim|button|mesh"`, além de
um bloco de estilo que liga cada parte a uma variável CSS
(`--c-crown`, `--c-brim`, `--c-button`, `--c-mesh`).

Em runtime, `src/cap/CapView.tsx` inclui o SVG e define essas variáveis a partir
do estado (`src/store/customizerStore.ts`). O logo é sobreposto como `<img>`
posicionado em porcentagem sobre o painel frontal (`logoAnchor` em
`src/config/caps.ts`).

| Caminho | Responsabilidade |
| --- | --- |
| `src/config/caps.ts` | Modelos, vistas, partes e âncora do logo. |
| `src/caps/*.svg` + `src/caps/index.ts` | SVGs marcados e seu carregamento. |
| `src/cap/CapView.tsx` | Renderiza o SVG + cores por variável CSS + logo. |
| `src/store/customizerStore.ts` | Estado (cores, modelo, vista, logo, idioma). |
| `tools/tag-caps.mjs` | Pré-processador que marca as partes (roda com `playwright-core`). |

### Reprocessar / adicionar SVGs

Os SVGs de origem (do Illustrator) ficam em `tools/caps-source/`. Para regerar os
marcados, ajuste `tools/tag-caps.mjs` se necessário e rode-o com um navegador
headless (via `playwright-core`), gerando os arquivos em `src/caps/`. A
classificação usa bounding-boxes: copa (região superior), aba (inferior), botão
(topo), tela (Trucker — laterais/traseira).

## Deploy (GitHub Pages)

O site é publicado a partir do branch **`gh-pages`** (Settings → Pages → Source =
*Deploy from a branch* → `gh-pages` / root). Para atualizar, rode `npm run build`
e publique o conteúdo de `dist/` no branch `gh-pages`.

## Roadmap

- **Feito:** customizador em vetores — 3 modelos × 3 vistas, cor por parte,
  upload de logo (frente), PT/EN, responsivo.
- **Próximo:** arrastar/redimensionar o logo direto no boné, salvar/compartilhar
  configuração por link, exportar imagem, e orçamento via WhatsApp.
