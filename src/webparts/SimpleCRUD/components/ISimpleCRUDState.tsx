import { PagedItemCollection } from "@pnp/sp/items";
import { ICustomListItem } from "../../../models/ICustomListItem";

export interface ISimpleCRUDState {
  pagedItems: PagedItemCollection<ICustomListItem[] | undefined>;
  totalListItemCount: number;
  showDelModal: boolean;
  showAddEditForm: boolean;
  markedItemToDelete: number;
  markedItemToEdit: ICustomListItem | undefined;
}
