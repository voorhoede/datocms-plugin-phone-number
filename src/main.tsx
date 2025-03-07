import { connect } from "datocms-plugin-sdk";
import { render } from "./utils/render";
import ConfigScreen from "./entrypoints/ConfigScreen";
import FieldExtension from "./entrypoints/FieldExtension";
import FieldExtensionConfigScreen from "./entrypoints/FieldExtensionConfigScreen";
import "datocms-react-ui/styles.css";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions() {
    return [
      {
        id: "phoneNumber",
        name: "Phone Number",
        type: "editor",
        fieldTypes: ["string", "json"],
        configurable: true,
      },
    ];
  },
  renderFieldExtension(fieldExtensionId, ctx) {
    return render(
      <FieldExtension fieldExtensionId={fieldExtensionId} ctx={ctx} />,
    );
  },
  renderManualFieldExtensionConfigScreen(fieldExtensionId, ctx) {
    return render(
      <FieldExtensionConfigScreen
        fieldExtensionId={fieldExtensionId}
        ctx={ctx}
      />,
    );
  },
  async onBeforeItemUpsert(_, ctx) {
    const fields = await ctx.loadFieldsUsingPlugin();
    const plugin = ctx.plugin;

    for (let field of fields) {
      const invalid = (
        plugin.attributes.parameters[field.id] as {
          [key: typeof field.id]: { invalid: boolean };
        }
      ).invalid;
      if (invalid) {
        ctx.alert("Invalid phone number");
        return false;
      }
    }

    return true;
  },
});
