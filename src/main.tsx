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
        id: "phonenumber",
        name: "Phonenumber",
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
    return render(<FieldExtensionConfigScreen fieldExtensionId={fieldExtensionId} ctx={ctx} />);
  }
});
