import * as React from "react";
import styles from "./SimpleCRUD.module.scss";
import { ISimpleCRUDProps } from "./ISimpleCRUDProps";
import { sp } from "@pnp/sp";


import { ISimpleCRUDState } from "./ISimpleCRUDState";
import SimpleAddEditForm from "./form/SimpleAddEditForm";

import { CustomConfirmModal } from "../../../shared/modal/CustomConfirmModal";
import { CustomListService } from "../../../services/CustomListService";
import CustomGrid from "./grid/CustomGrid";
import { ICustomListItem } from "../../../models/ICustomListItem";

export default class SimpleCRUD extends React.Component<
  ISimpleCRUDProps,
  ISimpleCRUDState,
  {}
> {
  private customListService: CustomListService;
  constructor(props) {
    super(props);

    this.state = {
      items: null,
      showDelModal: false,
      showAddEditForm: false,
      markedItemToEdit: undefined,
      markedItemToDelete: 0,
      totalListItemCount: 0,
    };
    this.customListService = new CustomListService(
      this.props.spDataProvider,
      true
    );
  }

  public async componentDidMount() {
    await this.loadList();
  }

  public async loadList() {
    const listItemCount = await this.customListService.getLisItemsCount();
    this.customListService.itemsDataPaged = null;
    await this.customListService.getPagedItemsOrderByID(
      5,
      this.props.filterTitle
    );
    this.setState({
      items: this.customListService.itemsDataPaged
        ? this.customListService.itemsDataPaged.results
        : undefined,
      totalListItemCount: listItemCount,
    });
  }

  private async saveCustomListItem(customListItem: ICustomListItem) {
 
    //await sp.web.lists.getById(this.props.list).items.add(customListItem);
    this.customListService.itemData = customListItem;
    await this.customListService.save();
    await this.loadList();
    this.setState({showAddEditForm:false, markedItemToEdit:undefined});
    
  }

  private async deleteItem() {
    await this.customListService.deleteCustomListItem(this.state.markedItemToDelete);
    await this.loadList();
    this.setState({ showDelModal: false });
  }
  private async showHideDelConfirmModal(show: boolean, itemID?: number) {
    if (show === false || itemID === null || itemID === undefined) {
      this.setState({ showDelModal: false, markedItemToDelete: 0 });
    }
    if (show===true && itemID >0 ) {
      this.setState({ showDelModal: show, markedItemToDelete: itemID });
    }
  }
  private async showSimpleAddEditForm(item: ICustomListItem){
    this.setState({showAddEditForm:true, markedItemToEdit:item});
  }

  private async cancelAddEditForm(){
    this.setState({showAddEditForm:false, markedItemToEdit:undefined});
  }

  private async loadMoreItems() {
    await this.customListService.getNextPageItems(6);
    this.setState({
      items: this.customListService.itemsDataPaged
        ? this.customListService.itemsDataPaged.results
        : [],
    });
  }
 
  public render(): React.ReactElement<ISimpleCRUDProps> {
    return (
      <div className={styles.SimpleCRUD}>
        <CustomGrid
          scroll={true}
          items={this.state.items}
          totalItems={this.state.totalListItemCount}
          handleDelConfirmModal={(itemID) => this.showHideDelConfirmModal(true, itemID)}
          handleEditItem={(item:ICustomListItem)=> {this.showSimpleAddEditForm(item);}}
          handleLoadMoreItems={()=> this.loadMoreItems()}
        
        />
        {this.state.showDelModal && (
          <CustomConfirmModal
            IsModalOpen={this.state.showDelModal}
            ModalBody={`Are sure to delete the item :${this.state.markedItemToDelete}`}
            ModalTitle={`Confirm Deletation Item:${this.state.markedItemToDelete}`}
            HandleCancel={() => {
              this.showHideDelConfirmModal(false);
            }}
            HandleDelConfirm={() => this.deleteItem()}
            ItemID={this.state.markedItemToDelete}
          />
        )}
        <SimpleAddEditForm
          buttonTitle="Add"
          itemEdit={this.state.markedItemToEdit}
          editModeForm={this.state.showAddEditForm}
          handleSubmit={(item) => this.saveCustomListItem(item)}
          handleCancel={()=> this.cancelAddEditForm() }
        />
      </div>
    );
  }
}
