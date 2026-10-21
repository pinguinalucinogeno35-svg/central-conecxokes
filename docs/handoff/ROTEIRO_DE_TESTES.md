# Roteiro de testes manuais (starter)

Rodar um servidor local em `02_DEV_STARTER/` e abrir a página.

| ID | Passo | Resultado esperado |
|---|---|---|
| T01 | Abrir 1440px | Header, hero, categorias e próximas seções sem quebra/scroll horizontal |
| T02 | Abrir 375px | Menu recolhido, hero legível, categorias em duas colunas |
| T03 | Buscar `conex` | Mostra categoria “Conexões” e quantidade de resultados |
| T04 | Buscar `nadaexiste` | Mostra estado sem resultados sem erro |
| T05 | Selecionar “Tubos” | Modal de orçamento abre com “Tubos” selecionado |
| T06 | Descrição vazia e adicionar | Navegador exige preenchimento; não adiciona |
| T07 | Quantidade 0/10000 | Validação impede adição |
| T08 | Adicionar dois itens | Contador 2; prévia contém ambos |
| T09 | Remover um item | Contador 1; item removido da prévia |
| T10 | Copiar sem nome | Exibe pedido para informar nome; não afirma envio |
| T11 | Inserir nome + copiar | Mensagem copiada (HTTPS/localhost) ou instrução para copiar manualmente |
| T12 | Clicar WhatsApp sem config | Botão bloqueado e identificado como pendente |
| T13 | Teclado: Tab/Shift+Tab/Esc | Acessos e fechamento do modal funcionam |
| T14 | Mobile: menu + selecionar seção | Menu fecha quando navegação muda |
| T15 | Desativar JS | Página ainda mostra mensagem editorial, hero, benefícios, fluxo e contato; categorias dependem de JS no starter |
| T16 | Navegadores | Chrome, Firefox e Safari atuais |

## Testes de integração (quando contratado)

- Validar catálogo com SKU real e regras de disponibilidade.
- Validar integração WhatsApp e confirmação manual da loja.
- Validar Analytics, SEO local e dados estruturados em ambiente de staging.
- Testar falhas de rede e comportamento com scripts desativados.

**Limite conhecido do starter:** os cards de categorias são renderizados por JS, e o site não inclui mecanismo de administração nem backend de leads. Proteger implementação real contra injeção, bots e acesso indevido caso o time adicione persistência no servidor.
