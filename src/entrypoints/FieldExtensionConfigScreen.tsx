import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { MultiValue } from "react-select";
import { CountryCode } from "libphonenumber-js";
import { Canvas, Form, SelectField } from "datocms-react-ui";
import { useState } from "react";
import { getCountries } from "react-phone-number-input";

type Props = {
  fieldExtensionId: string;
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type SelectOption = MultiValue<{
  value: CountryCode;
  label: CountryCode;
}> | undefined;

export default function FieldExtensionConfigScreen({ ctx }: Props) {
  const countries = getCountries().map((country) => ({
    value: country,
    label: country,
  }));
  const [includeCountries, setIncludeCountries] = useState<SelectOption>();

  const handleChange = (
    newValue: SelectOption,
  ) => {
    setIncludeCountries(newValue);
  };

  return (
    <Canvas ctx={ctx}>
      <Form>
        <SelectField
          id="include_countries"
          label="Include countries"
          name="include_countries"
          hint="Leave empty to include all countries"
          selectInputProps={{
            isMulti: true,
            options: countries,
          }}
          value={includeCountries}
          onChange={handleChange}
        />
      </Form>
    </Canvas>
  );
}
