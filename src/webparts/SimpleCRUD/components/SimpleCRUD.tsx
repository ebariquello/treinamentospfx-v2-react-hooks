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
import { IListItemProps } from "./form/IListItemProps";
import { CustomConfirmModal } from "../../../shared/modal/CustomConfirmModal";

export default class SimpleCRUD extends React.Component<
  ISimpleCRUDProps,
  ISimpleCRUDState,
  {}
> {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      showDelModal: false,
      markedItemToEdit: 0, 
      markedItemToDelete: 0
    };
  }

  async componentDidMount() {
    await this.loadList();
  }

  public async loadList() {
    const filterCriteria =
      this.props.filterTitle === "" || this.props.filterTitle === undefined
        ? `Title ne ''`
        : `startswith(Title,${this.props.filterTitle})`;
    const newItems: any[] = await sp.web.lists
      .getById(this.props.list)
      .items.filter(filterCriteria).get();

    //  sp.web.lists.getById(this.props.list).items.filter(filterCriteria).getAll().then((resultItems)=>{
    //   this.setState({ items: resultItems });
    //   console.log(resultItems);
    // });

    this.setState({ items: newItems });

  }

  private async _addNewItem(item: IListItemProps) {
    // sp.web.lists
    //   .getById(item.listID)
    //   .items.add({
    //     Title: item.title,
    //     LastName: item.lastName,
    //     EmailAddress: item.emailAddress,
    //     Password: item.password,
    //   })
    //   .then((d) => {
    //     this.loadList();
    //     console.log("New Item Created");
    //   });

    await sp.web.lists.getById(item.listID).items.add({
      Title: item.title,
      LastName: item.lastName,
      EmailAddress: item.emailAddress,
      Password: item.password,
    });
    this.loadList();
    //console.log("New Item Created");
  }
  private async _deleteItem(itemID: number, listID: string) {
    await sp.web.lists.getById(listID).items.getById(itemID).delete();
    this.loadList();
    this.setState({showDelModal:false});
   
  }
  public render(): React.ReactElement<ISimpleCRUDProps> {
    return (
      <div>
        <table className="table">
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
        </table>
        {this.state.showDelModal && <CustomConfirmModal IsModalOpen={this.state.showDelModal} 
                    ModalBody={`Are sure to delete the item :${this.state.markedItemToDelete}`} 
                    ModalTitle={`Confirm Deletation Item:${this.state.markedItemToDelete}`}
                    HandleCancel={()=>{return;} } 
                    HandleDelConfirm={(itemID, listID)=> this._deleteItem(itemID, listID) }
                    ItemID={this.state.markedItemToDelete}
                    ListID ={this.props.list}
                    />}
        <SimpleAddEditForm
          buttonTitle="Add"
          listID={this.props.list}
          handleSubmit={(item) => this._addNewItem(item)}
        />
      </div>
    );
  }
}
