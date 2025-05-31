// check if env is in regular browser or CEF
export const isEnvBroswer = () => typeof window !== 'undefined' && typeof (window as any).invokeNative !== 'function'

export const noop = () => {};