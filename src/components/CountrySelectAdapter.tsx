import { useEffect, useState } from "react";
import { SelectInput } from "datocms-react-ui";
import { SingleValue } from "react-select";
import { getCountries } from "react-phone-number-input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type Value = SingleValue<{ label: string; value: string }>;

export const CountrySelectAdapter = ({ value, onChange, ...props }: Props) => {
  const [rawValue, setRawValue] = useState<Value>();

  const countries = getCountries()
    .map(country => ({
      label: country,
      value: country
    }));

  const handleChange = (newValue: Value) => {
    setRawValue(newValue);

    if (onChange && newValue) {
      onChange(newValue.value);
    }
  };

  useEffect(() => {
    setRawValue(countries.find(country => country.value === value));
  }, [value]);

  return (
    <SelectInput
      {...props}
      onChange={handleChange}
      value={rawValue}
      options={countries}
    />
  );
};
