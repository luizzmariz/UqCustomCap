# UQ Bonés — Customizador de Bonés 3D

Plataforma web da **UQ Bonés** para personalizar bonés com pré-visualização 3D
no navegador (desktop e mobile): escolher o modelo, trocar a cor de cada parte
e enviar um logo para ver aplicado em tempo real.

> **Idiomas:** Português 🇧🇷 e Inglês 🇺🇸 (seletor no topo).
> **Publicação:** GitHub Pages em `https://luizzmariz.github.io/UqCustomCap/`.

---

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

Para testar o build de produção (com o base path `/UqCustomCap/`):

```bash
npm run build
npm run preview
```

Outros scripts: `npm run typecheck`, `npm run lint`, `npm run format`.

## Stack

- **React + Vite + TypeScript**
- **three** + **@react-three/fiber** + **@react-three/drei** (renderização 3D)
- **Zustand** (estado) · **Tailwind CSS** (UI)

## Como o projeto está organizado

| Caminho | Responsabilidade |
| --- | --- |
| `src/config/capModels.ts` | ⭐ Config data-driven das partes — **fonte única da verdade**. |
| `src/store/customizerStore.ts` | Estado (cores por parte, logo, idioma). |
| `src/scene/` | Cena 3D: `CapCanvas`, `CapModel` (roteador), `PlaceholderCap`, `GltfCap`, `LogoDecal`, `SceneLighting`. |
| `src/components/` | `customizer/`, `landing/`, `ui/`. |
| `src/i18n/` | Dicionários PT/EN e `useT()`. |

O boné exibido hoje é um **placeholder procedural simples** (`PlaceholderCap`),
usado só até chegarem os modelos reais. A cena troca automaticamente para o
carregador de `.glb` (`GltfCap`) assim que um modelo real é configurado.

---

## Adicionando um modelo `.glb` real (drop-in)

1. Exporte/coloque o arquivo em `public/models/`, por exemplo
   `public/models/bone-americano.glb`.
2. Em `src/config/capModels.ts`, no modelo correspondente:
   - troque `src: 'placeholder'` por
     `` src: `${import.meta.env.BASE_URL}models/bone-americano.glb` ``
     (nunca use caminho absoluto `/models/...` — quebra sob o base path do Pages);
   - ajuste o `nodeName` de cada parte para bater com os nomes das malhas do arquivo;
   - ajuste `logoAnchor` (posição/rotação/escala do logo na frente) e `camera` se necessário.
3. Pronto — a interface se regenera a partir da config; nenhum componente muda.

### Especificação para exportar os modelos (para quem cria o `.glb`)

- Cada parte recolorível deve ser uma **malha separada e nomeada**:
  `Crown` (copa), `Brim` (aba), `Button` (botão), `Eyelets` (ilhoses),
  `Sweatband` (faixa interna).
- Formato **glTF binário (`.glb`)**, de preferência com **compressão Draco**.
- Texturas de no máximo **1024px**; alvo de **&lt; 2–3 MB** por modelo.
- Deixe a **frente da copa voltada para +Z** (para o logo cair no lugar certo).

---

## Deploy (GitHub Pages)

O deploy é automático via GitHub Actions (`.github/workflows/deploy.yml`) a cada
push na branch `main`.

Passo único de configuração no GitHub: **Settings → Pages → Source = GitHub Actions**.

Se um dia for usado um repositório dedicado `luizzmariz.github.io`, basta trocar
`base` em `vite.config.ts` de `'/UqCustomCap/'` para `'/'`.

## Roadmap

- **Fase 1 (atual):** customizador 3D funcional com placeholder, cores por parte,
  upload de logo, PT/EN, responsivo, deploy.
- **Fase 2:** conteúdo de marca/landing (imagens reais, produtos, sobre).
- **Fase 3:** modelos `.glb` reais.
- **Fase 4:** salvar/compartilhar, exportar imagem, orçamento via WhatsApp.
