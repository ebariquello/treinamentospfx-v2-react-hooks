import { PagedItemCollection } from "@pnp/sp/items";
import { ICustomListItem } from "../../../../models/ICustomListItem";

export interface ICustomGridState {
  lastIntervalId?: number;
  visibleCount?: number;
  //pagedItems?: PagedItemCollection<ICustomListItem[] | undefined>;
}
