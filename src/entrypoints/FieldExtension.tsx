import { useEffect, useState } from "react";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, FieldError } from "datocms-react-ui";
import getValue from "../lib/get-value";
import PhoneInput, {  getCountries, isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { PhoneInputAdapter } from "../components/PhoneInputAdapter";

import 'react-phone-number-input/style.css';

type Props = {
  fieldExtensionId: string;
  ctx: RenderFieldExtensionCtx;
};

export default function FieldExtension({ ctx }: Props) {
  const parameters = ctx.parameters;
  const fieldType = ctx.field.attributes.field_type;
  const [rawValue] = useState<string | undefined>(getValue<string>(ctx.formValues, ctx.fieldPath));
  const [value, setValue] = useState<string>();
  const countries = getCountries()
    .filter(country => {
      const include = parameters.includeCountries as Array<{ label: string, value: string }>;
      const exclude = parameters.excludeCountries as Array<{ label: string, value: string }>;

      if (include && !include.find(item => item.value === country)) {
        return false;
      }

      if (exclude && exclude.find(item => item.value === country)) {
        return false;
      }

      return true;
    });

  const handleChange = async (newValue: string | undefined) => {
    if (!isValidPhoneNumber(String(newValue))) {
      ctx.updatePluginParameters({ ...ctx.plugin.attributes.parameters, [ctx.field.id]: { invalid: true } });
    } else {
      ctx.updatePluginParameters({ ...ctx.plugin.attributes.parameters, [ctx.field.id]: { invalid: false } });
    }

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
      if (parsedValue) {
        setValue(parsedValue.number);
      }
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
        countries={countries}
        defaultCountry={parameters.defaultCountry?.value}
      />

      { !isValidPhoneNumber(String(value)) && <FieldError>Phone number is invalid</FieldError>}
    </Canvas>
  );
}
