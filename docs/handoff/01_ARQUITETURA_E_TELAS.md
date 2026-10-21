# 01 — Arquitetura de informação e especificação de telas

## Objetivo do produto

Converter a presença digital da Central das Conexões em **descoberta de materiais hidráulicos + solicitação organizada de orçamento**. O mockup aprovado é guia de composição, não contrato de funcionalidades inexistentes.

## Mapa V1

```text
Home /
├── Cabeçalho (logo, busca, categorias, Solicitar orçamento)
├── Hero (posicionamento + produtos genéricos)
├── Categorias (6 blocos, filtráveis)
├── Vantagens verificáveis / informação de atendimento
├── Como solicitar orçamento (3 passos)
├── Lista de orçamento (painel/modal)
├── Localização e contato (dados a validar)
└── Rodapé
```

Rotas futuras opcionais (NÃO contratadas): `/categorias/:slug`, `/produto/:slug`, `/sobre`, `/privacidade`, `/contato`, `/politica-de-entrega`.

## Tela desktop — referência principal

**Largura de referência:** 1440 px; conteúdo `max-width` 1240 px; grid horizontal fluida. Nunca desenhar em pixels fixos dependentes do PNG do mockup.

| ID | Bloco | Conteúdo | Comportamento/critério |
|---|---|---|---|
| H01 | Header | Recorte provisório da logo + nome, busca, navegação, botão orçamento | Sticky leve; foco visível; navegação por teclado |
| H02 | Hero | Headline “As peças certas para o seu projeto hidráulico.” + apoio de segmentos | Produto como apoio, sem alegar que a foto seja da loja; CTA abre fluxo de orçamento |
| H03 | Categorias | Tubos, Conexões, Registros e válvulas, Caixas d'água, Vedação e acessórios, Materiais diversos | Clique seleciona categoria e conduz ao orçamento. Card inteiro clicável |
| H04 | Confiança | Atendimento local, consulta de entrega, orientação sobre itens | Só alegar “entrega grátis”, “pagamento facilitado”, “garantia” quando confirmado |
| H05 | Jornada | Encontrar → Informar quantidade/detalhes → Enviar pedido | 3 etapas curtas com orientações. Um CTA principal |
| H06 | Orçamento | Lista de itens por categoria e quantidade; contato; observações | Remover item, validar campos e gerar texto legível. Sem cobrança automática |
| H07 | Contato | Telefone informado, endereço e Instagram | Validar antes da publicação. Não pressupor WhatsApp |
| H08 | Footer | Navegação, copyright neutro e links legais após definição | Sem claims falsos ou links vazios em produção |

### Hierarquia textual

- H1 único (hero), orientado à necessidade do visitante.
- H2 para categorias, jornada, contato.
- Botão principal nomeado com ação concreta: **Solicitar orçamento**.
- Links de categoria claros sem “clique aqui”.
- Não usar texto miúdo sobre fundos muito texturizados; sobreposição escura sobre a imagem do hero.

## Tablet — 768 a 1023 px

- Navegação compactada; busca ocupa linha própria.
- Categorias em grade de 3 colunas.
- Benefícios em 2 colunas.
- Hero empilha texto e imagem; botão de orçamento permanece visível.

## Mobile — 320 a 767 px

- Cabeçalho com marca, botão de menu e lista de orçamento.
- Campo de busca em largura total, área de toque >=44×44 CSS px.
- Hero curto e legível; CTA acima da dobra sempre que viável.
- Categorias em 2 colunas (em telas estreitas, 1 coluna se necessário).
- Lista de orçamento abre modal em tela quase cheia.
- Não usar conteúdo horizontal que provoque scroll lateral.

## Componentização sugerida

```text
App
├── SiteHeader
│   ├── BrandMark
│   ├── SearchCategories
│   └── QuoteButton(count)
├── Hero
├── CategoryGrid
│   └── CategoryCard
├── BenefitsStrip
├── QuoteSteps
├── ContactSection
├── SiteFooter
└── QuoteDialog
    ├── QuoteItemForm
    ├── QuoteItemList
    └── QuotePreview
```

## Regras de conteúdo

As categorias e fotos foram **extraídas visualmente do conceito aprovado**, mas a existência real dos itens deve ser validada. Não inferir estoque, preço, SKU ou marca pelos recortes. Imagens do mockup são para substituição posterior por fotos autorizadas da loja e dos produtos reais.
