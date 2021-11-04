import { WebPartContext } from "@microsoft/sp-webpart-base";

import { ISPListProvider } from "./ISPListProvider";
import { IBaseModel } from "../Models/IBaseModel";
import { AttachmentFileInfo, CamlQuery, Folder, FolderAddResult, ItemAddResult, ListItemFormUpdateValue, PagedItemCollection, SPRest, Web } from "@pnp/sp";

export class SPListProvider implements ISPListProvider {
  constructor(
    protected readonly spRest: SPRest,
    protected readonly webPartContext: WebPartContext
  ) {}
  public readonly restItemLimit: number = 5000;

  /**
   * Get Item by Id
   * @param ID Item ID
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public getById(
    ID: number,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<IBaseModel> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return spWeb.getList(listRelativeUrl).items.getById(ID).get();
  }

  /**
   * Get Items using filter
   * Warning use this method only in small lists
   * Use getItemsByFilterInLargeLists in large lists
   * @param listRelativeUrl Sharepoint List relative URL
   * @param filter filter
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public getItemsByFilter(
    listRelativeUrl: string,
    filter?: string,
    rootWeb: boolean = false
  ): Promise<Array<IBaseModel>> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return filter
      ? spWeb.getList(listRelativeUrl).items.filter(filter).get()
      : spWeb.getList(listRelativeUrl).items.get();
  }

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
  public getItems(
    listRelativeUrl: string,
    filter?: string,
    select?: string[],
    expand?: string[],
    order: boolean = true,
    elementOrder: string = "ID",
    rootWeb: boolean = false
  ): Promise<IBaseModel[]> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    if (filter && select && expand) {
      return spWeb
        .getList(listRelativeUrl)
        .items.filter(filter)
        .select(...select)
        .expand(...expand)
        .orderBy(elementOrder, order)
        .get();
    } else if (filter && select && !expand) {
      return spWeb
        .getList(listRelativeUrl)
        .items.filter(filter)
        .select(...select)
        .orderBy(elementOrder, order)
        .get();
    } else if (filter && !select && !expand) {
      return spWeb
        .getList(listRelativeUrl)
        .items.filter(filter)
        .orderBy(elementOrder, order)
        .get();
    } else if (filter && !select && expand) {
      return spWeb
        .getList(listRelativeUrl)
        .items.filter(filter)
        .expand(...expand)
        .orderBy(elementOrder, order)
        .get();
    } else if (!filter && select && expand) {
      return spWeb
        .getList(listRelativeUrl)
        .items.select(...select)
        .expand(...expand)
        .orderBy(elementOrder, order)
        .get();
    } else {
      return spWeb
        .getList(listRelativeUrl)
        .items.expand(...expand)
        .orderBy(elementOrder, order)
        .get();
    }
  }

  /**
   * Get Items using top to limite return
   * @param listRelativeUrl
   * @param filter which epxression should filter the results
   * @param exapand which lookup or order types of fields should have be expanded
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async getListItemsCount(
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<number> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;

    const result = await spWeb.getList(listRelativeUrl).get();
    return result.ItemCount;
  }

  /**
   * Get Items using filter - Filter the results in batch.
   * @param listRelativeUrl Sharepoint List relative URL
   * @param filter filter
   */
  public async getItemsByFilterInLargeLists(
    listRelativeUrl: string,
    filter: string
  ): Promise<Array<IBaseModel>> {
    let results: Array<IBaseModel> = [];
    let lastID = await this.getLastItemId(listRelativeUrl);
    if (lastID < this.restItemLimit) {
      results = await this.getItemsByFilter(listRelativeUrl, filter);
      return results;
    } else {
      let firstIdBatch = 0;
      while (firstIdBatch < lastID) {
        let lastIdBatch =
          firstIdBatch + this.restItemLimit > lastID
            ? lastID
            : firstIdBatch + this.restItemLimit;
        let filterBatch = `ID ${
          lastIdBatch == lastID ? "le" : "lt"
        } ${lastIdBatch} and ID gt ${firstIdBatch} and (${filter})`;
        let batchResults = await this.getItemsByFilter(
          listRelativeUrl,
          filterBatch
        );
        firstIdBatch = lastIdBatch;
        results.push(...batchResults);
      }
      return results;
    }
  }

