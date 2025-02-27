import { ComponentProps, forwardRef, RefObject } from "react";
import { TextInput, useCtx } from "datocms-react-ui";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";

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
