/* Central das Conexões — catálogo com lista de orçamento enviada pelo WhatsApp.
 * Sem backend, sem checkout e sem preço: o site só organiza o pedido.
 * Dados digitados pelo visitante são inseridos com textContent (nunca innerHTML).
 */
(() => {
  'use strict';

  const cfg = window.CDC_CONFIG || {};
  const data = window.CDC_CATALOGO || { categories: [], lines: [], products: [], kits: [] };
  const STORAGE_KEY = 'cdc_lista_v1';
  const QTY_MIN = 1;
  const QTY_MAX = 9999;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const catById = new Map(data.categories.map((c) => [c.id, c]));
  const lineById = new Map(data.lines.map((l) => [l.id, l]));
  const productByCode = new Map(data.products.map((p) => [p.code, p]));

  // ---------- utilidades ----------
  const norm = (s) => String(s || '')
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[°º]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'dataset') Object.assign(node.dataset, value);
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of [].concat(children)) {
      if (child === null || child === undefined || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  function icon(id, cls = 'ico') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', cls);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${id}`);
    svg.append(use);
    return svg;
  }

  const clampQty = (value) => {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return QTY_MIN;
    return Math.min(QTY_MAX, Math.max(QTY_MIN, n));
  };

  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  function track(event, params = {}) {
    // Somente dados não pessoais (ver docs/handoff/05_SEO_ANALYTICS_E_ACESSIBILIDADE.md).
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...params });
  }

  const storage = {
    read() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
    },
    write(value) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* navegação privada */ }
    }
  };

  // ---------- WhatsApp ----------
  const waNumber = String(cfg.whatsappNumber || '').replace(/\D/g, '');
  const waUrl = (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

  function detectOrigin() {
    try {
      const saved = sessionStorage.getItem('cdc_origem');
      if (saved) return saved;
    } catch { /* sem sessionStorage */ }
    const params = new URLSearchParams(location.search);
    let origin = params.get('origem') || params.get('utm_source') || '';
    if (!origin && document.referrer) {
      const ref = document.referrer.toLowerCase();
      if (ref.includes('instagram')) origin = 'Instagram';
      else if (ref.includes('facebook')) origin = 'Facebook';
      else if (ref.includes('google')) origin = 'Google';
    }
    origin = (origin || 'Site').slice(0, 30);
    try { sessionStorage.setItem('cdc_origem', origin); } catch { /* ignore */ }
    return origin;
  }
  const origin = detectOrigin();

  function newOrderId() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return `${cfg.orderPrefix || 'PED'}-${pad(d.getDate())}${pad(d.getMonth() + 1)}${String(d.getFullYear()).slice(2)}-${rand}`;
  }

  // ---------- estado ----------
  const saved = storage.read();
  const state = {
    cart: Array.isArray(saved?.items) ? saved.items.filter(isValidItem) : [],
    orderId: saved?.orderId || newOrderId(),
    filters: { cat: '', line: '', size: '', q: '' }
  };

  function isValidItem(item) {
    if (!item || typeof item !== 'object') return false;
    if (item.custom) return typeof item.desc === 'string' && item.desc.length >= 3;
    return productByCode.has(item.code);
  }

  const persist = () => storage.write({ items: state.cart, orderId: state.orderId });
  const itemKey = (code, size) => `${code}|${size}`;

  function addToCart(code, size, qty, { silent = false } = {}) {
    const product = productByCode.get(code);
    if (!product) return;
    const key = itemKey(code, size);
    const existing = state.cart.find((i) => !i.custom && itemKey(i.code, i.size) === key);
    if (existing) existing.qty = clampQty(existing.qty + qty);
    else state.cart.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()), code, size, qty: clampQty(qty) });
    persist();
    renderCart();
    track('quote_item_added', { category_slug: product.cat });
    if (!silent) showToast(`${product.name} ${size !== 'Único' ? size : ''} adicionado à lista`.replace(/\s+/g, ' '));
  }

  function addCustom(desc, size, qty) {
    state.cart.push({ id: String(Date.now()), custom: true, desc, size, qty: clampQty(qty) });
    persist();
    renderCart();
    track('quote_item_added', { category_slug: 'item_livre' });
  }

  function updateItem(id, changes) {
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    Object.assign(item, changes);
    if (changes.size && !item.custom) {
      const dup = state.cart.find((i) => i !== item && !i.custom && itemKey(i.code, i.size) === itemKey(item.code, item.size));
      if (dup) { dup.qty = clampQty(dup.qty + item.qty); state.cart = state.cart.filter((i) => i !== item); }
    }
    persist();
    renderCart();
  }

  function removeItem(id) {
    state.cart = state.cart.filter((i) => i.id !== id);
    persist();
    renderCart();
  }

  function clearCart() {
    state.cart = [];
    state.orderId = newOrderId();
    persist();
    renderCart();
  }

  // ---------- configuração na página ----------
  function applyConfig() {
    $$('[data-config]').forEach((node) => {
      const value = cfg[node.dataset.config];
      if (value) node.textContent = value;
    });
    const direct = waUrl('Olá, Central das Conexões! Vim pelo site e gostaria de atendimento.');
    const photo = waUrl('Olá, Central das Conexões! Vim pelo site e quero enviar a foto de uma peça para identificar a medida.');
    $$('[data-whats-direct]').forEach((a) => {
      a.href = direct; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.addEventListener('click', () => track('whatsapp_direct_click', { origin: a.className || 'link' }));
    });
    $$('[data-whats-photo]').forEach((a) => { a.href = photo; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    if (cfg.instagramUrl) $('#instaLink').href = cfg.instagramUrl;
    if (cfg.phoneDisplay) $('#phoneLink').href = `tel:+${waNumber}`;
    if (cfg.showAddress && cfg.address) {
      $('#addressItem').hidden = false;
      const link = $('#addressLink');
      link.textContent = cfg.address;
      link.href = cfg.mapsUrl || '#contato';
    }
    if (cfg.openingHours) {
      $('#hoursItem').hidden = false;
      $('#hoursText').textContent = cfg.openingHours;
    }
  }

  // ---------- categorias ----------
  function renderCategories() {
    const grid = $('#categoryGrid');
    grid.replaceChildren();
    for (const cat of data.categories) {
      const count = data.products.filter((p) => p.cat === cat.id).length;
      const card = el('a', {
        class: 'category-card', href: '#catalogo', dataset: { navCat: cat.id },
        'aria-label': `${cat.title}: ver ${plural(count, 'produto', 'produtos')} no catálogo`
      }, [
        el('span', { class: 'category-img' }, el('img', { src: cat.image, alt: '', width: '330', height: '210', loading: 'lazy', decoding: 'async' })),
        el('span', { class: 'category-info' }, [
          el('span', {}, [el('strong', { text: cat.title }), el('small', { text: cat.blurb })]),
          icon('i-seta')
        ])
      ]);
      grid.append(card);
    }
  }

  function renderChips() {
    const wrap = $('#categoryChips');
    wrap.replaceChildren();
    const all = [{ id: '', title: 'Todos' }, ...data.categories];
    for (const cat of all) {
      wrap.append(el('button', {
        type: 'button', class: 'chip', 'aria-pressed': String(state.filters.cat === cat.id),
        dataset: { cat: cat.id }, text: cat.title,
        onclick: () => setCategory(cat.id)
      }));
    }
  }

  function setCategory(id, { fromNav = false } = {}) {
    state.filters.cat = id;
    $$('#categoryChips .chip').forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.cat === id)));
    renderProducts();
    if (id) track('category_view', { category_slug: id, source_section: fromNav ? 'nav' : 'catalog' });
  }

  // ---------- filtros ----------
  const BITOLAS = ['15 mm', '20 mm', '22 mm', '25 mm', '28 mm', '32 mm', '40 mm', '50 mm', '60 mm', '75 mm', '100 mm',
    '1/2"', '3/4"', '1"', '1.1/4"', '1.1/2"', '2"'];

  function sizeMatcher(size) {
    const esc = size.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[\\sx])${esc}`);
  }

  function productHasSize(product, size) {
    const re = sizeMatcher(size);
    return product.sizes.some((s) => re.test(s));
  }

  function firstMatchingSize(product) {
    if (!state.filters.size) return product.sizes[0];
    const re = sizeMatcher(state.filters.size);
    return product.sizes.find((s) => re.test(s)) || product.sizes[0];
  }

  function populateFilters() {
    const lineSel = $('#lineFilter');
    for (const line of data.lines) lineSel.append(el('option', { value: line.id, text: line.title }));
    const sizeSel = $('#sizeFilter');
    const available = BITOLAS.filter((b) => data.products.some((p) => productHasSize(p, b)));
    const mm = el('optgroup', { label: 'Milímetros' });
    const pol = el('optgroup', { label: 'Polegadas' });
    for (const b of available) (b.includes('mm') ? mm : pol).append(el('option', { value: b, text: b }));
    sizeSel.append(mm, pol);
  }

  const searchIndex = new Map(data.products.map((p) => [p.code, norm([
    p.name, p.aka, p.code, catById.get(p.cat)?.title, lineById.get(p.line)?.title, p.sizes.join(' ')
  ].join(' '))]));

  function filteredProducts() {
    const { cat, line, size, q } = state.filters;
    const tokens = norm(q).split(' ').filter(Boolean);
    return data.products.filter((p) => {
      if (cat && p.cat !== cat) return false;
      if (line && p.line !== line) return false;
      if (size && !productHasSize(p, size)) return false;
      if (tokens.length) {
        const hay = searchIndex.get(p.code);
        return tokens.every((t) => hay.includes(t));
      }
      return true;
    });
  }

  // ---------- produtos ----------
  function productCard(p) {
    const cat = catById.get(p.cat);
    const line = lineById.get(p.line);
    const uid = p.code.toLowerCase();
    let currentSize = firstMatchingSize(p);

    const qtyInput = el('input', {
      id: `qty-${uid}`, type: 'number', inputmode: 'numeric', min: String(QTY_MIN), max: String(QTY_MAX), value: '1',
      'aria-label': `Quantidade de ${p.name}`
    });
    qtyInput.addEventListener('change', () => { qtyInput.value = String(clampQty(qtyInput.value)); });

    const stepper = el('div', { class: 'stepper' }, [
      el('button', { type: 'button', 'aria-label': 'Diminuir quantidade', onclick: () => { qtyInput.value = String(clampQty(Number(qtyInput.value) - 1)); } }, icon('i-menos')),
      qtyInput,
      el('button', { type: 'button', 'aria-label': 'Aumentar quantidade', onclick: () => { qtyInput.value = String(clampQty(Number(qtyInput.value) + 1)); } }, icon('i-mais'))
    ]);

    const question = el('a', { class: 'link-question', target: '_blank', rel: 'noopener noreferrer' }, [icon('i-whats'), 'Tirar dúvida']);
    const updateQuestion = () => {
      question.href = waUrl(`Olá, Central das Conexões! Vim pelo site e tenho uma dúvida sobre: ${p.name}${currentSize !== 'Único' ? ` ${currentSize}` : ''} (cód. ${p.code}).`);
    };
    updateQuestion();

    let sizeControl;
    if (p.sizes.length > 1) {
      const select = el('select', { id: `size-${uid}` }, p.sizes.map((s) => el('option', { value: s, text: s, selected: s === currentSize })));
      select.addEventListener('change', () => { currentSize = select.value; updateQuestion(); });
      sizeControl = el('div', { class: 'field select-field field-compact' }, [
        el('label', { for: `size-${uid}`, text: 'Medida' }), select, icon('i-chevron')
      ]);
    } else {
      sizeControl = el('p', { class: 'single-size' }, [el('span', { text: 'Medida' }), el('b', { text: p.sizes[0] })]);
    }

    return el('article', { class: 'product-card' }, [
      el('div', { class: 'product-figure' }, [icon(p.icon, 'prod-ico'), el('span', { class: 'product-code', text: p.code })]),
      el('div', { class: 'product-body' }, [
        el('p', { class: 'product-meta', text: `${cat?.title || ''} · ${line?.title || ''}` }),
        el('h3', { class: 'product-name', text: p.name }),
        el('p', { class: 'product-unit', text: `Vendido por ${p.unit}` }),
        sizeControl,
        el('div', { class: 'product-actions' }, [
          stepper,
          el('button', {
            type: 'button', class: 'btn btn-primary btn-add', 'aria-label': `Adicionar ${p.name} à lista`,
            onclick: () => addToCart(p.code, currentSize, clampQty(qtyInput.value))
          }, [icon('i-lista'), el('span', { text: 'Adicionar' })])
        ]),
        el('div', { class: 'product-foot' }, [el('span', { class: 'price-note', text: 'Preço sob consulta' }), question])
      ])
    ]);
  }

  function renderProducts() {
    const list = filteredProducts();
    const grid = $('#productGrid');
    grid.replaceChildren(...list.map(productCard));
    $('#emptyState').hidden = list.length > 0;

    const { cat, q, size, line } = state.filters;
    const parts = [plural(list.length, 'produto', 'produtos')];
    if (q.trim()) parts.push(`para “${q.trim()}”`);
    if (cat) parts.push(`em ${catById.get(cat)?.title}`);
    if (line) parts.push(`· ${lineById.get(line)?.title}`);
    if (size) parts.push(`· medida ${size}`);
    $('#resultStatus').textContent = parts.join(' ');
  }

  // ---------- kits ----------
  function renderKits() {
    const grid = $('#kitGrid');
    grid.replaceChildren();
    for (const kit of data.kits) {
      const valid = kit.items.filter(([code]) => productByCode.has(code));
      const total = valid.reduce((sum, [, , qty]) => sum + qty, 0);
      grid.append(el('article', { class: 'kit-card' }, [
        el('div', { class: 'kit-head' }, [icon('i-kit', 'ico ico-kit'), el('div', {}, [
          el('h3', { text: kit.title }), el('p', { text: kit.description })
        ])]),
        el('ul', { class: 'kit-items' }, valid.map(([code, size, qty]) => {
          const p = productByCode.get(code);
          return el('li', {}, [el('b', { text: `${qty}×` }), ` ${p.name}${size !== 'Único' ? ` ${size}` : ''}`]);
        })),
        el('div', { class: 'kit-foot' }, [
          el('span', { text: plural(total, 'peça', 'peças') }),
          el('button', {
            type: 'button', class: 'btn btn-outline',
            onclick: () => {
              valid.forEach(([code, size, qty]) => addToCart(code, size, qty, { silent: true }));
              showToast(`Kit “${kit.title}” adicionado. Ajuste as quantidades na lista.`);
              track('quote_kit_added', { kit_id: kit.id });
            }
          }, [icon('i-mais'), 'Adicionar kit à lista'])
        ])
      ]));
    }
  }

  // ---------- carrinho ----------
  const dialog = $('#cartDialog');
  const nameInput = $('#customerName');
  const districtInput = $('#customerDistrict');
  const notesInput = $('#customerNotes');
  const sendLink = $('#sendWhats');

  const deliveryValue = () => ($('input[name="delivery"]:checked') || {}).value || 'retirada';

  function itemLabel(item) {
    if (item.custom) return item.desc;
    return productByCode.get(item.code)?.name || item.code;
  }

  function buildMessage() {
    const lines = [];
    lines.push(`Olá, ${cfg.businessName || 'Central das Conexões'}! Quero um orçamento.`);
    lines.push(`*Pedido ${state.orderId}*`);
    lines.push('');
    lines.push(`*Itens (${state.cart.length})*`);
    state.cart.forEach((item, i) => {
      const product = item.custom ? null : productByCode.get(item.code);
      const unit = product && product.unit !== 'un' ? ` (${product.unit})` : (product ? ' un' : '');
      const details = [];
      if (item.size && item.size !== 'Único') details.push(`Medida: ${item.size}`);
      details.push(`Qtd: ${item.qty}${unit}`);
      if (product) details.push(`Cód. ${product.code}`);
      lines.push(`${i + 1}. ${item.custom ? '[Item livre] ' : ''}${itemLabel(item)}`);
      lines.push(`   ${details.join(' · ')}`);
    });
    lines.push('');
    const name = nameInput.value.trim();
    const district = districtInput.value.trim();
    const notes = notesInput.value.trim();
    lines.push(`*Nome:* ${name || '(informar)'}`);
    lines.push(`*Recebimento:* ${deliveryValue() === 'entrega' ? 'Entrega (consultar condições)' : 'Retirar na loja'}`);
    if (district) lines.push(`*Bairro/localidade:* ${district}`);
    if (notes) lines.push(`*Observações:* ${notes}`);
    lines.push('');
    lines.push('Peço a confirmação de medidas, disponibilidade, preço e entrega.');
    lines.push(`Enviado pelo site · origem: ${origin}`);
    return lines.join('\n');
  }

  function cartUnits() { return state.cart.reduce((sum, i) => sum + i.qty, 0); }

  function cartItemRow(item) {
    const product = item.custom ? null : productByCode.get(item.code);
    const qty = el('input', {
      type: 'number', inputmode: 'numeric', min: String(QTY_MIN), max: String(QTY_MAX), value: String(item.qty),
      'aria-label': `Quantidade de ${itemLabel(item)}`
    });
    qty.addEventListener('change', () => updateItem(item.id, { qty: clampQty(qty.value) }));

    let sizeNode;
    if (product && product.sizes.length > 1) {
      const sel = el('select', { 'aria-label': `Medida de ${product.name}` },
        product.sizes.map((s) => el('option', { value: s, text: s, selected: s === item.size })));
      sel.addEventListener('change', () => updateItem(item.id, { size: sel.value }));
      sizeNode = el('span', { class: 'select-inline' }, [sel, icon('i-chevron')]);
    } else if (item.size && item.size !== 'Único') {
      sizeNode = el('span', { class: 'size-tag', text: item.size });
    }

    return el('li', { class: 'cart-item' }, [
      el('div', { class: 'cart-item-figure' }, icon(product ? product.icon : 'i-editar', product ? 'prod-ico' : 'ico')),
      el('div', { class: 'cart-item-main' }, [
        el('p', { class: 'cart-item-name', text: itemLabel(item) }),
        el('p', { class: 'cart-item-meta' }, [
          product ? `Cód. ${product.code}` : 'Item livre',
          product && product.unit !== 'un' ? ` · ${product.unit}` : ''
        ]),
        el('div', { class: 'cart-item-controls' }, [
          sizeNode,
          el('div', { class: 'stepper stepper-sm' }, [
            el('button', { type: 'button', 'aria-label': 'Diminuir quantidade', onclick: () => updateItem(item.id, { qty: clampQty(item.qty - 1) }) }, icon('i-menos')),
            qty,
            el('button', { type: 'button', 'aria-label': 'Aumentar quantidade', onclick: () => updateItem(item.id, { qty: clampQty(item.qty + 1) }) }, icon('i-mais'))
          ])
        ])
      ]),
      el('button', { type: 'button', class: 'icon-btn icon-btn-sm remove', 'aria-label': `Remover ${itemLabel(item)} da lista`, onclick: () => removeItem(item.id) }, icon('i-lixeira'))
    ]);
  }

  function renderCart() {
    const count = state.cart.length;
    const badge = $('#cartBadge');
    badge.hidden = count === 0;
    badge.textContent = String(count);
    $('#cartButtonSr').textContent = count ? `, ${plural(count, 'item', 'itens')}` : ', nenhum item';
    if (count) { badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }

    $('#cartSummary').textContent = count
      ? `${plural(count, 'item', 'itens')} · ${plural(cartUnits(), 'peça', 'peças')} · Pedido ${state.orderId}`
      : 'Nenhum item adicionado';
    $('#cartEmpty').hidden = count > 0;
    $('#cartItems').replaceChildren(...state.cart.map(cartItemRow));
    $('#customerForm').hidden = count === 0;
    $('.preview').hidden = count === 0;
    $('.cart-foot').classList.toggle('is-empty', count === 0);
    updateMessage();
  }

  function updateMessage() {
    const message = buildMessage();
    $('#messagePreview').textContent = message;
    sendLink.href = waUrl(message);
    sendLink.setAttribute('aria-disabled', String(state.cart.length === 0));
  }

  function showFieldError(input, errorNode, show) {
    errorNode.hidden = !show;
    input.setAttribute('aria-invalid', String(show));
    if (show) input.setAttribute('aria-describedby', errorNode.id);
    else input.removeAttribute('aria-describedby');
  }

  function validateCustomer() {
    const nameOk = nameInput.value.trim().length >= 2;
    const needsDistrict = deliveryValue() === 'entrega';
    const districtOk = !needsDistrict || districtInput.value.trim().length >= 2;
    showFieldError(nameInput, $('#customerNameError'), !nameOk);
    showFieldError(districtInput, $('#customerDistrictError'), !districtOk);
    if (!nameOk) { nameInput.focus(); return false; }
    if (!districtOk) { districtInput.focus(); return false; }
    return true;
  }

  function setStatus(text, tone = '') {
    const status = $('#cartStatus');
    status.textContent = text;
    status.dataset.tone = tone;
  }

  function openCart(origin = 'button') {
    if (!dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('cart-open');
      setStatus('');
      track('quote_open', { origin });
    }
  }

  function closeCart() {
    if (dialog.open) dialog.close();
  }

  // ---------- toast ----------
  let toastTimer;
  function showToast(text) {
    const toast = $('#toast');
    toast.replaceChildren(
      icon('i-check'),
      el('span', { text }),
      el('button', { type: 'button', class: 'toast-action', text: 'Ver lista', onclick: () => { toast.hidden = true; openCart('toast'); } })
    );
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
  }

  // ---------- eventos ----------
  function bindEvents() {
    $$('[data-open-cart]').forEach((b) => b.addEventListener('click', () => openCart(b.className.includes('header') ? 'header' : 'section')));
    $('#cartButton').addEventListener('click', () => openCart('header_cart'));
    $('#closeCart').addEventListener('click', closeCart);
    dialog.addEventListener('click', (e) => { if (e.target === dialog) closeCart(); });
    dialog.addEventListener('close', () => document.documentElement.classList.remove('cart-open'));
    $$('[data-close-cart]').forEach((a) => a.addEventListener('click', closeCart));

    $$('[data-custom-item]').forEach((b) => b.addEventListener('click', () => {
      openCart('custom_item');
      const box = $('#customItemBox');
      box.open = true;
      const desc = $('#customDesc');
      if (!desc.value && state.filters.q) desc.value = state.filters.q.trim().slice(0, 140);
      desc.focus();
    }));

    $('#customItemForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const desc = $('#customDesc');
      const ok = desc.value.trim().length >= 3;
      showFieldError(desc, $('#customDescError'), !ok);
      if (!ok) { desc.focus(); return; }
      addCustom(desc.value.trim().slice(0, 140), $('#customSize').value.trim().slice(0, 40), $('#customQty').value);
      e.target.reset();
      setStatus('Item adicionado à lista.', 'ok');
      desc.focus();
    });

    [nameInput, districtInput, notesInput].forEach((input) => input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true' && input.value.trim().length >= 2) {
        showFieldError(input, $(`#${input.id}Error`), false);
      }
      if ($('#cartStatus').dataset.tone === 'error') setStatus('');
      updateMessage();
    }));
    $$('input[name="delivery"]').forEach((radio) => radio.addEventListener('change', () => {
      const entrega = deliveryValue() === 'entrega';
      $('#districtOpt').textContent = entrega ? '(obrigatório para entrega)' : '(opcional)';
      if (!entrega) showFieldError(districtInput, $('#customerDistrictError'), false);
      updateMessage();
    }));

    sendLink.addEventListener('click', (e) => {
      if (!state.cart.length) {
        e.preventDefault();
        setStatus('Adicione pelo menos um item antes de enviar.', 'error');
        return;
      }
      if (!validateCustomer()) {
        e.preventDefault();
        setStatus('Confira os campos destacados.', 'error');
        return;
      }
      updateMessage();
      if (!waNumber) {
        e.preventDefault();
        setStatus('WhatsApp da loja não configurado. Use "Copiar mensagem".', 'error');
        return;
      }
      setStatus('Abrimos o WhatsApp com a sua mensagem. Confirme o envio por lá.', 'ok');
      track('quote_whatsapp_click', { item_count: state.cart.length, origin });
    });

    $('#copyMessage').addEventListener('click', async () => {
      if (!state.cart.length) { setStatus('Sua lista está vazia.', 'error'); return; }
      const text = buildMessage();
      try {
        await navigator.clipboard.writeText(text);
        setStatus('Mensagem copiada. Ela ainda não foi enviada: cole no WhatsApp da loja.', 'ok');
      } catch {
        const preview = $('#messagePreview');
        $('.preview').open = true;
        const range = document.createRange();
        range.selectNodeContents(preview);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        setStatus('Não foi possível copiar automaticamente. A mensagem está selecionada: copie manualmente.', 'error');
      }
      track('quote_copy', { item_count: state.cart.length });
    });

    let clearArmed = false;
    let clearTimer;
    const clearBtn = $('#clearCart');
    clearBtn.addEventListener('click', () => {
      if (!state.cart.length) return;
      if (!clearArmed) {
        clearArmed = true;
        clearBtn.lastChild.textContent = 'Toque de novo para limpar';
        clearTimer = setTimeout(() => { clearArmed = false; clearBtn.lastChild.textContent = 'Limpar lista'; }, 4000);
        return;
      }
      clearTimeout(clearTimer);
      clearArmed = false;
      clearBtn.lastChild.textContent = 'Limpar lista';
      clearCart();
      setStatus('Lista limpa.', '');
    });

    // filtros do catálogo
    const catalogSearch = $('#catalogSearch');
    const headerSearch = $('#headerSearchInput');
    const onSearch = (value, source) => {
      state.filters.q = value;
      if (source !== catalogSearch) catalogSearch.value = value;
      if (source !== headerSearch) headerSearch.value = value;
      renderProducts();
    };
    let searchTimer;
    const debouncedTrack = () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => track('search_use', { result_count: filteredProducts().length }), 800);
    };
    catalogSearch.addEventListener('input', () => { onSearch(catalogSearch.value, catalogSearch); debouncedTrack(); });
    headerSearch.addEventListener('input', () => { onSearch(headerSearch.value, headerSearch); debouncedTrack(); });
    $('#headerSearch').addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.filters.cat) setCategory('');
      $('#catalogo').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      headerSearch.blur();
    });
    $('#lineFilter').addEventListener('change', (e) => { state.filters.line = e.target.value; renderProducts(); });
    $('#sizeFilter').addEventListener('change', (e) => { state.filters.size = e.target.value; renderProducts(); });

    // navegação e categorias
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-nav-cat]');
      if (link) setCategory(link.dataset.navCat, { fromNav: true });
      if (e.target.closest('.site-nav a')) closeMenu();
    });

    const menuToggle = $('#menuToggle');
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      $('#siteNav').classList.toggle('is-open', open);
      menuToggle.firstElementChild.firstElementChild.setAttribute('href', open ? '#i-fechar' : '#i-menu');
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  function closeMenu() {
    const menuToggle = $('#menuToggle');
    if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    $('#siteNav').classList.remove('is-open');
    menuToggle.firstElementChild.firstElementChild.setAttribute('href', '#i-menu');
  }

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- início ----------
  applyConfig();
  renderCategories();
  renderChips();
  populateFilters();
  renderProducts();
  renderKits();
  renderCart();
  bindEvents();

  const params = new URLSearchParams(location.search);
  const initialCat = params.get('categoria');
  if (initialCat && catById.has(initialCat)) setCategory(initialCat);
})();
