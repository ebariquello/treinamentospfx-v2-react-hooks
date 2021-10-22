import { ISPDataProvider } from "../../../core/Providers/ISPDataProvider";

export interface ISimpleCRUDProps {
  description?: string;
  filterTitle?: string;
  list: string;
  spDataProvider: ISPDataProvider;
}

