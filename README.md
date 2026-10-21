# Central das Conexões — site catálogo (V1)

Site catálogo da Central das Conexões (Ilhéus/BA). O cliente navega pelas peças, monta uma **lista de orçamento** e envia o pedido **formatado para o WhatsApp** da loja. Não é um e-commerce: não tem conta, checkout, pagamento nem preço. A equipe confirma medidas, disponibilidade, preço e entrega na conversa.

Identidade visual: handoff ONE Creative Studio (`docs/handoff/`), seguindo o mockup aprovado `docs/handoff/01_mockup_site_aprovado.png`.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

HTML, CSS e JavaScript puros, sem build e sem dependências externas. Pode ser publicado em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

```text
index.html          página única (header, hero, categorias, catálogo, kits, como funciona, dúvidas, contato)
css/styles.css      estilos e responsividade (tokens do design system no topo)
js/config.js        dados da loja: WhatsApp, telefone, Instagram, endereço, horário, textos de entrega
js/catalogo.js      categorias, produtos, medidas e kits
js/app.js           busca, filtros, carrinho, mensagem e envio ao WhatsApp
assets/img/         logo provisória e imagens ilustrativas das categorias
docs/handoff/       especificação, design system, gates de dados e critérios de QA do handoff
```

## Como funciona o pedido

1. O cliente filtra por categoria, linha (água fria, roscável, água quente, esgoto) e medida (mm ou polegadas), ou busca pelo nome popular ("cotovelo", "cola", "teflon").
2. Escolhe a medida e a quantidade e adiciona à lista. Também pode adicionar um **kit pronto** (caixa d'água, banheiro, troca de registro, esgoto) ou um **item livre** que não está no catálogo.
3. Na lista, ajusta medidas e quantidades, informa o nome, escolhe "Retirar na loja" ou "Quero entrega" (o bairro passa a ser obrigatório) e escreve observações.
4. "Enviar pedido pelo WhatsApp" abre `wa.me/557332232082` com a mensagem pronta. O cliente confirma o envio no próprio WhatsApp.

Exemplo da mensagem gerada:

```text
Olá, Central das Conexões! Quero um orçamento.
*Pedido CDC-211026-2456*

*Itens (2)*
1. Joelho 90° soldável
   Medida: 25 mm · Qtd: 10 un · Cód. CON-001
2. [Item livre] Luva de correr marrom
   Medida: 32 mm · Qtd: 2

*Nome:* João
*Recebimento:* Entrega (consultar condições)
*Bairro/localidade:* Centro

Peço a confirmação de medidas, disponibilidade, preço e entrega.
Enviado pelo site · origem: Instagram
```

- **Número do pedido** (`CDC-ddmmaa-xxxx`): identifica a conversa. Ele é renovado quando a lista é limpa.
- **Origem**: vem do parâmetro `?origem=` ou `utm_source` do link, ou do site de onde a pessoa chegou. Use, por exemplo, `?origem=Instagram` na bio e `?origem=QRcode-balcao` no material impresso para medir de onde vêm os pedidos.
- A lista fica salva no navegador (somente os itens). Nome, bairro e observações não são guardados.

## Editar o catálogo

Em `js/catalogo.js`, cada produto tem:

| Campo | Uso |
|---|---|
| `code` | código único exibido no card e na mensagem (ex.: `CON-001`) |
| `cat` | id da categoria (`tubos`, `conexoes`, `registros`, `caixas`, `vedacao`, `diversos`) |
| `line` | `agua-fria`, `roscavel`, `agua-quente`, `esgoto` ou `geral` |
| `name` | nome técnico |
| `aka` | nomes populares para a busca |
| `sizes` | medidas vendidas, na ordem do seletor |
| `unit` | unidade de venda (`un`, `barra 6 m`, `rolo`...) |
| `icon` | desenho do card (símbolos `p-*` no topo do `index.html`) |

Os kits referenciam produtos por `[código, medida, quantidade]`.

## Pendências antes de publicar

Os dados abaixo vêm do handoff (`docs/handoff/03_DADOS_E_GATES.csv`) e ainda precisam de confirmação da loja:

- [ ] Confirmar que o (73) 3223-2082 tem **WhatsApp Business** ativo (é um número fixo).
- [ ] Logo oficial em SVG ou PNG de alta resolução. A atual é um recorte do avatar do Instagram.
- [ ] Fotos reais das categorias. As atuais são recortes do mockup em baixa resolução, cerca de 180 px.
- [ ] Validar o catálogo inicial (itens, medidas, nomenclatura da loja).
- [ ] Endereço e CEP: depois de confirmar, mudar `showAddress: true` em `js/config.js`.
- [ ] Horário de atendimento: preencher `openingHours`.
- [ ] Condições de entrega e pagamento: ajustar `deliveryText` e `paymentText`.
- [ ] Domínio definido: remover `<meta name="robots" content="noindex,nofollow">`, adicionar canonical, `sitemap.xml` e JSON-LD `HardwareStore` com os dados confirmados.
- [ ] Política de privacidade, se for adicionado analytics.

## Analytics

O site dispara eventos em `window.dataLayer` somente se ele existir (Google Tag Manager): `quote_open`, `quote_item_added`, `quote_kit_added`, `quote_copy`, `quote_whatsapp_click`, `whatsapp_direct_click`, `category_view` e `search_use`. Nenhum dado pessoal ou texto digitado é enviado.
