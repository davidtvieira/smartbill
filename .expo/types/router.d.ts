/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/screens/AddSmartBill/AddSmartBill`; params?: Router.UnknownInputParams; } | { pathname: `/screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill`; params?: Router.UnknownInputParams; } | { pathname: `/screens/HomeScreen/HomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/HomeScreen/styleHomeScreen`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/AddSmartBill/AddSmartBill`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/HomeScreen/HomeScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/HomeScreen/styleHomeScreen`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/screens/AddSmartBill/AddSmartBill${`?${string}` | `#${string}` | ''}` | `/screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill${`?${string}` | `#${string}` | ''}` | `/screens/HomeScreen/HomeScreen${`?${string}` | `#${string}` | ''}` | `/screens/HomeScreen/styleHomeScreen${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/screens/AddSmartBill/AddSmartBill`; params?: Router.UnknownInputParams; } | { pathname: `/screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill`; params?: Router.UnknownInputParams; } | { pathname: `/screens/HomeScreen/HomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/HomeScreen/styleHomeScreen`; params?: Router.UnknownInputParams; };
    }
  }
}
