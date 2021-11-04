
import { AttachmentFileInfo, CamlQuery, Folder, ListItemFormUpdateValue, PagedItemCollection } from "@pnp/sp";
import { IBaseModel } from "../Models/IBaseModel";

export interface ISPListProvider {
  /**
   * Get Item by ID
   * @param ID Item ID
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getById(ID: number, listRelativeUrl: string, rootWeb?: boolean): Promise<IBaseModel>;

  /**
   * Get Items using filter
   * WARNING: use this method only in small lists
   * Use getItemsByFilterInLargeLists in large lists
   * @param filter filter
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getItemsByFilter(
    listRelativeUrl: string,
    filter?: string,
    rootWeb?: boolean
  ): Promise<Array<IBaseModel>>;

  /**
   * Get Items using top to limite return
   * @param listRelativeUrl  
   * @param filter which epxression should filter the results
   * @param select which fields the results should have
   * @param exapand which lookup or order types of fields should have be expanded
   * @param order ascending or descending
   * @param elementOrder whici fields should order the query by
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getItems(
    listRelativeUrl: string,
    filter?: string,
    select?:string[],
    expand?:string[],
    order?: boolean,
    elementOrder?: string,
    rootWeb?: boolean
  ): Promise<IBaseModel[]>;

  /**
   * Get Items using top to limite return
   * @param listRelativeUrl  
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
   getListItemsCount(
    listRelativeUrl: string,
    rootWeb?: boolean
  ): Promise<number>;

  /**
   * Get Items using filter - Filter the results in batch.
   * @param filter filter
   * @param listRelativeUrl Sharepoint List relative URL
   */
  getItemsByFilterInLargeLists(
    listRelativeUrl: string,
    filter: string
  ): Promise<Array<IBaseModel>>;

  /**
   * Get Items using top to limite return
   * @param listRelativeUrl 
   * @param top 
   * @param filter 
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getItemsPaged(
    listRelativeUrl: string,
    top: number,
    filter?: string,
    order?: boolean,
    elementOrder?: string,
    rootWeb?: boolean
  ): Promise<PagedItemCollection<IBaseModel[]>>;

  /**
   * Get the last item ID of the list.
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getLastItemId(listRelativeUrl: string, rootWeb?: boolean): Promise<number>;

  /**
   * Get the last item of the list.
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getLastItem(listRelativeUrl: string, filter?: string, rootWeb?: boolean);

  /**
   * Save/Update Item in Sharepoint List
   * @param item add/update item in Sharepoint List
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns Item Saved
   */
  save(item: IBaseModel, listRelativeUrl: string, rootWeb?: boolean): Promise<IBaseModel>;

  /**
   * Save/Update Item in Sharepoint List
   * @param item Checks if the item do exists and attach the attachment to it
   * @param listRelativeUrl Sharepoint List relative URL
   * @param attachments List of attachments to be saved
   * @returns Attachments Saved
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  addAttachment(
    item: IBaseModel,
    listRelativeUrl: string,
    attachments: AttachmentFileInfo[],
    rootWeb?: boolean
  ): Promise<void>;

  /**
   * Get list item Attachment
   * @param item List item
   * @param listRelativeUrl SharePoint list relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default) 
   */
  getAttachments(item: IBaseModel, listRelativeUrl: string, rootWeb?: boolean): Promise<any[]>;

  /**
   * Delete list Attachment
   * @param item List item
   * @param listRelativeUrl SharePoint list relative URL 
   * @param attachments Attachments
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default) 
   */
  deleteAttachment(
    item: IBaseModel,
    listRelativeUrl: string,
    attachments: string[],
    rootWeb?: boolean
  ): Promise<void>;

  /**
   * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
   *
   * @param listRelativeUrl Sharepoint List relative URL
   * @param copyRoleAssignments If true the permissions are copied from the current parent scope
   * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  breakListPermission(
    listRelativeUrl: string,
    copyRoleAssignments?: boolean,
    clearSubscopes?: boolean,
    rootWeb?: boolean
  ): Promise<any>;

  /**
   * Currently with bug DO NOT USE. create item with only Title and then update with ID and the rest of the properties
   * Save/Update Item in Sharepoint List
   * @param item add/update item in Sharepoint List
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns Item Saved
   */
  saveToFolder(
    item: IBaseModel,
    listRelativeUrl: string,
    folderName: string,
    rootWeb?: boolean
  ): Promise<ListItemFormUpdateValue[]>;

  /***
   * Move a Item to a specific folder
   * @param item add/update item in Sharepoint List
   * @param originalFolderName original folder name
   * @param toFolderName destine folder name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  moveItemToFolder(
    item: IBaseModel,
    toFolderName: string,
    listRelativeUrl: string,
    originalFolderName?: string,
    rootWeb?: boolean
  ): Promise<void>;

  /**
   * Create Folder in Sharepoint List
   * @param folderName Folder Name
   * @param siteAbsoluteUrl Sharepoint Site Absolute URL
   * @param listRelativeUrl Sharepoint List Relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns true if folder was created
   */
  createFolder(
    folderName: string,
    siteAbsoluteUrl: string,
    listRelativeUrl: string,
    rootWeb?: boolean
  ): Promise<boolean>;

  /***
   * Break folder Permission and add permission
   * @param folderName Folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param copyRoleAssignments If true the permissions are copied from the current parent scope
   * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
   * @param permissions List of permissions `[{principalId:roleDefId}]` ex: `[{1:2,2,2},{1:3,2:3}]` will add permission 2 to user/group 1 and 2 and add permission 3  to user 1 and 2
   * @param permissions List of permissions `[{principalId:roleDefId}]` ex: `[{1:2,2,2},{1:3,2:3}]` will remove permission 2 to user/group 1 and 2 and remove permission 3  to user 1 and 2
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  breakFolderPermission(
    folderName: string,
    listRelativeUrl: string,
    copyRoleAssignments?: boolean,
    clearSubscopes?: boolean,
    permissions?: { [key: number]: number }[],
    permissionsRemove?: { [key: number]: number }[],
    rootWeb?: boolean
  ): Promise<any>;

  /**
   * Create Folder in Sharepoint Document Library
   * @param folderName folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns Folder
   */
  createFolderDocumentLibrary(
    folderName: string,
    listRelativeUrl: string,
    rootWeb?: boolean
  ): Promise<Folder |void>;

  /**
   * Delete Folder in Sharepoint Document Library
   * @param folderName Folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  deleteFolderDocumentLibrary(
    folderName: string,
    listRelativeUrl: string,
    rootWeb?: boolean
  ): Promise<void>;

  /**
   * Delete Folder in Sharepoint Document Library
   * @param itemID Item ID
   * @param listRelativeUrl Sharepoint List relative URL
   *  * @param rootWeb IWeb context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
   delete(
    itemID: number,
    listRelativeUrl: string,
    rootWeb?: boolean
  ): Promise<void>;

  /**
   * Get Items using filter
   * Expands a field
   * @param listRelativeUrl Sharepoint List relative URL
   * @param filter filter
   * @param expanded: field to be expanded
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getItemsWithAttachmentsFiltered(listRelativeUrl: string, expanded: string, filter?: string, rootWeb?: boolean): Promise<Array<IBaseModel>>;

  /**
   * Get Items using Caml Query
   * @param listRelativeUrl Sharepoint List relative URL
   * @param CAMLQuery Object with the query xml
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  getItemsByCAMLQueryXML(listRelativeUrl: string, CAMLQuery: CamlQuery, rootWeb?: boolean): Promise<Array<IBaseModel>>;
}
