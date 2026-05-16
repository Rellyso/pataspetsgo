export function toWhatsappHref(phone: string | undefined, message?: string) {
  if (!phone) {
    return undefined;
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length === 0) {
    return undefined;
  }

  if (!message) {
    return `https://wa.me/${digits}`;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