  /**
   * Get the last item ID of the list.
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async getLastItemId(
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<number> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    let itemsResult = await spWeb
      .getList(listRelativeUrl)
      .items.select("ID")
      .top(1)
      .orderBy("ID", false)
      .get();
    return itemsResult && itemsResult.length > 0 ? itemsResult[0].ID : 0;
  }

  /**
   * Get the last item of the list.
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async getLastItem(
    listRelativeUrl: string,
    filter?: string,
    rootWeb: boolean = false
  ): Promise<IBaseModel> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    const results = filter
      ? await spWeb
          .getList(listRelativeUrl)
          .items.filter(filter)
          .top(1)
          .orderBy("ID", false)
          .get()
      : await spWeb
          .getList(listRelativeUrl)
          .items.top(1)
          .orderBy("ID", false)
          .get();
    return results ? results[0] : null;
  }

  /**
   * Save/Update Item in Sharepoint List
   * @param item add/update item in Sharepoint List
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns Item Saved
   */
  public async save(
    item: IBaseModel,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<IBaseModel> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    let propsToDelete: string[] = [];
    Object.keys(item).forEach((key) => {
      if (key.indexOf("StringId") >= 0) {
        propsToDelete.push(key);
      }
    });

    for (let index = propsToDelete.length - 1; index >= 0; index--) {
      delete item[propsToDelete[index]];
    }

    if (!item.ID || item.ID <= 0) {
      const resultAdd: ItemAddResult = await spWeb
        .getList(listRelativeUrl)
        .items.add({ ...item });
      item = resultAdd.data;
    } else {
      try {
        await spWeb
          .getList(listRelativeUrl)
          .items.getById(item.ID)
          .update({ ...item });
      } catch (err) {
        console.log(err);
      }
    }
    return item;
  }

  /**
   * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
   *
   * @param listRelativeUrl Sharepoint List relative URL
   * @param copyRoleAssignments If true the permissions are copied from the current parent scope
   * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public breakListPermission(
    listRelativeUrl: string,
    copyRoleAssignments?: boolean,
    clearSubscopes?: boolean,
    rootWeb: boolean = false
  ): Promise<any> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return spWeb
      .getList(listRelativeUrl)
      .breakRoleInheritance(copyRoleAssignments, clearSubscopes);
  }

  /**
   * Currently with bug DO NOT USE. create item with only Title and then update with ID and the rest of the properties
   * Save/Update Item in Sharepoint List
   * @param item add/update item in Sharepoint List
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns Item Saved
   */
  public async saveToFolder(
    item: IBaseModel,
    listRelativeUrl: string,
    folderName: string,
    rootWeb: boolean = false
  ): Promise<ListItemFormUpdateValue[]> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    let propsToDelete: string[] = [];
    Object.keys(item).forEach((key) => {
      if (key.indexOf("StringId") >= 0) {
        propsToDelete.push(key);
      }
    });

    for (let index = propsToDelete.length - 1; index >= 0; index--) {
      delete item[propsToDelete[index]];
    }

