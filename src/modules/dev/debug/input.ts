import type { InputProps } from "@/types";
import { debugData } from "@/utils/debugData";

export const debugInputDialog = () => {
  debugData<InputProps>([
    {
      action: "openDialog",
      data: {
        heading: "Police locker",
        rows: [
          {
            type: "input",
            label: "Locker number",
            placeholder: "420",
            description:
              "Description that tells you what this input field does",
          },
          {
            type: "time",
            format: "12",
            label: "Locker Expiration Time",
            description:
              "Description that tells you what this input field does",
          },
          { type: "checkbox", label: "Some checkbox" },
          {
            type: "input",
            label: "Locker PIN",
            password: true,
            icon: "icon-[ion--lock-closed]",
          },
          { type: "checkbox", label: "Some other checkbox", checked: true },
          {
            type: "multi-select",
            label: "Locker type",
            options: [
              { value: "option1" },
              { value: "option2", label: "Option 2" },
              { value: "option3", label: "Option 3" },
            ],
          },
          {
            type: "number",
            label: "Price",
            default: 6.5,
            min: 0,
            max: 10,
            // icon: 'receipt',
          },
          {
            type: "slider",
            label: "Slider bar",
            min: 10,
            max: 50,
            step: 1,
          },
          {
            type: "textarea",
            label: "Locker description",
            placeholder: "Describe the locker contents",
            description:
              "Description that tells you what this input field does",
          },
          {
            type: "date-range",
            label: "Locker date",
            format: "YYYY-MM-DD",
          },
          {
            type: "color",
            label: "Locker color",
          },
        ],
      },
    },
  ]);
};
