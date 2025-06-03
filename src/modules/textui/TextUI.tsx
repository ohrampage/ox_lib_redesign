import { Separator } from "@/components/ui/separator";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { cn } from "@/lib/utils";
import type { TextUIProps } from "@/types";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

const wrapperVariants = cva("h-full w-full absolute flex", {
  variants: {
    position: {
      center: "items-center justify-center",
      "top-center": "items-baseline justify-center",
      "bottom-center": "items-end justify-center",
      "left-center": "items-center justify-start",
      "right-center": "items-center justify-end",
    },
    visible: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    position: "right-center",
  },
});

const Wrapper = ({
  children,
  variants,
}: {
  children: React.ReactNode;
  variants: VariantProps<typeof wrapperVariants>;
}) => (
  <div
    className={cn(
      wrapperVariants({
        visible: variants.visible,
        position: variants.position,
      })
    )}
  >
    {children}
  </div>
);

export const TextUI = () => {
  const [data, setData] = useState<TextUIProps>({
    text: "",
    position: "right-center",
  });
  const [visible, setVisible] = useState(false);

  useNuiEvent<TextUIProps>("textUi", (data) => {
    if (!data.position) data.position = "right-center";
    setData(data);
    setVisible(true);
  });

  useNuiEvent("textUiHide", () => setVisible(false));

  return (
    <Wrapper variants={{ visible, position: data.position }}>
      <div
        className="flex gap-2 text-base py-3 px-4 m-4 bg-gray-50/90 text-gray-900/90 rounded-sm relative"
        style={data.style ? data.style : {}}
      >
        <div className="flex items-center gap-3">
          {data.interactKey && (
            <>
              <div className="grid place-items-center text-sm leading-[21px] w-5 h-5 rounded-xs bg-gray-900 text-gray-50">
                <span className="text-sm leading-1 text-center align-middle font-medium">
                  {data.interactKey}
                </span>
              </div>
              <Separator orientation="vertical" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-base leading-1">{data.text}</p>
          {data.icon && (
            <span
              className={`${data.icon} fill-${data.iconColor} ${
                !data.alignIcon || data.alignIcon === "center"
                  ? "self-center"
                  : "self-start"
              }`}
            ></span>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
