import { useEffect, useState } from "react";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import getValue from "../lib/get-value";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import { PhoneInputAdapter } from "../components/PhoneInputAdapter";

import 'react-phone-number-input/style.css';

type Props = {
  fieldExtensionId: string;
  ctx: RenderFieldExtensionCtx;
};

export default function FieldExtension({ ctx }: Props) {
  const fieldType = ctx.field.attributes.field_type;
  const [rawValue] = useState<string | undefined>(getValue<string>(ctx.formValues, ctx.fieldPath));
  const [value, setValue] = useState<string>();

  const handleChange = async (newValue: string | undefined) => {
    if (fieldType === 'json') {
      const parsedValue = parsePhoneNumber(String(newValue));
      const jsonValue = JSON.stringify(parsedValue);
      await ctx.setFieldValue(ctx.fieldPath, jsonValue);
      return;
    }
    await ctx.setFieldValue(ctx.fieldPath, newValue);
    setValue(newValue);
  };

  useEffect(() => {
    if (fieldType === 'json') {
      const parsedValue = JSON.parse(String(rawValue));
      setValue(parsedValue.number);
    } else {
      setValue(rawValue as string);
    }
  }, [rawValue]);

  return (
    <Canvas ctx={ctx}>
      <PhoneInput
        id={ctx.fieldPath}
        value={value}
        onChange={handleChange}
        inputComponent={PhoneInputAdapter}
        international={true}
      />
    </Canvas>
  );
}
