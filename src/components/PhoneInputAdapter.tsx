import { ChangeEvent, ComponentProps, forwardRef, RefObject, useEffect, useState } from "react";
import { TextInput } from "datocms-react-ui";
import { isValidPhoneNumber } from "react-phone-number-input";

export const PhoneInputAdapter = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof TextInput>
>(({ value, onChange, ...props }, ref) => {
  const [valid, setValid] = useState<boolean>();

  const handleChange = (newValue: string, event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(newValue, event);
    }
  };

  useEffect(() => {
    setValid(isValidPhoneNumber(String(value)))
  }, [value])

  return (
    <TextInput
      inputRef={ref as RefObject<HTMLInputElement>}
      value={value}
      error={!valid}
      onChange={handleChange}
      {...props}
    />
  )
});
