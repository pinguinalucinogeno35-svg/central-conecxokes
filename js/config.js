/* Central das Conexões — configuração pública do site.
 * Edite aqui os dados da loja. Nada neste arquivo é enviado a servidores:
 * o pedido sai do navegador direto para o WhatsApp do cliente.
 */
window.CDC_CONFIG = Object.freeze({
  businessName: 'Central das Conexões',
  tagline: 'Qualidade que conecta. Preço justo que compensa.',
  city: 'Ilhéus/BA',
  region: 'Ilhéus e região',

  // Número confirmado pelo responsável do projeto em 21/10/2026.
  // Formato: 55 + DDD + número, somente dígitos.
  whatsappNumber: '557332232082',
  phoneDisplay: '(73) 3223-2082',

  instagramHandle: '@cdasconexoes',
  instagramUrl: 'https://www.instagram.com/cdasconexoes/',

  // Endereço coletado e ainda não verificado. Mude showAddress para true
  // somente depois que a loja confirmar endereço e CEP.
  showAddress: false,
  address: 'Av. Oduvaldo Evaristo Bacelar, 180 — São Francisco, Ilhéus/BA',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Oduvaldo+Evaristo+Bacelar+180+Ilh%C3%A9us+BA',

  // Horário: deixe vazio enquanto não for confirmado (a seção some sozinha).
  openingHours: '',

  // Textos de condição comercial. Mantenha neutros até a loja confirmar.
  deliveryText: 'Entrega em Ilhéus e região: consulte as condições',
  paymentText: '',

  // Prefixo do número do pedido que aparece na mensagem do WhatsApp.
  orderPrefix: 'CDC'
});
