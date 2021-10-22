import { Environment, EnvironmentType } from "@microsoft/sp-core-library";

import { sp, SPRest } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISPDataProvider } from "../Providers/ISPDataProvider";
import { SPDataProvider } from "../Providers/SPDataProvider";

export class DataFactory {
  public static getSPDataProvider(
    webPartContext: WebPartContext
  ): ISPDataProvider {
    sp.setup({
      spfxContext: webPartContext,
    });
    if (
      Environment.type === EnvironmentType.SharePoint ||
      Environment.type === EnvironmentType.ClassicSharePoint
    ) {
      return new SPDataProvider(sp, webPartContext);
    } else if (Environment.type === EnvironmentType.Local) {
      throw new Error("Unexecpted Condition"); 
    }
  }
}
