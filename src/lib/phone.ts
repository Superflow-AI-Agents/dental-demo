export function telHref(phone: string): string {
  return "tel:+1" + phone.replace(/[^\d]/g, "");
}
