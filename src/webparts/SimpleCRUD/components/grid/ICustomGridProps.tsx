
import { PagedItemCollection } from '@pnp/sp/items';
import { ICustomListItem } from '../../../../models/ICustomListItem';
import { CustomListService } from '../../../../services/CustomListService';

export interface ICustomGridProps   {
  items?: ICustomListItem[] | undefined;
  scroll: boolean;
  totalItems: number;
  handleEditItem?(customListItm:ICustomListItem):void;
  handleDelConfirmModal?(itemID:number):void;
  handleLoadMoreItems?():void;
 
}
