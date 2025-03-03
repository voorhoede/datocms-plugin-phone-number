import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { MultiValue, SingleValue } from "react-select";
import { CountryCode } from "libphonenumber-js";
import { Canvas, Form, SelectField } from "datocms-react-ui";
import { useEffect, useState } from "react";
import { getCountries } from "react-phone-number-input";

type Props = {
  fieldExtensionId: string;
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export default function FieldExtensionConfigScreen({ ctx }: Props) {
  const countries = getCountries().map((country) => ({
    value: country,
    label: country,
  }));
  const [defaultCountryOptions, setDefaultCountryOptions] = useState<
    MultiValue<{
      value: CountryCode;
      label: CountryCode;
    }>
  >(countries);
  const [includeCountries, setIncludeCountries] = useState<
    MultiValue<{
      value: CountryCode;
      label: CountryCode;
    }>
  >(ctx.parameters.includeCountries || []);
  const [excludeCountries, setExcludeCountries] = useState<
    MultiValue<{
      value: CountryCode;
      label: CountryCode;
    }>
  >(ctx.parameters.excludeCountries || []);
  const [defaultCountry, setDefaultCountry] = useState<
    SingleValue<{
      value: CountryCode;
      label: CountryCode;
    }>
  >(ctx.parameters.defaultCountry);

  useEffect(() => {
    ctx.setParameters({
      ...ctx.parameters,
      includeCountries,
      excludeCountries,
      defaultCountry,
    });
  }, [includeCountries, excludeCountries, defaultCountry]);

  useEffect(() => {
    if (includeCountries.length > 0) {
      setDefaultCountryOptions(includeCountries);
      return;
    }
    if (excludeCountries.length > 0) {
      const filteredCountries = countries.filter((country) => {
        return !excludeCountries.find(
          (excludeCountry) => excludeCountry.value === country.value,
        );
      });
      setDefaultCountryOptions(filteredCountries);
      return;
    }
    setDefaultCountryOptions(countries);
    return;
  }, [includeCountries, excludeCountries]);

  return (
    <Canvas ctx={ctx}>
      <Form>
        <SelectField
          id="include_countries"
          label="Include countries"
          name="include_countries"
          hint={
            excludeCountries.length > 0
              ? "Empty Exclude countries if you want to include countries"
              : "Leave empty to include all countries"
          }
          selectInputProps={{
            isMulti: true,
            options: countries,
            isDisabled: excludeCountries.length > 0,
          }}
          value={includeCountries}
          onChange={(value) => setIncludeCountries(value)}
        />
        <SelectField
          id="exclude_countries"
          label="Exclude countries"
          name="exclude_countries"
          hint={
            includeCountries.length > 0
              ? "Empty Include countries if you want to exclude countries"
              : "Leave empty to exclude no countries"
          }
          selectInputProps={{
            isMulti: true,
            options: countries,
            isDisabled: includeCountries.length > 0,
          }}
          value={excludeCountries}
          onChange={(value) => setExcludeCountries(value)}
        />
        <SelectField
          id="default_country"
          label="Default country"
          name="default_country"
          selectInputProps={{
            options: defaultCountryOptions,
          }}
          value={defaultCountry}
          onChange={(value) => setDefaultCountry(value)}
        />
      </Form>
    </Canvas>
  );
}
