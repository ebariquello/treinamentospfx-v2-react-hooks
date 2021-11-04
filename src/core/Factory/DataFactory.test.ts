/// <reference types="jest" />
import {DataFactory} from './DataFactory';
import { assert } from "chai";
import { mount, configure } from 'enzyme';
import * as  Adapter from 'enzyme-adapter-react-16';
import * as React from "react";

import { SPHttpClient } from '@pnp/sp';
import { Mock_SPListProvider } from '../Providers/Mock_SPListProvider';
import { Mock_SPDataProvider } from '../Providers/Mock_SPDataProvider';


jest.mock("@microsoft/sp-http", () => {
	return {
		SPHttpClient: {
			configurations: {
				v1: 1,
			},
		},
		HttpClient: {
			configurations: {
				v1: 1,
			},
		},
	};
});
jest.mock("@microsoft/sp-core-library", () => {
  return {
    Environment:{type: "Local"},
    EnvironmentType: { Local: "Local" }
  };
});
fdescribe('SharePoint model', () => {
    let mockedWebPartContext: any;
    beforeEach(()=>{
      jest.mock("@microsoft/sp-core-library", () => {
        return {
          Environment: {},
          EnvironmentType: {}
        };
      });
      mockedWebPartContext = {
        pageContext: {
            web: {
                absoluteUrl: "http://test.sharepoint.com/sites/dev"
            }
        },
        spHttpClient: {
        // spHttpClient: {
            get: (url, configVersion) => {
                if (url === "http://test.sharepoint.com/sites/dev/_api/web/lists/getByTitle('Events')/items") {
                    return Promise.resolve({
                        json: () => {
                            return Promise.resolve({
                                value: [{
                                    Id: 1,
                                    Title: "Test 1",
                                    Link: "http://test_event_1",
                                    Category: "Test"
                                }, {
                                    Id: 2,
                                    Title: "Test 2",
                                    Link: "http://test_event_2",
                                    Category: "Test"
                                }, {
                                    Id: 3,
                                    Title: "Test 3",
                                    Link: "http://test_event_3",
                                    Category: "Off-Work"
                                }]
                            });
                        }
                    });
                }
            }
        }
      };
    });
    it('should create a SharePoint instance with mocked context', () => {
        jest.mock("@microsoft/sp-core-library", () => {
          return {
            Environment:{type: "Local"},
            EnvironmentType: { Local: "Local" }
          };
        });
        let provider = DataFactory.getSPDataProvider(mockedWebPartContext);

        console.log(provider);

        expect(provider).toBeInstanceOf(Mock_SPDataProvider);

    }); 

    it('should create a SharePoint instance with SPDataProvider', () => {
      jest.mock("@microsoft/sp-core-library", () => {
        return {
          Environment:{type: "SharePoint"},
          EnvironmentType: { SharePoint: "SharePoint" }
        };
      });
      let provider = DataFactory.getSPDataProvider(mockedWebPartContext);

      console.log(provider);

      expect(provider).toBeInstanceOf(Mock_SPDataProvider);

  }); 

});