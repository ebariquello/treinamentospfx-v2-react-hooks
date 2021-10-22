
import { PagedItemCollection } from '@pnp/sp/items';
import { ICustomListItem } from '../../../../models/ICustomListItem';

export interface ICustomGridProps   {
  pagedItems?: PagedItemCollection<ICustomListItem[] | undefined>;
  scroll: boolean;
  totalItems: number;
  handleEditItem?(itemID:number):void;
  handleDelConfirmModal?(itemID:number):void;
}
