export type ViaCepAddress = {
  bairro: string;
  cep: string;
  erro?: boolean;
  localidade: string;
  logradouro: string;
  uf: string;
};

export function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatPhoneInput(value: string) {
  const digits = normalizePhoneDigits(value);

  if (digits.length <= 2) {
    return digits.length === 0 ? "" : `(${digits}`;
  }

  const ddd = digits.slice(0, 2);

  if (digits.length <= 6) {
    return `(${ddd}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${ddd}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${ddd}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function normalizePostalCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatPostalCodeInput(value: string) {
  const digits = normalizePostalCode(value);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function buildAddressFromViaCep(address: ViaCepAddress) {
  const mainLine = [address.logradouro.trim(), address.bairro.trim()].filter(Boolean).join(", ");
  const cityLine = [address.localidade.trim(), address.uf.trim()].filter(Boolean).join(" - ");

  return [mainLine, cityLine].filter(Boolean).join(" • ");
}
