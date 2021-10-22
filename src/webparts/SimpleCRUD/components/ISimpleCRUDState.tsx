import { PagedItemCollection } from "@pnp/sp/items";
import { ICustomListItem } from "../../../models/ICustomListItem";

export interface ISimpleCRUDState {
  pagedItems: PagedItemCollection<ICustomListItem[] | undefined>;
  // nome: string;
  // idade: string;
  totalListItemCount: number;
  showDelModal: boolean;
  markedItemToDelete: number;
  markedItemToEdit: number;
}
