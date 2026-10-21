# 04 — Fluxos e regras funcionais

## Jornada primária (v1, proposta)

1. Visitante entra via Google, Instagram ou busca direta.
2. Busca categoria ou navega pela grade.
3. Informa o nome descritivo da peça, quantidade e observação/medidas (texto livre inicial).
4. Adiciona o item à lista; repete se necessário.
5. Preenche nome e bairro/localidade (dados mínimos), revisa a mensagem.
6. Copia o texto ou, **após confirmar WhatsApp**, abre conversa em endpoint aprovado sem disparar mensagens automaticamente.
7. Equipe da Central responde, valida especificação, estoque, preço e entrega.

## MVP demonstrativo incluído

- Busca local filtrando categorias.
- Cartões de categoria que pré-selecionam a categoria no modal.
- Formulário para inserir itens com descrição, quantidade e observações.
- Remoção de itens, contador e validação.
- Pré-visualização do pedido + botão copiar.
- **Sem persistência de dados no navegador** no starter; a lista existe apenas enquanto a aba está aberta.
- WhatsApp **desativado até configuração explícita**.
- Navegação mobile com menu expansível.

## O que NÃO deve ser prometido sem briefing

- Checkout, Pix, carrinho de compra ou processamento de pagamento.
- Lista de preços e disponibilidade atualizada automaticamente.
- Integração com ERP/PDV, catálogo de estoque real ou API de terceiros.
- Atendimento instantâneo, prazo de entrega ou frete grátis.
- Conta de cliente, histórico de compras e programa de fidelidade.
- Emissão de orçamento comercial vinculante pelo site.

## Definições técnicas

### Configuração

`02_DEV_STARTER/config.js` concentra informações públicas propostas. `whatsappNumber` vem vazio por segurança. Quando validado, informar somente dígitos no formato internacional: `55DDDNÚMERO` (exemplo de formato, **não** número real).

### Validação de formulário

- Quantidade: número inteiro entre 1 e 9999.
- Descrição do item: entre 3 e 140 caracteres.
- Nome: mínimo 2 caracteres.
- Bairro/Localidade: opcional na demonstração, recomendado para conferência de entrega.
- Observação livre: limitar a 300 caracteres.
- Não incluir dados sensíveis na mensagem de exemplo.

### Mensagem estruturada

```text
Olá! Gostaria de solicitar orçamento na Central das Conexões.
Nome: <nome>
Bairro/localidade: <local>
Itens:
1. [categoria] <descrição> — Qtd.: <n>
Observações: <texto>
Peço confirmação de medidas, disponibilidade, preço e entrega.
```

### Padrões de UX

- Usuário pode revisar itens antes de copiar/enviar.
- Não alegar que o pedido foi **enviado** após somente copiá-lo.
- Não enviar dados de formulários a terceiros sem consentimento e sem definir política de privacidade.
- O texto do pedido serve para contato, não é compra concluída.

## Futuras iterações (após contrato)

V1.1: catálogo real por SKU/atributos; filtros por medida/diâmetro; fotos reais.  
V1.2: painel interno para atualizar catálogo, regras de entrega, analytics e CRM.  
V2: integrações comerciais e financeiras, somente com orçamento e decisão explícita.
