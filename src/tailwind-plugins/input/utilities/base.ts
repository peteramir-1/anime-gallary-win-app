import { PluginAPI } from "tailwindcss/types/config";

export default ({ addVariant }: PluginAPI) => {
  addVariant('invalid', ['&.ng-touched.ng-invalid']);
  addVariant('input-checked-label', ['&:checked + label']);
  addVariant('input-disabled-label', ['&:disabled + label']);
  addVariant('input-disabled-checked-label', ['&:disabled:checked + label']);
};
