import * as React from "react";
import * as ReactDom from "react-dom";
import { UrlQueryParameterCollection, Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "SimpleCRUDWPStrings";
import SimpleCRUD from "./components/SimpleCRUD";
import { ISimpleCRUDProps } from "./components/ISimpleCRUDProps";

import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";

import "bootstrap/dist/css/bootstrap.min.css";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { DataFactory } from "../../core/Factory/DataFactory";

export interface ISimpleCRUDWPProps {
  description: string;
  filterTitle: string;
  list: string;
}

export default class SimpleCRUDWP extends BaseClientSideWebPart<ISimpleCRUDWPProps> {
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      sp.setup({
        spfxContext: this.context,
      });
    });
  }

  public async render(): Promise<void> {
    let queryParms = new UrlQueryParameterCollection(window.location.href);
    if (queryParms.getValue("customWorkbenchStyles") ? true : false) {
      await import("../../core/styles/customWorkbenchStyles.module.scss");
    }
    const element: React.ReactElement<ISimpleCRUDProps> = React.createElement(
      SimpleCRUD,
      {
        description: this.properties.description,
        filterTitle: this.properties.filterTitle,
        list: this.properties.list,
        spDataProvider: DataFactory.getSPDataProvider(this.context),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Configurações SimpleCRUD WP",
          },
          groups: [
            {
              groupName: "Informações",
              groupFields: [
                PropertyPaneTextField("filterTitle", {
                  label: "Filtar Por",
                }),
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),

                PropertyFieldListPicker("list", {
                  label: "Select a list",
                  selectedList: this.properties.list,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: "listPickerFieldId",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
