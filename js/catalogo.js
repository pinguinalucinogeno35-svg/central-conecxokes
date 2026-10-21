/* Central das Conexões — catálogo da V1.
 *
 * Catálogo inicial montado com itens comuns do segmento hidráulico, para
 * validação com a loja. Não há preço nem estoque: a equipe confirma tudo
 * pelo WhatsApp. Para editar:
 *  - categorias: id fixo (usado nos links), título e imagem;
 *  - produtos: code único, cat = id da categoria, sizes = medidas vendidas,
 *    aka = nomes populares que o cliente digita na busca,
 *    icon = desenho do card (ver lista de símbolos "p-*" no index.html);
 *  - kits: listas de referência que o cliente pode ajustar no carrinho.
 */
window.CDC_CATALOGO = (() => {
  const S = {
    soldavel: ['20 mm', '25 mm', '32 mm', '40 mm', '50 mm'],
    soldavelLongo: ['20 mm', '25 mm', '32 mm', '40 mm', '50 mm', '60 mm'],
    rosca: ['1/2"', '3/4"', '1"'],
    esgoto: ['40 mm', '50 mm', '75 mm', '100 mm'],
    cpvc: ['15 mm', '22 mm', '28 mm']
  };

  const categories = [
    { id: 'tubos', title: 'Tubos', image: 'assets/img/categoria_tubos.webp', blurb: 'Água fria, água quente, esgoto e roscáveis.' },
    { id: 'conexoes', title: 'Conexões', image: 'assets/img/categoria_conexoes.webp', blurb: 'Joelhos, tês, luvas, adaptadores e reduções.' },
    { id: 'registros', title: 'Registros e válvulas', image: 'assets/img/categoria_registros.webp', blurb: 'Gaveta, pressão, esfera, boia e retenção.' },
    { id: 'caixas', title: "Caixas d'água", image: 'assets/img/categoria_caixas.webp', blurb: 'Reservatórios e acessórios de ligação.' },
    { id: 'vedacao', title: 'Vedação e acessórios', image: 'assets/img/categoria_vedacao.webp', blurb: 'Fita veda rosca, adesivo, anéis e fixação.' },
    { id: 'diversos', title: 'Materiais diversos', image: 'assets/img/categoria_diversos.webp', blurb: 'Ralos, sifões, flexíveis e torneiras.' }
  ];

  const lines = [
    { id: 'agua-fria', title: 'Água fria soldável' },
    { id: 'roscavel', title: 'Roscável' },
    { id: 'agua-quente', title: 'Água quente' },
    { id: 'esgoto', title: 'Esgoto' },
    { id: 'geral', title: 'Uso geral' }
  ];

  const products = [
    // Tubos
    { code: 'TUB-001', cat: 'tubos', line: 'agua-fria', icon: 'p-tubo', name: 'Tubo PVC soldável água fria', unit: 'barra 6 m', sizes: S.soldavelLongo, aka: 'cano marrom cano de agua' },
    { code: 'TUB-002', cat: 'tubos', line: 'esgoto', icon: 'p-tubo', name: 'Tubo PVC esgoto', unit: 'barra 6 m', sizes: ['40 mm', '50 mm', '75 mm', '100 mm', '150 mm'], aka: 'cano branco cano de esgoto' },
    { code: 'TUB-003', cat: 'tubos', line: 'agua-quente', icon: 'p-tubo', name: 'Tubo CPVC água quente', unit: 'barra 3 m', sizes: ['15 mm', '22 mm', '28 mm', '35 mm'], aka: 'cano agua quente aquecedor solar' },
    { code: 'TUB-004', cat: 'tubos', line: 'roscavel', icon: 'p-tubo', name: 'Tubo PVC roscável', unit: 'barra 6 m', sizes: ['1/2"', '3/4"', '1"', '1.1/4"', '1.1/2"', '2"'], aka: 'cano de rosca cano branco' },

    // Conexões — água fria
    { code: 'CON-001', cat: 'conexoes', line: 'agua-fria', icon: 'p-joelho', name: 'Joelho 90° soldável', unit: 'un', sizes: S.soldavel, aka: 'cotovelo curva 90 joelho marrom' },
    { code: 'CON-002', cat: 'conexoes', line: 'agua-fria', icon: 'p-joelho45', name: 'Joelho 45° soldável', unit: 'un', sizes: S.soldavel, aka: 'cotovelo 45 curva' },
    { code: 'CON-003', cat: 'conexoes', line: 'agua-fria', icon: 'p-te', name: 'Tê 90° soldável', unit: 'un', sizes: S.soldavel, aka: 't te' },
    { code: 'CON-004', cat: 'conexoes', line: 'agua-fria', icon: 'p-luva', name: 'Luva soldável', unit: 'un', sizes: S.soldavelLongo, aka: 'emenda' },
    { code: 'CON-005', cat: 'conexoes', line: 'agua-fria', icon: 'p-luva', name: 'Luva de correr', unit: 'un', sizes: S.soldavel, aka: 'luva de reparo conserto vazamento' },
    { code: 'CON-006', cat: 'conexoes', line: 'agua-fria', icon: 'p-adaptador', name: 'Adaptador soldável curto (bolsa e rosca)', unit: 'un', sizes: ['20 mm x 1/2"', '25 mm x 3/4"', '32 mm x 1"', '40 mm x 1.1/4"', '50 mm x 1.1/2"'], aka: 'adaptador rosca' },
    { code: 'CON-007', cat: 'conexoes', line: 'agua-fria', icon: 'p-joelho', name: 'Joelho 90° soldável com bucha de latão', unit: 'un', sizes: ['20 mm x 1/2"', '25 mm x 1/2"', '25 mm x 3/4"'], aka: 'joelho azul joelho de chuveiro ponto de agua' },
    { code: 'CON-008', cat: 'conexoes', line: 'agua-fria', icon: 'p-bucha', name: 'Bucha de redução soldável', unit: 'un', sizes: ['25 x 20 mm', '32 x 25 mm', '40 x 32 mm', '50 x 40 mm'], aka: 'redução reducao' },
    { code: 'CON-009', cat: 'conexoes', line: 'agua-fria', icon: 'p-te', name: 'Tê de redução soldável', unit: 'un', sizes: ['25 x 20 mm', '32 x 25 mm'], aka: 't de reducao' },
    { code: 'CON-010', cat: 'conexoes', line: 'agua-fria', icon: 'p-cap', name: 'Cap soldável', unit: 'un', sizes: S.soldavel, aka: 'tampao tampa ponta' },
    { code: 'CON-011', cat: 'conexoes', line: 'agua-fria', icon: 'p-uniao', name: 'União soldável', unit: 'un', sizes: S.soldavel, aka: 'uniao' },
    { code: 'CON-012', cat: 'conexoes', line: 'roscavel', icon: 'p-niple', name: 'Niple duplo roscável', unit: 'un', sizes: S.rosca, aka: 'niple nipel' },
    // Conexões — esgoto
    { code: 'CON-013', cat: 'conexoes', line: 'esgoto', icon: 'p-joelho', name: 'Joelho 90° esgoto', unit: 'un', sizes: S.esgoto, aka: 'curva esgoto cotovelo' },
    { code: 'CON-014', cat: 'conexoes', line: 'esgoto', icon: 'p-juncao', name: 'Junção simples esgoto', unit: 'un', sizes: ['50 mm', '75 mm', '100 mm', '100 x 50 mm'], aka: 'y ipsilon juncao' },
    { code: 'CON-015', cat: 'conexoes', line: 'esgoto', icon: 'p-te', name: 'Tê esgoto', unit: 'un', sizes: S.esgoto, aka: 't de esgoto' },
    // Conexões — água quente
    { code: 'CON-016', cat: 'conexoes', line: 'agua-quente', icon: 'p-joelho', name: 'Joelho 90° CPVC', unit: 'un', sizes: S.cpvc, aka: 'joelho agua quente' },

    // Registros e válvulas
    { code: 'REG-001', cat: 'registros', line: 'geral', icon: 'p-registro', name: 'Registro de gaveta (base)', unit: 'un', sizes: ['1/2"', '3/4"', '1"'], aka: 'registro geral registro de passagem' },
    { code: 'REG-002', cat: 'registros', line: 'geral', icon: 'p-registro', name: 'Registro de pressão (base)', unit: 'un', sizes: ['1/2"', '3/4"'], aka: 'registro do chuveiro' },
    { code: 'REG-003', cat: 'registros', line: 'agua-fria', icon: 'p-esfera', name: 'Registro de esfera PVC soldável', unit: 'un', sizes: S.soldavel, aka: 'valvula de esfera registro borboleta alavanca' },
    { code: 'REG-004', cat: 'registros', line: 'geral', icon: 'p-boia', name: 'Torneira de boia', unit: 'un', sizes: ['1/2"', '3/4"'], aka: 'boia caixa dagua' },
    { code: 'REG-005', cat: 'registros', line: 'geral', icon: 'p-valvula', name: 'Válvula de retenção', unit: 'un', sizes: ['3/4"', '1"'], aka: 'retencao bomba' },
    { code: 'REG-006', cat: 'registros', line: 'geral', icon: 'p-valvula', name: 'Válvula de pé com crivo', unit: 'un', sizes: ['1"', '1.1/4"'], aka: 'valvula de poço bomba succao' },
    { code: 'REG-007', cat: 'registros', line: 'geral', icon: 'p-registro', name: 'Válvula de descarga (base)', unit: 'un', sizes: ['1.1/4"', '1.1/2"'], aka: 'hydra descarga parede' },

    // Caixas d'água
    { code: 'CXA-001', cat: 'caixas', line: 'geral', icon: 'p-caixa', name: "Caixa d'água de polietileno", unit: 'un', sizes: ['310 L', '500 L', '1.000 L', '1.500 L'], aka: 'reservatorio tanque caixa azul' },
    { code: 'CXA-002', cat: 'caixas', line: 'agua-fria', icon: 'p-flange', name: "Adaptador com flange para caixa d'água", unit: 'un', sizes: ['20 mm x 1/2"', '25 mm x 3/4"', '32 mm x 1"', '40 mm x 1.1/4"', '50 mm x 1.1/2"'], aka: 'flange adaptador caixa' },
    { code: 'CXA-003', cat: 'caixas', line: 'geral', icon: 'p-boia', name: "Torneira de boia para caixa d'água", unit: 'un', sizes: ['1/2"', '3/4"'], aka: 'boia' },

    // Vedação e acessórios
    { code: 'VED-001', cat: 'vedacao', line: 'geral', icon: 'p-fita', name: 'Fita veda rosca', unit: 'rolo', sizes: ['18 mm x 10 m', '18 mm x 25 m', '18 mm x 50 m'], aka: 'teflon veda rosca' },
    { code: 'VED-002', cat: 'vedacao', line: 'agua-fria', icon: 'p-frasco', name: 'Adesivo plástico para PVC', unit: 'un', sizes: ['17 g', '75 g', '175 g'], aka: 'cola de cano cola pvc' },
    { code: 'VED-003', cat: 'vedacao', line: 'agua-fria', icon: 'p-frasco', name: 'Solução preparadora (limpador PVC)', unit: 'un', sizes: ['200 ml', '1 L'], aka: 'limpador solucao limpadora' },
    { code: 'VED-004', cat: 'vedacao', line: 'esgoto', icon: 'p-anel', name: 'Anel de vedação para vaso sanitário', unit: 'un', sizes: ['Único'], aka: 'anel de cera vedacao vaso' },
    { code: 'VED-005', cat: 'vedacao', line: 'geral', icon: 'p-anel', name: 'Abraçadeira metálica', unit: 'un', sizes: ['1/2"', '3/4"', '1"'], aka: 'abracadeira presilha' },
    { code: 'VED-006', cat: 'vedacao', line: 'geral', icon: 'p-lixa', name: "Lixa d'água", unit: 'folha', sizes: ['Grão 100', 'Grão 150'], aka: 'lixa' },

    // Materiais diversos
    { code: 'DIV-001', cat: 'diversos', line: 'esgoto', icon: 'p-ralo', name: 'Caixa sifonada', unit: 'un', sizes: ['100 x 100 x 50 mm', '150 x 150 x 50 mm'], aka: 'ralo sifonado ralo' },
    { code: 'DIV-002', cat: 'diversos', line: 'esgoto', icon: 'p-ralo', name: 'Grelha para ralo', unit: 'un', sizes: ['10 x 10 cm', '15 x 15 cm'], aka: 'tampa de ralo grelha' },
    { code: 'DIV-003', cat: 'diversos', line: 'esgoto', icon: 'p-sifao', name: 'Sifão sanfonado universal', unit: 'un', sizes: ['Único'], aka: 'sifao pia sifao lavatorio' },
    { code: 'DIV-004', cat: 'diversos', line: 'geral', icon: 'p-flexivel', name: 'Engate flexível', unit: 'un', sizes: ['30 cm', '40 cm', '50 cm'], aka: 'rabicho flexivel ligacao torneira' },
    { code: 'DIV-005', cat: 'diversos', line: 'geral', icon: 'p-torneira', name: 'Torneira para jardim e tanque', unit: 'un', sizes: ['1/2"', '3/4"'], aka: 'torneira de parede tanque jardim' },
    { code: 'DIV-006', cat: 'diversos', line: 'geral', icon: 'p-flexivel', name: 'Mangueira de jardim', unit: 'rolo', sizes: ['15 m', '20 m', '30 m'], aka: 'mangueira' }
  ];

  const kits = [
    {
      id: 'kit-caixa', title: "Ligação de caixa d'água",
      description: 'Entrada com boia, saída com registro e ligação em 25 mm.',
      items: [
        ['CXA-002', '25 mm x 3/4"', 2], ['REG-004', '3/4"', 1], ['REG-003', '25 mm', 1],
        ['TUB-001', '25 mm', 1], ['CON-001', '25 mm', 4], ['VED-002', '75 g', 1], ['VED-001', '18 mm x 10 m', 1]
      ]
    },
    {
      id: 'kit-banheiro', title: 'Banheiro água fria 25 mm',
      description: 'Pontos de chuveiro, lavatório e vaso com registros.',
      items: [
        ['TUB-001', '25 mm', 2], ['CON-001', '25 mm', 8], ['CON-003', '25 mm', 3], ['CON-007', '25 mm x 1/2"', 3],
        ['REG-002', '3/4"', 1], ['REG-001', '3/4"', 1], ['VED-002', '75 g', 1], ['VED-001', '18 mm x 10 m', 1]
      ]
    },
    {
      id: 'kit-registro', title: 'Troca de registro',
      description: 'Para substituir um registro de gaveta de 3/4" em linha de 25 mm.',
      items: [
        ['REG-001', '3/4"', 1], ['CON-006', '25 mm x 3/4"', 2], ['CON-005', '25 mm', 2],
        ['VED-002', '17 g', 1], ['VED-001', '18 mm x 10 m', 1], ['VED-006', 'Grão 100', 1]
      ]
    },
    {
      id: 'kit-esgoto', title: 'Esgoto de banheiro',
      description: 'Caixa sifonada, ramais de 40 e 50 mm e ligação na rede de 100 mm.',
      items: [
        ['DIV-001', '100 x 100 x 50 mm', 1], ['TUB-002', '40 mm', 1], ['CON-013', '40 mm', 3], ['TUB-002', '50 mm', 1],
        ['TUB-002', '100 mm', 1], ['CON-014', '100 x 50 mm', 1], ['VED-004', 'Único', 1]
      ]
    }
  ];

  return Object.freeze({ categories, lines, products, kits });
})();
