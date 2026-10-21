# 02 — Design system provisório (do mockup aprovado)

**Atenção:** tokens são uma **aproximação de design do conceito**, NÃO medidas oficiais extraídas de um manual da marca.

## Tokens visuais propostos

| Token | Valor | Uso |
|---|---|---|
| `--brand-blue` | `#0867F8` | destaque, links e estados selecionados |
| `--brand-blue-dark` | `#064BBF` | hover e foco |
| `--navy-950` | `#071322` | fundos escuros |
| `--navy-900` | `#092042` | navegação e hero |
| `--text-primary` | `#121B2A` | texto sobre branco |
| `--text-muted` | `#566377` | texto secundário |
| `--surface` | `#FFFFFF` | cards e painel |
| `--surface-soft` | `#F4F7FB` | fundos alternados |
| `--border` | `#DCE5F0` | separadores |
| `--cta-provisional` | `#FA5828` | laranja do conceito; validar se faz parte da marca |

## Tipografia

- Primária sugerida: `Inter`, `system-ui`, `Arial`, sans-serif (carregamento local/opcional); evitar fonte não licenciada ou download de fontes proprietário.
- Desktop: H1 52–62 px; H2 30–36 px; texto base 16 px; legendas 14 px.
- Mobile: H1 32–40 px; H2 26–30 px; texto base 16 px.
- Linhas: body 1.5; títulos 1.08–1.2.
- Hierarquia real em HTML; não usar imagens de texto como conteúdo principal.

## Grid e medidas

- Container: `min(1240px, 100% - 40px)` no desktop; margens laterais 16–20 px no mobile.
- Escala de espaçamento: 4, 8, 12, 16, 24, 32, 48, 64, 80 px.
- Radius: 12 px (cards), 16 px (painéis), 999 px (pílulas).
- Botão primário: altura mínima 48 px; foco com outline evidente.
- Sombras discretas. Evitar brilho artificial, muito glow, excesso de ícones.

## Tratamento de imagens

- Foto real de produto sobre fundo limpo, mesma altura aparente e sem recortes incoerentes.
- Mockup aprovado usa renders ilustrativos. No lançamento, substituir por fotos aprovadas da Central, fabricantes licenciados ou banco autorizado.
- Hero em composição 45% texto + 55% foto no desktop; fotografia não pode prejudicar legibilidade.
- Marca usada no site deve ser arte final, não reconstrução por IA.

## Estados e feedback

| Componente | Normal | Hover | Foco | Erro / vazio |
|---|---|---|---|---|
| Botão | contraste >=4.5:1 em textos | escurecimento suave | outline claro | desabilitado identificado |
| Card | borda neutra | borda azul e elevação leve | outline | texto de ausência de resultados |
| Busca | placeholder descritivo | — | borda azul | resultado vazio orientativo |
| Formulário | label explícita | — | foco visível | feedback próximo ao campo |

**Observação:** avaliar contraste com WCAG; números propostos precisam ser validados em UI real, não presumidos acessíveis por estarem no mockup.
