
import { AttachmentFileInfo, CamlQuery, Folder, ListItemFormUpdateValue, PagedItemCollection } from "@pnp/sp";
import { IBaseModel } from "../Models/IBaseModel";
import { ISPListProvider } from "./ISPListProvider";

export class Mock_SPListProvider implements ISPListProvider {
  constructor() { }
  

  private items: Array<IBaseModel> = [
    { ID: 1, Title: "teste 1" },
    { ID: 2, Title: "teste 2" },
    { ID: 3, Title: "teste 3" }
  ];

  public async getById(ID: number, listTitle: string): Promise<IBaseModel> {
    let resultItems: Array<IBaseModel> = this.items.filter(i => i.ID == ID);
    if (resultItems.length > 0) {
      return new Promise<IBaseModel>(resolve => resolve(resultItems[0]));
    } else return new Promise<IBaseModel>(resolve => resolve(null));
  }

  public getListItemsCount(listRelativeUrl: string, rootWeb?: boolean): Promise<number> {
      return new Promise<number>(resolve => resolve(this.items.length));
  }
  public delete(itemID: number, listRelativeUrl: string, rootWeb?: boolean): Promise<void> {
    return new Promise<any>(resolve => resolve({}));
  }

  public async getItemsByFilter(
    listTitle: string,
    filter: string,
    rootWeb?: boolean
  ): Promise<Array<IBaseModel>> {
    let resultItems: IBaseModel[] = this.items;
    if (resultItems.length > 0) {
      return new Promise<Array<IBaseModel>>(resolve => resolve(resultItems));
    } else return new Promise<Array<IBaseModel>>(resolve => resolve(null));
  }

  public async getItemsByFilterInLargeLists(
    listTitle: string,
    filter?: string
  ): Promise<Array<IBaseModel>> {
    let resultItems: Array<IBaseModel> = this.items;
    if (resultItems.length > 0) {
      return new Promise<Array<IBaseModel>>(resolve => resolve(resultItems));
    } else return new Promise<Array<IBaseModel>>(resolve => resolve(null));
  }

  public async getLastItemId(listTitle: string): Promise<number> {
    let resultItems: Array<IBaseModel> = this.items.sort((a, b) => {
      return b.ID - a.ID;
    });
    if (resultItems.length > 0) {
      return new Promise<number>(resolve => resolve(resultItems[0].ID));
    } else return new Promise<number>(resolve => resolve(null));
  }

  public async getLastItem(
    listTitle: string,
    filter?: string
  ): Promise<IBaseModel> {
    let resultItems: Array<IBaseModel> = this.items.sort((a, b) => {
      return b.ID - a.ID;
    });
    if (resultItems.length > 0) {
      return new Promise<IBaseModel>(resolve => resolve(resultItems[0]));
    } else return new Promise<IBaseModel>(resolve => resolve(null));
  }

  public async save(item: IBaseModel, listRelativeUrl: string, rootWeb: boolean): Promise<IBaseModel> {
    return new Promise<IBaseModel>(resolve => resolve(item));
  }

  public async addAttachment(
    item: IBaseModel,
    listTitle: string,
    attachments: AttachmentFileInfo[]
  ): Promise<void> {
    return new Promise<any>(resolve => resolve({}));
  }

  public async deleteAttachment(
    item: IBaseModel,
    listRelativeUrl: string,
    attachments: string[]
  ): Promise<void> { }

  public async getAttachments(
    item: IBaseModel,
    listRelativeUrl: string
  ): Promise<any[]> {
    return new Promise<any>(resolve => resolve({}));
  }

  public breakListPermission(
    listTitle: string,
    copyRoleAssignments?: boolean,
    clearSubscopes?: boolean
  ): Promise<any> {
    return new Promise<any>(resolve => resolve({}));
  }

  public async saveToFolder(
    item: IBaseModel,
    listRelativeUrl: string,
    folderName: string
  ): Promise<ListItemFormUpdateValue[]> {
    return new Promise<ListItemFormUpdateValue[]>(resolve => resolve([]));
  }

  public async moveItemToFolder(
    item: IBaseModel,
    toFolderName: string,
    listRelativeUrl: string,
    originalFolderName?: string
  ): Promise<void> {
    return new Promise<any>(resolve => resolve({}));
  }

  public async createFolder(
    folderName: string,
    siteAbsoluteUrl: string,
    listRelativeUrl: string
  ): Promise<boolean> {
    return new Promise<boolean>(resolve => resolve(true));
  }

  public breakFolderPermission(
    folderName: string,
    listRelativeUrl: string,
    copyRoleAssignments?: boolean,
    clearSubscopes?: boolean,
    permissions?: { [key: number]: number }[],
    permissionsRemove?: { [key: number]: number }[]
  ): Promise<any> {
    return new Promise<any>(resolve => resolve({}));
  }

  public async createFolderDocumentLibrary(
    folderName: string,
    listRelativeUrl: string
  ): Promise<Folder | void> {
    return new Promise<Folder | void>(resolve => resolve());
  }

  public async deleteFolderDocumentLibrary(
    folderName: string,
    listRelativeUrl: string
  ): Promise<void> { }

  public async getItemsWithAttachmentsFiltered(listRelativeUrl: string, expanded: string, filter?: string): Promise<Array<IBaseModel>> {
    return new Promise<Array<IBaseModel>>(resolve => resolve(this.items));
  }

  public getItemsPaged(listRelativeUrl: string, top: number, filter?: string, order: boolean = true, elementOrder: string = "ID"): Promise<PagedItemCollection<IBaseModel[]>> {
    let pagedItem: PagedItemCollection<IBaseModel[]>;
    pagedItem.results = this.items;
    if (pagedItem.results.length > 0) {
      return new Promise<PagedItemCollection<IBaseModel[]>>(resolve => resolve(pagedItem));
    } else return new Promise<PagedItemCollection<IBaseModel[]>>(resolve => resolve(null));
  }

  public getItemsByCAMLQueryXML(listRelativeUrl: string, CAMLQuery: CamlQuery): Promise<IBaseModel[]> {
    throw new Error("Method not implemented.");
  }

  /**
   * Get Items using top to limite return
   * @param listRelativeUrl  
   * @param filter which epxression should filter the results
   * @param select which fields the results should have
   * @param exapand which lookup or order types of fields should have be expanded
   * @param order ascending or descending
   * @param elementOrder whici fields should order the query by
   */
  public getItems(listRelativeUrl: string, filter?:string,select?: string[], expand?:string[],  order: boolean = true, elementOrder: string = "ID"): Promise<IBaseModel[]> {
    throw new Error("Method not implemented.");
  }
}
