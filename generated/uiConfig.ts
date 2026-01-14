import { customDefu } from '#layers/utilities/shared/functions/custom-defu'
import config0 from '/home/jk/Projects/testing/ui-config'
import config1 from '/home/jk/Projects/testing/node_modules/.c12/github_gentlsro_lib_sW3S6najsc/ui-config'
import config2 from '/home/jk/Projects/testing/node_modules/.c12/github_gentlsro_UI_QwFFjrZXqk/config'

const uiConfigMerged = customDefu(config0, config1, config2)

type WrapObjects<T> = {
  [K in keyof T]: T[K] extends Array<any> | object
    ? T[K] extends null
      ? null
      : () => T[K]
    : T[K];
}

function wrapObjects<T extends Record<string, any>>(obj: T): WrapObjects<T> {
  const result = {} as WrapObjects<T>

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        (result as any)[key] = () => value
      } else {
        (result as any)[key] = value
      }
    }
  }

  return result
}

type WrapProps<T> = {
  [K in keyof T]: T[K] extends { props: infer P }
    ? { props: WrapObjects<P> } & Omit<T[K], "props">
    : T[K];
};

function wrapProps<T extends Record<string, any>>(obj: T): WrapProps<T> {
  const result = {} as WrapProps<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (
        typeof value === "object" &&
        value !== null &&
        "props" in value &&
        typeof value.props === "object" &&
        value.props !== null
      ) {
        (result as any)[key] = {
          ...value,
          props: wrapObjects(value.props),
        };
      } else {
        (result as any)[key] = value;
      }
    }
  }

  return result;
}

export const uiConfig = wrapProps(uiConfigMerged)

export type IUIConfig = typeof uiConfig
export default uiConfig
