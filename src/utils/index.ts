// check if env is in regular browser or CEF
export const isEnvBroswer = () =>
  typeof window !== "undefined" && typeof (window as any).invokeNative !== "function";

export const noop = () => {};

export const isIconUrl = (icon: string) =>
  icon.includes("://") ||
  icon.startsWith("data:") ||
  icon.includes(".png") ||
  icon.includes(".webp");

// yoinked from https://github.com/project-error/npwd/blob/d8dc5b7f47faf5fc581ffee30f31ff61d184cfe7/phone/src/os/phone/hooks/useClipboard.ts#L1
export const setClipboard = (value: string) => {
  const clipElem = document.createElement("textarea");
  clipElem.value = value;
  document.body.appendChild(clipElem);
  clipElem.select();
  document.execCommand("copy");
  document.body.removeChild(clipElem);
};
