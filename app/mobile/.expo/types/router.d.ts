/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `/garage`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/map`; params?: Router.UnknownInputParams; } | { pathname: `/onboarding`; params?: Router.UnknownInputParams; } | { pathname: `/route-selection`; params?: Router.UnknownInputParams; } | { pathname: `/saved-routes`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/dashboard`; params?: Router.UnknownOutputParams; } | { pathname: `/garage`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/map`; params?: Router.UnknownOutputParams; } | { pathname: `/onboarding`; params?: Router.UnknownOutputParams; } | { pathname: `/route-selection`; params?: Router.UnknownOutputParams; } | { pathname: `/saved-routes`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/dashboard${`?${string}` | `#${string}` | ''}` | `/garage${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/map${`?${string}` | `#${string}` | ''}` | `/onboarding${`?${string}` | `#${string}` | ''}` | `/route-selection${`?${string}` | `#${string}` | ''}` | `/saved-routes${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `/garage`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/map`; params?: Router.UnknownInputParams; } | { pathname: `/onboarding`; params?: Router.UnknownInputParams; } | { pathname: `/route-selection`; params?: Router.UnknownInputParams; } | { pathname: `/saved-routes`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
