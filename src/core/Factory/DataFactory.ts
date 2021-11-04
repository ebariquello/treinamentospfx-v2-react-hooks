import { Environment, EnvironmentType } from "@microsoft/sp-core-library";


import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISPDataProvider } from "../Providers/ISPDataProvider";
import { SPDataProvider } from "../Providers/SPDataProvider";
import { Mock_SPDataProvider } from "../Providers/Mock_SPDataProvider";
import { sp } from "@pnp/sp";

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
      return new Mock_SPDataProvider();
    }
  }
}
