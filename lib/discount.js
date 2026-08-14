// Shared discount validation logic used by both the public "validate a code"
// endpoint and the order-creation endpoint (which re-validates server-side
// so a customer can never fake a discount amount from the browser).

export function isDiscountUsable(discount) {
  if (!discount) return { ok: false, reason: 'Invalid discount code' };
  if (!discount.active) return { ok: false, reason: 'This discount code is no longer active' };
  if (discount.expiresAt && new Date(discount.expiresAt).getTime() < Date.now()) {
    return { ok: false, reason: 'This discount code has expired' };
  }
  return { ok: true };
}

export function computeDiscountAmount(discount, subtotal) {
  if (!discount) return 0;
  const raw = discount.type === 'percent' ? Math.round((subtotal * discount.value) / 100) : discount.value;
  // Never let a discount exceed the subtotal (no negative totals).
  return Math.max(0, Math.min(raw, subtotal));
}
