# @ai-native-solutions/fallestate-sdk

Programmatic access to the **FallEstate** tool catalogue — 88 sovereign tools across 9 layers, distilled into a zero-dependency ESM library.

Companion trio:
- [`fallestate-sdk`](https://github.com/sjgant80-hub/fallestate-sdk) · this repo
- [`fallestate-mcp`](https://github.com/sjgant80-hub/fallestate-mcp) · Model Context Protocol server
- [`fallestate-api`](https://github.com/sjgant80-hub/fallestate-api) · Express HTTP wrapper

## Install

```bash
npm install @ai-native-solutions/fallestate-sdk
```

## Use

```js
import fe from '@ai-native-solutions/fallestate-sdk';

fe.stats();                    // { total: 88, layers: {...}, withGithub: N }
fe.listTools();                // full catalogue
fe.getTool('FallEnterprise');  // one tool by name
fe.byLayer(6);                 // every SMB-vertical tool
fe.search('LLM');              // ranked substring search
fe.withGithub();               // only tools that ship a public repo
fe.layers();                   // { 0: 'Substrate', ... }
fe.toMarkdown('FallRouter');   // render as Markdown block
```

## Named exports

Every function is also a named export:

```js
import { search, byLayer, stats, toMarkdown } from '@ai-native-solutions/fallestate-sdk';
```

## Data shape

Each catalogue entry:

```js
{
  layer: 6,
  layerName: 'SMB Verticals',
  name: 'FallEnterprise',
  tag: 'AI-Native Transformation for SMBs. £20k-£200k. Four tiers.',
  does: '...',
  kills: '...',
  saves: '...',
  helps: '...',
  github: 'https://github.com/sjgant80-hub/fallenterprise'
}
```

## Layers

| # | Name           |
|---|----------------|
| 0 | Substrate      |
| 1 | Insight        |
| 2 | Signal         |
| 3 | Island Stack   |
| 4 | Mobile / Mesh  |
| 5 | AI Substrate   |
| 6 | SMB Verticals  |
| 7 | SDK / MCP      |
| 8 | Specialised    |

## Browser use

The catalogue lives at `src/tools.json` and can be imported directly by any bundler. In vanilla browser JS, fetch it and hand it to the SDK:

```html
<script type="module">
  import fe from 'https://esm.sh/@ai-native-solutions/fallestate-sdk';
  const tools = await (await fetch('.../tools.json')).json();
  fe.setCatalogue(tools);
  console.log(fe.search('mesh'));
</script>
```

## Playground

Open `docs/index.html` for an interactive search/browse UI. Also deployed via GitHub Pages.

## License

MIT · AI-Native Solutions
