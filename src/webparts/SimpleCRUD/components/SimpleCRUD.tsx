import * as React from "react";
import styles from "./SimpleCRUD.module.scss";
import { ISimpleCRUDProps } from "./ISimpleCRUDProps";
import { escape } from "@microsoft/sp-lodash-subset";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { ISimpleCRUDState } from "./ISimpleCRUDState";
import SimpleAddEditForm from "./form/SimpleAddEditForm";
import { IFormModel } from "./form/IFormModel";
import { CustomConfirmModal } from "../../../shared/modal/CustomConfirmModal";
import { CustomListService } from "../../../services/CustomListService";
import CustomGrid from "./grid/CustomGrid";
import { PagedItemCollection } from "@pnp/sp/items";

export default class SimpleCRUD extends React.Component<
  ISimpleCRUDProps,
  ISimpleCRUDState,
  {}
> {
  private customListService: CustomListService;
  constructor(props) {
    super(props);

    this.state = {
      pagedItems: null,
      showDelModal: false,
      markedItemToEdit: 0,
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
  // private async _loadItems(): Promise<any> {
  //   let promiseArray = [];
  //   promiseArray.push(this.templateNotificacao.loadItemsData());
  //   promiseArray.push(this.notificacoes.getNotifications(this.props.notificationPageSize, this.props.spDataProvider.spUser.currentUserID));
  //   return Promise.all(promiseArray);
  // }

  public async loadList() {
    const listItemCount = await this.customListService.getLisItemsCount();
    await this.customListService.getPagedItemsOrderByID(
      5,
      this.props.filterTitle
    );
    this.setState({
      pagedItems: this.customListService.itemsDataPaged
        ? this.customListService.itemsDataPaged
        : undefined,
      totalListItemCount: listItemCount,
    });

    // const newItems: any[] = await sp.web.lists
    //   .getById(this.props.list)
    //   .items.filter(filterCriteria).get();

    //  sp.web.lists.getById(this.props.list).items.filter(filterCriteria).getAll().then((resultItems)=>{
    //   this.setState({ items: resultItems });
    //   console.log(resultItems);
    // });

    //this.setState({ items: newItems });
  }

  private async addNewItem(formModel: IFormModel) {
    //await sp.web.lists.getById(formModel.listID).items.add({
      await sp.web.lists.getById(this.props.list).items.add({
      Title: formModel.title,
      LastName: formModel.lastName,
      EmailAddress: formModel.emailAddress,
      Password: formModel.password,
    });
    this.loadList();
  }
  private async deleteItem() {
    // await sp.web.lists
    //   .getById(this.props.list)
    //   .items.getById(this.state.markedItemToDelete)
    //   .delete();
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
 
  public render(): React.ReactElement<ISimpleCRUDProps> {
    return (
      <div>
        {/* <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((item) => {
              return (
                <tr>
                  <th scope="row">{item.ID}</th>
                  <td>{item.Title}</td>
                  <td>{item.LastName}</td>
                  <td>{item.EmailAddress}</td>
                  <td>{item.Created}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" >Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() =>  this.setState({ showDelModal: true, markedItemToDelete: item.ID })}>Delete</button>
                   
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
        <CustomGrid
          scroll={true}
          pagedItems={this.state.pagedItems}
          totalItems={this.state.totalListItemCount}
          handleDelConfirmModal={(itemID) => this.showHideDelConfirmModal(true, itemID)}
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
            // ListID ={this.props.list}
          />
        )}
        <SimpleAddEditForm
          buttonTitle="Add"
          //listID={this.props.list}
          handleSubmit={(item) => this.addNewItem(item)}
        />
      </div>
    );
  }
}
