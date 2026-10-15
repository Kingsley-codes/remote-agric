"use client";

import { useState, type ClipboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { getCountries, getCountryCallingCode, parsePhoneNumber, type Country } from "react-phone-number-input/input-max";
import flags from "react-phone-number-input/flags";
import labels from "react-phone-number-input/locale/en.json";
import { nationalPhoneInputValue, normalizePhoneNumber, phoneInputValue } from "@/lib/phone";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
};

const countries = getCountries().sort((a, b) => labels[a].localeCompare(labels[b], "en"));

export default function PhoneNumberInput({ id, value, onChange, required, className = "" }: Props) {
  const [touched, setTouched] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>("NG");
  const normalizedValue = phoneInputValue(value);
  const parsed = normalizedValue ? parsePhoneNumber(normalizedValue) : undefined;
  // Detect saved/pasted international numbers while retaining the user's choice
  // for countries that share a calling code (for example, Canada and the US).
  const country = normalizedValue?.startsWith(`+${getCountryCallingCode(selectedCountry)}`)
    ? selectedCountry
    : parsed?.country ?? selectedCountry;
  const Flag = flags[country];
  const invalid = touched && (value ? !normalizePhoneNumber(value) : required);

  return (
    <div className={className}>
      <div className={`flex min-w-0 overflow-hidden rounded-xl border bg-white text-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${invalid ? "border-red-400" : "border-slate-200"}`}>
        <div className="relative flex shrink-0 items-center gap-2 border-r border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 transition hover:bg-slate-100 focus-within:bg-slate-100">
          <span aria-hidden="true" className="block w-6 overflow-hidden rounded-sm shadow-sm [&_svg]:block [&_svg]:h-4 [&_svg]:w-6">
            {Flag && <Flag title={labels[country]} />}
          </span>
          <span aria-hidden="true" className="font-medium tabular-nums">+{getCountryCallingCode(country)}</span>
          <ChevronDown aria-hidden="true" className="size-3.5 text-slate-400" />
          <select
            aria-label="Phone country and calling code"
            autoComplete="tel-country-code"
            value={country}
            onChange={(event) => {
              const nextCountry = event.target.value as Country;
              const nationalNumber = parsed?.nationalNumber ?? normalizedValue?.replace(`+${getCountryCallingCode(country)}`, "") ?? "";
              setSelectedCountry(nextCountry);
              onChange(nationalNumber ? `+${getCountryCallingCode(nextCountry)}${nationalNumber}` : "");
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          >
            {countries.map((item) => <option key={item} value={item}>{labels[item]} (+{getCountryCallingCode(item)})</option>)}
          </select>
        </div>
        <input
          id={id}
          name="phone"
          type="tel"
          value={nationalPhoneInputValue(value, country, editing)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            onChange(digits ? `+${getCountryCallingCode(country)}${digits}` : "");
          }}
          onFocus={() => setEditing(true)}
          onBlur={() => {
            setEditing(false);
            setTouched(true);
          }}
          onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
            const pasted = event.clipboardData.getData("text").trim();
            if (!pasted.startsWith("+")) return;
            const number = normalizePhoneNumber(pasted);
            if (!number) return;
            event.preventDefault();
            const pastedCountry = parsePhoneNumber(number)?.country;
            if (pastedCountry) setSelectedCountry(pastedCountry);
            onChange(number);
          }}
          required={required}
          autoComplete="tel-national"
          inputMode="tel"
          placeholder="Phone number"
          aria-invalid={Boolean(invalid)}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        />
      </div>
      {invalid && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">Enter a valid phone number for the selected country.</p>}
    </div>
  );
}
