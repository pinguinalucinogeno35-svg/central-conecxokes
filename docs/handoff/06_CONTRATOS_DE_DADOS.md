# 06 — Contratos de dados (para futura implementação real)

Estas são **interfaces técnicas sugeridas**, não endpoints existentes.

## Category

```ts
type Category = {
  id: string;           // "tubos"
  slug: string;         // URL legível
  title: string;
  description?: string;
  imageUrl?: string;    // foto real autorizada
  sortOrder: number;
  active: boolean;
};
```

## Product (somente após receber catálogo)

```ts
type Product = {
  id: string;
  sku?: string;
  name: string;
  categoryId: string;
  manufacturer?: string;
  unit?: string;           // un, m, rolo, kit etc.
  dimensions?: Record<string,string>; // diâmetro, rosca, comprimento...
  imageUrls: string[];
  active: boolean;
  // Preço/estoque NÃO presentes sem integração e validação
};
```

## QuoteItem / QuoteRequest

```ts
type QuoteItem = {
  id: string;
  categoryId: string;
  description: string;
  quantity: number;
  notes?: string;
};

type QuoteRequest = {
  items: QuoteItem[];
  customer: {
    name: string;
    neighborhood?: string;
    // telefone/e-mail apenas se operação necessitar e houver base legal
  };
  channel: "website";
  consent?: boolean; // apenas caso haja coleta em backend
};
```

## Integrações futuras

- `GET /categories` e `GET /products?category=&search=` — após existir catálogo real.
- `POST /quotes` — **não implementar** sem confirmação de destino, governança de dados e requisitos de segurança.
- Webhook WhatsApp Business API — somente após autorização e contrato de provedor.
- CMS/admin para atualização de produtos: depende de responsável e rotina de manutenção.

Não há backend real neste ZIP. Não usar os exemplos como prova de integração existente.
