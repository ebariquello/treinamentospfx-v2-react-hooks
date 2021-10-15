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

export default class SimpleCRUD extends React.Component<
  ISimpleCRUDProps,
  ISimpleCRUDState,
  {}
> {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
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
      .items.get();

    //  sp.web.lists.getById(this.props.list).items.filter(filterCriteria).getAll().then((resultItems)=>{
    //   this.setState({ items: resultItems });
    //   console.log(resultItems);
    // });

    this.setState({ items: newItems });
    console.log(newItems);
  }

  private async _addNewItem(item: IListItemProps) {
    console.log("New Item", JSON.stringify(item));

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
    console.log("New Item Created");
  }

  public render(): React.ReactElement<ISimpleCRUDProps> {
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
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
                  <td>{item.Created}</td>
                  <td>
                    <button className="btn btn-warning btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <SimpleAddEditForm
          buttonTitle="Add"
          listID={this.props.list}
          handleSubmit={(item) => this._addNewItem(item)}
        />
      </div>
    );
  }
}
