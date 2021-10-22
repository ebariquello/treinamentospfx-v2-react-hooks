import * as React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { ICustomListItem } from "../../../../models/ICustomListItem";
import { ICustomGridState } from "./ICustomGridState";
import { ICustomGridProps } from "./ICustomGridProps";

export default class CustomGrid extends React.Component<
  ICustomGridProps,
  ICustomGridState,
  {}
> {
  constructor(props: ICustomGridProps) {
    super(props);

  }

  public async loadMoreItems() {}
 

  public async setToEditItem(itemID: number) {
    this.props.handleEditItem(itemID);
  }
  public async setToDeleteItem(itemID: number) {
    this.props.handleDelConfirmModal(itemID);
  }

  public render(): React.ReactElement<ICustomGridProps> {
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => this.loadMoreItems()}
          hasMore={
            this.props.scroll &&
            this.props.pagedItems?.results?.length < this.props.totalItems
          }
          useWindow={false}
          threshold={10}
          initialLoad={false}
        >
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
              {this.props.pagedItems!==null && this.props.pagedItems.results.length>0 
              ? this.props.pagedItems.results.map((item) => {
                return (
                  <tr>
                    <th scope="row">{item.ID}</th>
                    <td>{item.Title}</td>
                    <td>{item.LastName}</td>
                    <td>{item.EmailAddress}</td>
                    <td>{item.Created}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => this.setToEditItem(item.ID)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => this.setToDeleteItem(item.ID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              }): <></>}
            </tbody>
          </table>
        </InfiniteScroll>
        {this.props.pagedItems? this.props.pagedItems.results.length < this.props.totalItems ? (
          this.props.scroll ? (
            <div key={0}>
              <label>Loading...</label>
            </div>
          ) : (
            <div>
              <a onClick={() => this.loadMoreItems()}>Ver mais</a>
            </div>
          )
        ) : (
          <div></div>
        ): <></>}
      </div>
    );
  }
}
