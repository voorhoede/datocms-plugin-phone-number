import { Canvas, Form, SelectField } from "datocms-react-ui";
import { useState } from "react";
import { getCountries } from "react-phone-number-input";

export default function FieldExtensionConfigScreen ({ _, ctx }) {
  const countries = getCountries().map(country => ({ value: country, label: country }));
  const [includeCountries, setIncludeCountries] = useState();

  const handleChange = (newValue) => {
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
            options: countries
          }}
          value={includeCountries}
          onChange={handleChange}
        />
      </Form>
    </Canvas>
  );
};
