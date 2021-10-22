import { PagedItemCollection } from "@pnp/sp/items/types";
import { BaseServices } from "../core/Services/BaseServices";
import { ICustomListItem } from "../models/ICustomListItem";



export class CustomListService extends BaseServices  {
  public itemData: ICustomListItem;
  public itemsData: Array<ICustomListItem> = [];
  public listInternalName: string = "ListaTeste";
  public itemsDataPaged: PagedItemCollection<ICustomListItem[]>;
  
  /**
   * Get Custom List items limited by pagination
   * @param top    
   */
  public async getPagedItemsOrderByID(top: number, filterTitle?: string): Promise<void> {
    const filterCriteria =
    filterTitle === "" || filterTitle === undefined
      ? `Title ne ''`
      : `startswith(Title,${filterTitle})`;
    this.itemsDataPaged = await this.spDataProvider.spList.getItemsPaged(this.listRelativeUrl, top, filterCriteria, true, "ID", this._rootWeb);
  }

  public async getLisItemsCount(): Promise<number> {
   
    return await this.spDataProvider.spList.getListItemsCount(this.listRelativeUrl, true);
  }

 /**
  * Get Next Custom List items page
  * @param total 
  */
  public async getNextPageItems(total: number): Promise<void> {
    if (this.itemsDataPaged.hasNext && total > (this.itemsDataPaged.results.length)) {
      let atualResults = this.itemsDataPaged.results;
      this.itemsDataPaged = await this.itemsDataPaged.getNext();
      Array.prototype.push.apply(atualResults, this.itemsDataPaged.results);
      this.itemsDataPaged.results = atualResults;
    }
  }

  /**
   * Delete Custom List Item
   * @param itemID
   */
  public async deleteCustomListItem(itemID: number){
    await this.spDataProvider.spList.delete(itemID,this.listRelativeUrl, true );
  }

  

}