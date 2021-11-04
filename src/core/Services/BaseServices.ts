import { IBaseModel } from "../Models/IBaseModel";
import { CustomProperties } from "../Enums/Enums";
import { IListItemAttachmentFile } from "../Models/IListItemAttachmentFile";
import { ISPDataProvider } from "../Providers/ISPDataProvider";
import { AttachmentFileInfo, CamlQuery, Folder } from "@pnp/sp";



export abstract class BaseServices {
  public abstract itemData: IBaseModel;
  public abstract itemsData: Array<IBaseModel>;
  public abstract listInternalName: string;


  protected _rootWeb: boolean;

  constructor(protected spDataProvider: ISPDataProvider, rootWeb: boolean = false) {
    this._rootWeb = rootWeb;
  }

  // Exposes to any the DataProvider
  public get dataProvider(): ISPDataProvider{
    return this.spDataProvider;
  }

  /**
   * @returns Site Absolute Url
   */
  get siteAbsoluteUrl(): string {
    return this.spDataProvider.siteAbsoluteUrl;
  }

  /**
   * @returns list Absolute Url
   */
  get listAbsoluteUrl(): string {
    return `${this.spDataProvider.siteAbsoluteUrl}/Lists/${this.listInternalName}`;
  }

  /**
   * @returns list Relative Url
   */
  get listRelativeUrl(): string {
    return this._rootWeb
      ? `${this.spDataProvider.context.pageContext.site.serverRelativeUrl}/Lists/${this.listInternalName}`
      : `${this.spDataProvider.serverRelativeUrl}/Lists/${this.listInternalName}`;
  }

  /**
   * Load Item by Id
   * @param ID Item ID
   */
  public async loadItemData(ID: number): Promise<void> {
    let item = await this.spDataProvider.spList.getById(ID, this.listRelativeUrl, this._rootWeb);
    this.itemData = item;
  }

  /**
   * Load Item by Id
   * @param ID Item ID
   */
  public async loadItemsData(filter?: string): Promise<void> {
    let items = await this.spDataProvider.spList.getItemsByFilter(this.listRelativeUrl, filter, this._rootWeb);
    this.itemsData = items;
  }

  /**
   * Load Item by Id
   * @param ID Item ID
   */
  public async loadItemsDataLargeList(filter: string): Promise<void> {
    let items = await this.spDataProvider.spList.getItemsByFilterInLargeLists(
      this.listRelativeUrl,
      filter
    );
    this.itemsData = items;
  }

  /**
   * Save/Update Items in Sharepoint List
   */
  public async saveItems(): Promise<IBaseModel[]> {
    try {
      let promisses = [];
      let indexArray = [];
      for (let index = 0; index < this.itemsData.length; index++) {
        let itemChanged = CustomProperties.ItemChanged;
        if (this.itemsData[index][itemChanged]) {
          delete this.itemsData[index][CustomProperties.ItemChanged]; //Control to update only changed item
          promisses.push(
            this.spDataProvider.spList.save(this.itemsData[index], this.listRelativeUrl, this._rootWeb)
          );
          indexArray.push(index);
          this.itemsData[index][CustomProperties.ItemChanged] = true;
        }
      }
      await Promise.all(promisses).then(item => {
        for (let index = 0; index < item.length; index++) {
          this.itemsData[indexArray[index]] = item[index];
        }
      });
      return this.itemsData;
    } catch (err) {
      console.log(err);
      return this.itemsData;
    }
  }

  /**
   * Save/Update Items in Sharepoint List
   */
  public async saveItemsInFolder(folderName: string | number): Promise<IBaseModel[]> {
    try {
      let promissesNewItem = [];
      let promissesUpdateItem = [];
      for (let index = 0; index < this.itemsData.length; index++) {
        if (!this.itemsData[index].ID) {
          promissesNewItem.push(
            this.spDataProvider.spList.save(this.itemsData[index], this.listRelativeUrl, this._rootWeb)
          );
        } else {
          promissesUpdateItem.push(
            this.spDataProvider.spList.save(this.itemsData[index], this.listRelativeUrl, this._rootWeb)
          );
        }
      }
      let promissesMoveToFolder = [];
      await Promise.all(promissesNewItem).then(item => {
        for (let index = 0; index < item.length; index++) {
          this.itemsData[index] = item[index];
          promissesMoveToFolder.push(
            this.spDataProvider.spList.moveItemToFolder(
              this.itemsData[index],
              `${folderName}`,
              this.listRelativeUrl,
              "",
              this._rootWeb
            )
          );
        }
      });
      if (promissesMoveToFolder.length > 0) await Promise.all(promissesMoveToFolder);
      return this.itemsData;
    } catch {
      return this.itemsData;
    }
  }

  /**
   * Save/Update Item in Sharepoint List
   */
  public async save(attachments?: AttachmentFileInfo []): Promise<void> {
    let itemSaved = await this.spDataProvider.spList.save(this.itemData, this.listRelativeUrl, this._rootWeb);
    this.itemData = itemSaved;

    if (attachments)
      await this.spDataProvider.spList.addAttachment(
        this.itemData,
        this.listRelativeUrl,
        attachments,
        this._rootWeb
      );
  }

