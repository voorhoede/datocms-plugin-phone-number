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
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
} & Omit<ComponentProps<typeof SelectInput>, 'onChange' | 'options' | 'value'>;

export const CountrySelectAdapter = ({
  value,
  options = [],
  onChange,
  iconComponent,
  onMenuOpen,
  onMenuClose,
  ...props
}: Props) => {
  const Icon = iconComponent;
  const [rawValue, setRawValue] = useState<Value>(
    options.find((option) => option.value === value) || null
  );

  useEffect(() => {
    const found = options.find((option) => option.value === value) || null;
    setRawValue(found);
  }, [value, options]);

  const handleChange = (newValue: unknown) => {
    const val = newValue as Value;
    setRawValue(val);
    onChange(val?.value || "");

    // Ensure the iframe resets height immediately after selection
    if (onMenuClose) onMenuClose();
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
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
      {...props}
    />
  );
};
