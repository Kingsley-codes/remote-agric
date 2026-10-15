import { formatIncompletePhoneNumber, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export function nationalPhoneInputValue(value: string, country: CountryCode, editing: boolean): string {
  const prefix = `+${getCountryCallingCode(country)}`;
  const input = phoneInputValue(value) ?? "";
  const national = input.startsWith(prefix) ? input.slice(prefix.length) : input;
  const digits = national.replace(/\D/g, "");
  if (editing || !digits) return digits;
  return formatIncompletePhoneNumber(`${prefix}${digits}`).slice(prefix.length).trim();
}

// The input owns formatting while editing. Re-normalizing its international
// value when it becomes valid can remove a trunk zero and reset its caret.
export function phoneInputValue(value: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("+")) return value;
  return normalizePhoneNumber(value) ?? value;
}

// Support existing national-format Nigerian numbers, but never extract a
// seemingly valid number from arbitrary text or silently discard extensions.
export function normalizePhoneNumber(value: string): string | undefined {
  const input = value.trim();
  if (!input || !/^\+?[\d\s().-]+$/.test(input)) return undefined;
  const phone = parsePhoneNumberFromString(input, "NG");
  return phone?.isValid() ? phone.number : undefined;
}
