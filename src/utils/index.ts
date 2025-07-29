// check if env is in regular browser or CEF
export const isEnvBroswer = () =>
  typeof window !== "undefined" &&
  typeof (window as any).invokeNative !== "function";

export const noop = () => {};

export const isIconUrl = (icon: string) =>
  icon.includes("://") ||
  icon.startsWith("data:") ||
  icon.includes(".png") ||
  icon.includes(".webp");
