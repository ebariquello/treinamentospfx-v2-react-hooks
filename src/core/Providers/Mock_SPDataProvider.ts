import { ISPDataProvider } from "./ISPDataProvider";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Mock_SPListProvider } from "./Mock_SPListProvider";
export class Mock_SPDataProvider implements ISPDataProvider {
  public context: WebPartContext;
  public spList: Mock_SPListProvider;

  public serverRelativeUrl: string;
  public siteAbsoluteUrl: string;

  constructor() {
    this.spList = new Mock_SPListProvider();

  }
}
