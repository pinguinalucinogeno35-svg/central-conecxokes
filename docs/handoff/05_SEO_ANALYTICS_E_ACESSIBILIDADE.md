# 05 — SEO, instrumentação, performance e acessibilidade

## SEO local (conferir antes de publicar)

- `title`: `Tubos e Conexões Hidráulicas em Ilhéus | Central das Conexões`.
- `meta description`: texto real com segmento e localização; **não incluir** promessas não confirmadas.
- Página com H1 único, H2 semânticos e linguagem natural.
- Links internos de navegação para categorias reais e âncoras de contato.
- Slugs de futuras categorias com palavras compreensíveis (`/categorias/tubos`).
- JSON-LD `HardwareStore` / `Store` apenas após confirmar endereço, telefone e horários; dados estruturados precisam coincidir com a página.
- `sitemap.xml`, `robots.txt`, `canonical` só depois de domínio definido.
- Alt descritivo e não promocional em fotos reais.
- Integração de Google Business Profile como item operacional, não obrigação automática de publicação do site.

## Eventos recomendados (sem PII)

| Evento | Contexto | Parâmetros sem dados pessoais |
|---|---|---|
| `category_view` | usuário seleciona categoria | `category_slug`, `source_section` |
| `quote_open` | abre lista de orçamento | `origin` |
| `quote_item_added` | adiciona item | `category_slug` |
| `quote_copy` | copia mensagem | `item_count` |
| `quote_whatsapp_click` | abre WhatsApp (quando habilitado) | `item_count`, `origin` |
| `search_use` | pesquisa categorias | apenas `result_count` (não registrar texto digitado sem política) |

Proibido enviar nome, telefone, conteúdo do orçamento, bairro ou descrição livre em eventos de marketing.

## Acessibilidade e qualidade

- WCAG 2.2 AA como objetivo de homologação.
- Rótulos vinculados aos inputs; navegação apenas por teclado, foco visível.
- Escapes no HTML ao exibir campos digitados; nunca usar `innerHTML` para dados do usuário sem sanitização (starter usa DOM/textContent para lista e `value` em textarea).
- Menus e modal com `aria-expanded` / `<dialog>`; testar com leitor de tela.
- Botões e links com nomes acessíveis claros.
- Campos touch com alvo de pelo menos 44×44 CSS pixels sempre que possível.
- Respeitar `prefers-reduced-motion`.
- Contraste mínimo do texto verificado em ferramenta; design não é prova de conformidade.

## Performance

- Meta: LCP <= 2,5 s; INP <= 200 ms; CLS <= 0,1 (medidos no campo quando houver tráfego suficiente).
- Imagens WebP/AVIF com dimensões e tamanhos responsivos; lazy load abaixo da dobra.
- Evitar scripts e fontes externas sem necessidade; preservar layout durante carregamento.
- Evitar fotos decorativas muito pesadas no mobile.
- Validar com Lighthouse e aparelhos de baixo desempenho; não confundir resultado local com garantia de campo.

## Segurança e privacidade

- HTTPS em produção, configurações por ambiente, CSP coerente com recursos usados.
- Se houver backend de leads, proteção contra spam/rate limit, retenção mínima e política LGPD.
- Sem armazenamento de PII em `localStorage` por padrão. O starter persiste apenas itens ilustrativos, sem nome/telefone.
- Abrir WhatsApp em nova aba com `noopener,noreferrer`; somente após validação do número comercial.
