import { useEffect, useState } from "react";
import { SelectInput } from "datocms-react-ui";
import { getCountries } from "react-phone-number-input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const CountrySelectAdapter = ({ value, onChange, ...props }: Props) => {
  const [rawValue, setRawValue] = useState<{ label: string; value: string } | null>();

  const countries = getCountries()
    .map(country => ({
      label: country,
      value: country
    }));

  const handleChange = (newValue: { label: string; value: string }) => {
    setRawValue(newValue);

    if (onChange) {
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
