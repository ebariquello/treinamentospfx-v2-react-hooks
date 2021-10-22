

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISPListProvider } from "./ISPListProvider";

export interface ISPDataProvider {
  /**
   * Site Absolute Url
   */
  siteAbsoluteUrl: string;
  /**
   * Server Relative Url
   */
  serverRelativeUrl: string;
  /**
   * Sharepoint List Provider
   */
  spList: ISPListProvider;

  /**
   * SharePoint WP Context
   */
   context: WebPartContext;
}
