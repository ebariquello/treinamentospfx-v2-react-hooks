
import { ICustomListItem } from "../../../models/ICustomListItem";

export interface ISimpleCRUDState {
  items: ICustomListItem[] | undefined;
  totalListItemCount: number;
  showDelModal: boolean;
  showAddEditForm: boolean;
  markedItemToDelete: number;
  markedItemToEdit: ICustomListItem | undefined;
 
}