  public deleteAttachments(attachments: string[]): Promise<void> {
    return this.spDataProvider.spList.deleteAttachment(
      this.itemData,
      this.listRelativeUrl,
      attachments,
      this._rootWeb
    );
  }

  public async getAttachments(): Promise<IListItemAttachmentFile[]> {
    let result: IListItemAttachmentFile[] = [];
    let files: any[] = await this.spDataProvider.spList.getAttachments(
      this.itemData,
      this.listRelativeUrl,
      this._rootWeb
    );
    if (files && files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        result.push({
          FileName: file.FileName,
          ServerRelativeUrl: file.ServerRelativeUrl
        });
      }
    }
    return result;
  }

  /**
   * Save/Update Item in Sharepoint List in a specific folder
   * @param folderName Folder Name
   */
  public async saveInFolder(
    folderName: string | number,
    attachments?: AttachmentFileInfo[]
  ): Promise<IBaseModel> {
    let notMove = this.itemData.ID > 0;
    let itemSaved = await this.spDataProvider.spList.save(this.itemData, this.listRelativeUrl, this._rootWeb);
    this.itemData = itemSaved;
    if (!notMove) await this.moveItemToFolder(`${folderName}`);
    if (attachments)
      await this.spDataProvider.spList.addAttachment(
        this.itemData,
        this.listRelativeUrl,
        attachments,
        this._rootWeb
      );
    return this.itemData;
  }

  /**
   * Move Item in Sharepoint List to a specific folder
   * @param folderName Folder Name
   */
  public async moveItemToFolder(toFolderName: string, originalFolderName?: string): Promise<void> {
    return this.spDataProvider.spList.moveItemToFolder(
      this.itemData,
      toFolderName,
      this.listRelativeUrl,
      originalFolderName,
      this._rootWeb
    );
  }

  /**
   * Create Folder in Sharepoint List
   * @param folderName Folder Name
   * @returns new Folder
   */
  public async createFolder(folderName: string): Promise<Boolean> {
    return this.spDataProvider.spList.createFolder(
      folderName,
      this.siteAbsoluteUrl,
      this.listRelativeUrl,
      this._rootWeb
    );
  }

  /**
   * Break folder Permission and add permission
   * @param folderName Folder Name
   * @param copyRoleAssignments If true the permissions are copied from the current parent scope
   * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
   * @param permissions List of permissions `[{principalId:roleDefId}]` ex: `[{1:2,2,2},{1:3,2:3}]` will add permission 2 to user/group 1 and 2 and add permission 3  to user 1 and 2
   *
   */
  public async breakFolderPermission(
    folderName: string,
    copyRoleAssignments?: boolean,
    clearSubscopes?: boolean,
    permissionsAdd?: { [key: number]: number }[],
    permissionsRemove?: { [key: number]: number }[]
  ): Promise<void> {
    return this.spDataProvider.spList.breakFolderPermission(
      folderName,
      this.listRelativeUrl,
      copyRoleAssignments,
      clearSubscopes,
      permissionsAdd,
      permissionsRemove,
      this._rootWeb
    );
  }

  /**
   * Create Folder in Sharepoint List
   * @param folderName Folder Name
   * @returns New Folder
   */
  public async createFolderDocumentLibrary(folderName: string): Promise<Folder | void> {
    return this.spDataProvider.spList.createFolderDocumentLibrary(folderName, this.listRelativeUrl, this._rootWeb);
  }

  /**
   * Delete Folder in Sharepoint List
   * @param folderName Folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   */
  public async deleteFolderDocumentLibrary(folderName: string): Promise<void> {
    return this.spDataProvider.spList.deleteFolderDocumentLibrary(folderName, this.listRelativeUrl, this._rootWeb);
  }

  /**
   * Get Items using filter
   * Expands a field
   * @param listRelativeUrl Sharepoint List relative URL
   * @param filter filter
   * @param expanded: field to be expanded
   */
  public async getItemsWithAttachmentsFiltered(expanded: string, filter?: string): Promise<void> {
    let items = await this.spDataProvider.spList.getItemsWithAttachmentsFiltered(this.listRelativeUrl, expanded, filter, this._rootWeb);
    this.itemsData = items;
  }

  /**
   * Load top limit and Paginate.
   * Usage for large list items
   * @param top
   * @param filter
   */
  public async loadItemsTopPaginate(top: number, filter?: string): Promise<void> {
    let items = await this.spDataProvider.spList.getItemsPaged(this.listRelativeUrl, top, filter, true, "ID", this._rootWeb);
    this.itemsData = items.results;
    while (items.hasNext) {
      items = await items.getNext();
      Array.prototype.push.apply(this.itemsData, items.results);
    }
  }

  /**
   * Load Item by Category using Caml Query
   * @param CAMLQuery Object with Caml Query
   */
  public async loadItemsDataCAMLQuery(CAMLQuery: CamlQuery): Promise<void> {
    let items = await this.spDataProvider.spList.getItemsByCAMLQueryXML(this.listRelativeUrl, CAMLQuery, this._rootWeb);
    this.itemsData = items;
  }
}
