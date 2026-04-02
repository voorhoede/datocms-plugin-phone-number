import { useEffect, useState, useCallback, useRef } from "react";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, FieldError } from "datocms-react-ui";
import getValue from "../lib/get-value";
import PhoneInput, {
  getCountries,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import { PhoneInputAdapter } from "../components/PhoneInputAdapter";
import { CountrySelectAdapter } from "../components/CountrySelectAdapter";
import { Parameters } from "../types/parameters";

import "react-phone-number-input/style.css";

type Props = {
  fieldExtensionId: string;
  ctx: RenderFieldExtensionCtx;
};

export default function FieldExtension({ ctx }: Props) {
  const { setHeight, startAutoResizer, stopAutoResizer } = ctx;
  const parameters = ctx.parameters as Parameters;
  const fieldType = ctx.field.attributes.field_type;

  const [rawValue] = useState<string | undefined>(
    getValue<string>(ctx.formValues, ctx.fieldPath),
  );
  const [value, setValue] = useState<string>();

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Manually manage iframe height when the country dropdown opens.
   */
  const handleMenuOpen = useCallback(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.getBoundingClientRect().height;

      stopAutoResizer();

      setHeight(Math.max(currentHeight, 360) + 10);
    }
  }, [stopAutoResizer, setHeight]);

  const handleMenuClose = useCallback(() => {
    startAutoResizer();
  }, [startAutoResizer]);

  const countries = getCountries().filter((country) => {
    const include = parameters.includeCountries;
    const exclude = parameters.excludeCountries;

    if (include && !include.find((item) => item.value === country)) return false;
    if (exclude && exclude.find((item) => item.value === country)) return false;

    return true;
  });

  const handleChange = async (newValue: string | undefined) => {
    const isValid = newValue ? isValidPhoneNumber(String(newValue)) : true;

    ctx.updatePluginParameters({
      ...ctx.plugin.attributes.parameters,
      [ctx.field.id]: { invalid: !isValid },
    });

    if (fieldType === "json" && newValue) {
      const parsedValue = parsePhoneNumber(String(newValue));
      await ctx.setFieldValue(ctx.fieldPath, JSON.stringify(parsedValue));
      return;
    }

    await ctx.setFieldValue(ctx.fieldPath, newValue);
    setValue(newValue);
  };

  useEffect(() => {
    if (fieldType === "json" && rawValue) {
      try {
        const parsed = JSON.parse(String(rawValue));
        setValue(parsed?.number);
      } catch (e) {
        setValue(undefined);
      }
    } else {
      setValue(rawValue);
    }
  }, [rawValue, fieldType]);

  return (
    <Canvas ctx={ctx}>
      <div
        ref={containerRef}
        style={{ overflow: 'visible', position: 'relative' }}
      >
        <PhoneInput
          id={ctx.fieldPath}
          value={value}
          onChange={handleChange}
          inputComponent={PhoneInputAdapter}
          countrySelectComponent={CountrySelectAdapter}
          // Pass resize handlers safely via countrySelectProps to avoid console warnings
          countrySelectProps={{
            onMenuOpen: handleMenuOpen,
            onMenuClose: handleMenuClose,
          }}
          international={true}
          countries={countries}
          defaultCountry={parameters.defaultCountry?.value}
        />

        {value && !isValidPhoneNumber(String(value)) && (
          <FieldError>Phone number is invalid</FieldError>
        )}
      </div>
    </Canvas>
  );
}
