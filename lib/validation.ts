// ─── Helpers ────────────────────────────────────────────────────────────────

type ValidationError = { field: string; message: string };

export class ValidationResult {
  errors: ValidationError[] = [];

  add(field: string, message: string) {
    this.errors.push({ field, message });
  }

  get ok() {
    return this.errors.length === 0;
  }

  toResponse() {
    return Response.json(
      { error: "Datos inválidos", details: this.errors },
      { status: 400 }
    );
  }
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNumber(v: unknown): v is number {
  return typeof v === "number" && isFinite(v);
}

// ─── Order validation ────────────────────────────────────────────────────────

const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_CATEGORIES = ["jackets", "pants", "boots", "accessories"];
const VALID_STATUSES = ["available", "low-stock", "out-of-stock"];

export function validateOrder(body: unknown): ValidationResult {
  const r = new ValidationResult();

  if (!body || typeof body !== "object") {
    r.add("body", "El cuerpo de la solicitud no es válido");
    return r;
  }

  const b = body as Record<string, unknown>;
  const customer = b.customer as Record<string, unknown> | undefined;
  const items = b.items;

  // — customer —
  if (!customer || typeof customer !== "object") {
    r.add("customer", "Los datos del cliente son obligatorios");
  } else {
    if (!isString(customer.name) || customer.name.trim().length < 2) {
      r.add("customer.name", "El nombre debe tener al menos 2 caracteres");
    } else if (customer.name.trim().length > 100) {
      r.add("customer.name", "El nombre no puede superar 100 caracteres");
    }

    if (!isString(customer.phone) || !PHONE_RE.test(customer.phone.trim())) {
      r.add("customer.phone", "El teléfono no es válido (mínimo 7 dígitos)");
    }

    if (
      customer.email &&
      isString(customer.email) &&
      customer.email.trim() !== "" &&
      !EMAIL_RE.test(customer.email.trim())
    ) {
      r.add("customer.email", "El correo electrónico no es válido");
    }

    if (!isString(customer.address) || customer.address.trim().length < 5) {
      r.add("customer.address", "La dirección debe tener al menos 5 caracteres");
    } else if (customer.address.trim().length > 300) {
      r.add("customer.address", "La dirección no puede superar 300 caracteres");
    }

    if (!isString(customer.city) || customer.city.trim().length < 2) {
      r.add("customer.city", "La ciudad debe tener al menos 2 caracteres");
    }

    if (
      customer.notes &&
      isString(customer.notes) &&
      customer.notes.length > 500
    ) {
      r.add("customer.notes", "Las notas no pueden superar 500 caracteres");
    }
  }

  // — items —
  if (!Array.isArray(items) || items.length === 0) {
    r.add("items", "El pedido debe tener al menos un producto");
  } else {
    items.forEach((item: unknown, i: number) => {
      if (!item || typeof item !== "object") {
        r.add(`items[${i}]`, "Item inválido");
        return;
      }
      const it = item as Record<string, unknown>;

      if (!isString(it.productId) || it.productId.trim() === "") {
        r.add(`items[${i}].productId`, "ID de producto requerido");
      }
      if (!isString(it.name) || it.name.trim() === "") {
        r.add(`items[${i}].name`, "Nombre de producto requerido");
      }
      if (!isNumber(it.price) || it.price <= 0) {
        r.add(`items[${i}].price`, "El precio debe ser mayor a 0");
      }
      if (!isNumber(it.quantity) || !Number.isInteger(it.quantity) || it.quantity < 1) {
        r.add(`items[${i}].quantity`, "La cantidad debe ser un número entero mayor a 0");
      }
      if (!isString(it.selectedSize) || !VALID_SIZES.includes(it.selectedSize)) {
        r.add(`items[${i}].selectedSize`, "Talla no válida");
      }
    });
  }

  // — totals —
  if (!isNumber(b.subtotal) || (b.subtotal as number) < 0) {
    r.add("subtotal", "El subtotal debe ser un número positivo");
  }
  if (!isNumber(b.tax) || (b.tax as number) < 0) {
    r.add("tax", "El impuesto debe ser un número positivo");
  }
  if (!isNumber(b.total) || (b.total as number) <= 0) {
    r.add("total", "El total debe ser mayor a 0");
  }

  return r;
}

// ─── Product validation ──────────────────────────────────────────────────────

export function validateProduct(body: unknown): ValidationResult {
  const r = new ValidationResult();

  if (!body || typeof body !== "object") {
    r.add("body", "El cuerpo de la solicitud no es válido");
    return r;
  }

  const b = body as Record<string, unknown>;

  if (!isString(b.name) || b.name.trim().length < 2) {
    r.add("name", "El nombre debe tener al menos 2 caracteres");
  } else if (b.name.trim().length > 200) {
    r.add("name", "El nombre no puede superar 200 caracteres");
  }

  if (!isString(b.slug) || !SLUG_RE.test(b.slug)) {
    r.add("slug", "La dirección web solo puede tener letras minúsculas, números y guiones");
  }

  if (!isString(b.sku) || b.sku.trim().length < 2) {
    r.add("sku", "El código de producto debe tener al menos 2 caracteres");
  } else if (b.sku.trim().length > 50) {
    r.add("sku", "El código de producto no puede superar 50 caracteres");
  }

  if (!isString(b.category) || !VALID_CATEGORIES.includes(b.category)) {
    r.add("category", `La categoría debe ser una de: ${VALID_CATEGORIES.join(", ")}`);
  }

  if (!isNumber(b.price) || (b.price as number) <= 0) {
    r.add("price", "El precio debe ser mayor a 0");
  }

  if (!isString(b.status) || !VALID_STATUSES.includes(b.status)) {
    r.add("status", `El estado debe ser uno de: ${VALID_STATUSES.join(", ")}`);
  }

  if (b.stock !== undefined && b.stock !== null) {
    if (!isNumber(b.stock) || (b.stock as number) < 0) {
      r.add("stock", "Las unidades en bodega deben ser 0 o más");
    }
  }

  if (!Array.isArray(b.images)) {
    r.add("images", "Las imágenes deben ser una lista");
  }

  if (!Array.isArray(b.availableSizes)) {
    r.add("availableSizes", "Las tallas deben ser una lista");
  }

  if (!Array.isArray(b.availableColors)) {
    r.add("availableColors", "Los colores deben ser una lista");
  }

  if (typeof b.featured !== "boolean") {
    r.add("featured", "El campo destacado debe ser verdadero o falso");
  }

  return r;
}

// ─── Auth validation ─────────────────────────────────────────────────────────

export function validateAuth(body: unknown): ValidationResult {
  const r = new ValidationResult();

  if (!body || typeof body !== "object") {
    r.add("body", "El cuerpo de la solicitud no es válido");
    return r;
  }

  const b = body as Record<string, unknown>;

  if (!isString(b.password) || b.password.trim().length === 0) {
    r.add("password", "La contraseña es obligatoria");
  } else if (b.password.length > 200) {
    r.add("password", "Contraseña no válida");
  }

  return r;
}
