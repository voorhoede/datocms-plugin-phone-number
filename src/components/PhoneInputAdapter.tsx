import { ComponentProps, forwardRef, RefObject } from "react";
import { TextInput } from "datocms-react-ui";

export const PhoneInputAdapter = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof TextInput>
>((props, ref) => {
  return (
    <TextInput
      inputRef={ref as RefObject<HTMLInputElement>}
      {...props}
    />
  )
});
