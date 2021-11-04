import { ICustomListItem } from '../../../../models/ICustomListItem';
export interface ICustomGridProps   {
  items?: ICustomListItem[] | undefined;
  scroll: boolean;
  totalItems: number;
  handleEditItem?(customListItm:ICustomListItem):void;
  handleDelConfirmModal?(itemID:number):void;
  handleLoadMoreItems?():void;
 
}
