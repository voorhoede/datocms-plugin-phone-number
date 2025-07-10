import { ComponentProps, ElementType, useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { SelectInput } from "datocms-react-ui";

import "./CountrySelectAdapter.css";

type OptionType = { label: string; value: string };
type Value = SingleValue<OptionType>;

type Props = {
  onChange: (newValue: string) => void;
  iconComponent: ElementType;
  options?: OptionType[];
  value?: string;
} & Omit<ComponentProps<typeof SelectInput>, 'onChange' | 'options' | 'value'>;

export const CountrySelectAdapter = ({
  value,
  options = [],
  onChange,
  iconComponent,
  ...props
}: Props) => {
  const Icon = iconComponent;
  const [rawValue, setRawValue] = useState<Value>(
    options.find((option) => option.value === value) || null
  );

  useEffect(() => {
    const rawValue = options.find((option) => option.value === value) || null;
    setRawValue(rawValue);
  }, [value, options]);

  const handleChange = (newValue: unknown) => {
    setRawValue(newValue as Value);
    onChange((newValue as Value)?.value || "");
  };

  const formatOptionLabel = (data: unknown) => {
    const option = data as OptionType;
    return (
      <div className="country-select-option">
        <Icon country={option.value} label={option.label} />
        <span className="country-select-option__label">{option.label}</span>
      </div>
    );
  };

  return (
    <SelectInput
      className="country-select-input"
      value={rawValue}
      onChange={handleChange}
      options={options}
      formatOptionLabel={formatOptionLabel}
      {...props}
    />
  );
};
