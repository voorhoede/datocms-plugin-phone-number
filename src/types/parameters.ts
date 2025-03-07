import { MultiValue, SingleValue } from "react-select";
import { CountryCode } from "libphonenumber-js";

export type Parameters = {
  includeCountries: MultiValue<{
    value: CountryCode;
    label: CountryCode;
  }>;
  excludeCountries: MultiValue<{
    value: CountryCode;
    label: CountryCode;
  }>;
  defaultCountry: SingleValue<{
    value: CountryCode;
    label: CountryCode;
  }>;
};