    if (!item.ID || item.ID <= 0) {
      return spWeb
        .getList(listRelativeUrl)
        .addValidateUpdateItemUsingPath(
          this.convertObjToListItemFormUpdateValue(item),
          `${listRelativeUrl}/${folderName}`
        );
    } else {
      return spWeb
        .getList(listRelativeUrl)
        .items.getById(item.ID)
        .validateUpdateListItem(this.convertObjToListItemFormUpdateValue(item));
    }
  }

  /***
   * Move a Item to a specific folder
   * @param item add/update item in Sharepoint List
   * @param originalFolderName original folder name
   * @param toFolderName destine folder name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async moveItemToFolder(
    item: IBaseModel,
    toFolderName: string,
    listRelativeUrl: string,
    originalFolderName?: string,
    rootWeb: boolean = false
  ): Promise<void> {
    const spWeb = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return spWeb
      .getFileByServerRelativeUrl(
        originalFolderName
          ? `${listRelativeUrl}/${originalFolderName}/${item.ID}_.000`
          : `${listRelativeUrl}/${item.ID}_.000`
      )
      .moveTo(`${listRelativeUrl}/${toFolderName}/${item.ID}_.000`);
  }

  /**
   *
   * @param item object that will be converted to `ListItemFormUpdateValue`
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns converted object to `ListItemFormUpdateValue`
   */
  public convertObjToListItemFormUpdateValue(
    item: any,
    rootWeb: boolean = false
  ): ListItemFormUpdateValue[] {
    let props: ListItemFormUpdateValue[] = [];
    Object.keys(item).forEach((e) =>
      props.push({ FieldName: e, FieldValue: item[e] })
    );
    return props;
  }

  /**
   * Create Folder in Sharepoint List
   * @param folderName Folder Name
   * @param siteAbsoluteUrl Sharepoint Site Absolute URL
   * @param listRelativeUrl Sharepoint List Relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns true if folder was created
   */
  public async createFolder(
    folderName: string,
    siteAbsoluteUrl: string,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<boolean> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    try {
      await spWeb
        .getList(listRelativeUrl)
        .rootFolder.folders.getByName(folderName)
        .getItem();
    } catch {
      await spWeb
        .getList(listRelativeUrl)
        .rootFolder.folders.add(folderName)
        .then((response) => {
          //return true;
          return response.data != null;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }
    return false;
  }

  /***
   * Break folder Permission and add permission
   * @param folderName Folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param copyRoleAssignments If true the permissions are copied from the current parent scope
   * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
   * @param permissions List of permissions `[{principalId:roleDefId}]` ex: `[{1:2,2,2},{1:3,2:3}]` will add permission 2 to user/group 1 and 2 and add permission 3  to user 1 and 2
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async breakFolderPermission(
    folderName: string,
    listRelativeUrl: string,
    copyRoleAssignments?: boolean,
    clearSubscopes?: boolean,
    permissionsAdd?: { [key: number]: number }[],
    permissionsRemove?: { [key: number]: number }[],
    rootWeb: boolean = false
  ): Promise<any> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    await this.resetFolderPermission(folderName, listRelativeUrl);
    const folderItem = await spWeb
      .getList(listRelativeUrl)
      .rootFolder.folders.getByName(folderName)
      .getItem();
    await folderItem.breakRoleInheritance(copyRoleAssignments, clearSubscopes);
    let arrayPromises = [];
    if (permissionsAdd) {
      permissionsAdd.forEach((p) => {
        Object.keys(p).forEach((e) =>
          arrayPromises.push(folderItem.roleAssignments.add(parseInt(e), p[e]))
        );
      });
    }
    if (permissionsRemove) {
      permissionsRemove.forEach((p) => {
        Object.keys(p).forEach((e) =>
          arrayPromises.push(
            folderItem.roleAssignments.remove(parseInt(e), p[e])
          )
        );
      });
    }
    if (arrayPromises.length > 0) return Promise.all(arrayPromises);
    else return new Promise<any>((resolve) => resolve({}));
  }

  /***
   * Reset folder Permission
   * @param folderName Folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async resetFolderPermission(
    folderName: string,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<void> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    const folderItem = await spWeb
      .getList(listRelativeUrl)
      .rootFolder.folders.getByName(folderName)
      .getItem();
    await folderItem.resetRoleInheritance();
  }

  /**
   * Create Folder in Sharepoint Document Library
   * @param folderName Folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   * @returns Folder
   */
  public async createFolderDocumentLibrary(
    folderName: string,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<Folder> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    let newFolder: Folder;
    try {
      newFolder = await spWeb
        .getList(listRelativeUrl)
        .rootFolder.folders.getByName(folderName)
        .get();
    } catch (e) {
      let folderAddResult: FolderAddResult = await spWeb
        .getList(listRelativeUrl)
        .rootFolder.folders.add(folderName);
      newFolder = folderAddResult.folder;
    }

    return newFolder;
  }

  /**
   * Delete Folder in Sharepoint Document Library
   * @param folderName Folder Name
   * @param listRelativeUrl Sharepoint List relative URL
   */
  public async deleteFolderDocumentLibrary(
    folderName: string,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<void> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return spWeb
      .getList(listRelativeUrl)
      .rootFolder.folders.getByName(folderName)
      .delete();
  }

  /**
   * Delete Folder in Sharepoint Document Library
   * @param itemID Item ID
   * @param listRelativeUrl Sharepoint List relative URL
   *  * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async delete(
    itemID: number,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<void> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return spWeb.getList(listRelativeUrl).items.getById(itemID).delete();
  }

  /**
   * Save/Update Item in Sharepoint List
   * @param item Checks if the item do exists and attach the attachment to it
   * @param listRelativeUrl Sharepoint List relative URL
   * @param attachments List of attachments to be saved
   * @returns Attachments Saved
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async addAttachment(
    item: IBaseModel,
    listRelativeUrl: string,
    attachments: AttachmentFileInfo[],
    rootWeb: boolean = false
  ): Promise<void> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    if (item.ID > 0) {
      if (attachments.length > 0) {
        await spWeb
          .getList(listRelativeUrl)
          .items.getById(item.ID)
          .attachmentFiles.addMultiple(attachments);
      }
    }
  }

  /**
   * Delete list Attachment
   * @param item List item
   * @param listRelativeUrl SharePoint list relative URL
   * @param attachments Attachments
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async deleteAttachment(
    item: IBaseModel,
    listRelativeUrl: string,
    attachments: string[],
    rootWeb: boolean = false
  ): Promise<void> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    if (item.ID > 0) {
      if (attachments.length > 0) {
        await spWeb
          .getList(listRelativeUrl)
          .items.getById(item.ID)
          .attachmentFiles.recycleMultiple(...attachments);
      }
    }
  }

  /**
   * Get list item Attachment
   * @param item List item
   * @param listRelativeUrl SharePoint list relative URL
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public async getAttachments(
    item: IBaseModel,
    listRelativeUrl: string,
    rootWeb: boolean = false
  ): Promise<any[]> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    if (item.ID > 0) {
      return await spWeb
        .getList(listRelativeUrl)
        .items.getById(item.ID)
        .attachmentFiles.get();
    }
    return null;
  }

  /**
   * Get Items using filter
   * Expands a field
   * @param listRelativeUrl Sharepoint List relative URL
   * @param filter filter
   * @param expanded: field to be expanded
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public getItemsWithAttachmentsFiltered(
    listRelativeUrl: string,
    expanded: string,
    filter?: string,
    rootWeb: boolean = false
  ): Promise<Array<IBaseModel>> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return filter
      ? spWeb
          .getList(listRelativeUrl)
          .items.filter(filter)
          .expand(expanded)
          .get()
      : spWeb.getList(listRelativeUrl).items.expand(expanded).get();
  }

  /**
   * Get paged items
   * @param listRelativeUrl SharePoint list relative URL
   * @param top Query row limit
   * @param filter String representing filter query
   * @param order If false DESC is appended, otherwise ASC (default)
   * @param elementOrder The name of the field on which to sort
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public getItemsPaged(
    listRelativeUrl: string,
    top: number,
    filter?: string,
    order: boolean = true,
    elementOrder: string = "ID",
    rootWeb: boolean = false
  ): Promise<PagedItemCollection<IBaseModel[]>> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return filter
      ? spWeb
          .getList(listRelativeUrl)
          .items.top(top)
          .filter(filter)
          .orderBy(elementOrder, order)
          .getPaged()
      : spWeb
          .getList(listRelativeUrl)
          .items.top(top)
          .orderBy(elementOrder, order)
          .getPaged();
  }

  /**
   * Get Items using Caml Query
   * @param listRelativeUrl Sharepoint List relative URL
   * @param CAMLQuery Object with the query xml
   * @param rootWeb Web context: set true if gets the root web of the site collection, otherwise begins a web scoped REST request (default)
   */
  public getItemsByCAMLQueryXML(
    listRelativeUrl: string,
    CAMLQuery: CamlQuery,
    rootWeb: boolean = false
  ): Promise<IBaseModel[]> {
    const spWeb: Web = rootWeb ? this.spRest.site.rootWeb : this.spRest.web;
    return spWeb.getList(listRelativeUrl).getItemsByCAMLQuery(CAMLQuery);
  }
}
