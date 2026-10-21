# Critérios de aceite — ONE × Central das Conexões

**O deploy não deve ser feito só porque o HTML abre.**

## Visual e marca

- [ ] Layout segue hierarquia do `01_mockup_site_aprovado.png` (header, hero, categorias, benefícios, pedido, contato).
- [ ] Logo oficial em vetor/PNG em alta resolução substitui avatar recortado.
- [ ] Paleta final aprovada; uso do laranja como CTA explicitamente validado.
- [ ] Fotos reais/licenciadas substituem recortes do mockup; não se passam por fotos do estoque real.
- [ ] Desktop, tablet e mobile consistentes e sem estouro horizontal.
- [ ] Foco visual, espaçamento, alinhamento e contraste revisados por designer ONE.

## Experiência e funcionalidade

- [ ] Busca categorias por texto e exibe estado vazio.
- [ ] Todo card é clicável e abre lista de orçamento na categoria correspondente.
- [ ] Itens podem ser adicionados/removidos; quantidade e descrição validadas.
- [ ] Contador reflete quantidade de itens incluídos.
- [ ] Prévia do orçamento identifica categoria, descrição e quantidade.
- [ ] Nome obrigatório antes de copiar/abrir envio.
- [ ] Copiar informa que a mensagem foi **copiada** e não enviada.
- [ ] WhatsApp só habilita após confirmação do número e revisão de fluxo.
- [ ] Cliente sabe que orçamento não significa preço/estoque/pagamento fechado.
- [ ] Menu mobile expande/recolhe com atributos ARIA atualizados.

## Dados e conformidade

- [ ] Nome e CNPJ/razão social checados quando necessários em documentos legais.
- [ ] Endereço, CEP, telefone, WhatsApp e horários confirmados.
- [ ] Regras e região de entrega confirmadas; promessas verdadeiras.
- [ ] Nenhum preço/brand/review/estrelas/quantidade seguidores inventados.
- [ ] Catálogo real com unidade, medida, especificação, fotos e responsáveis por atualização.
- [ ] Política de privacidade, cookies/analytics e retenção revisadas se dados forem coletados.
- [ ] `noindex` removido somente com aprovação para publicar e domínio validado.

## Técnico

- [ ] Sem erros JS no console; sem requests externos desconhecidos.
- [ ] Teste de teclado completo incluindo modal e menu.
- [ ] Lighthouse para performance, acessibilidade, SEO e boas práticas.
- [ ] Tested 320/375/390/768/1024/1440 px, Android e iPhone reais quando possível.
- [ ] Otimização de imagens (WebP/AVIF) e dimensionamento responsivo.
- [ ] Eventos só com dados não pessoais e consentimento/base aplicável.
- [ ] Seguro em HTTPS, com CSP, proteções do backend e deploy versionado quando houver backend.

## Definição de pronto

**Ready para desenvolvimento:** dados comerciais validados + design aprovado + escopo assinado.  
**Done em produção:** funciona em mobile e desktop, texto/claims aprovados, sem conteúdo ilustrativo apresentado como real, e a operação comercial consegue receber e responder às solicitações.
