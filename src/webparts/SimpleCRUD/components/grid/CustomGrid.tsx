import * as React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { ICustomListItem } from "../../../../models/ICustomListItem";
import { ICustomGridState } from "./ICustomGridState";
import { ICustomGridProps } from "./ICustomGridProps";
import styles from "../SimpleCRUD.module.scss";

export default class CustomGrid extends React.Component<
  ICustomGridProps,
  ICustomGridState,
  {}
> {
  constructor(props: ICustomGridProps) {
    super(props);
  }

  private async setToEditItem(item: ICustomListItem) {
    this.props.handleEditItem(item);
  }

  private async setToDeleteItem(itemID: number) {
    this.props.handleDelConfirmModal(itemID);
  }

  private hasMore(): boolean {
    return (
      this.props.scroll &&
      this.props.items !== null &&
      this.props.items.length < this.props.totalItems
    );
  }

  public render(): React.ReactElement<ICustomGridProps> {
    return (
      <div className={styles.customListContainer}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => this.props.handleLoadMoreItems()}
          hasMore={this.hasMore()}
          useWindow={false}
          threshold={5}
          initialLoad={false}
        >

          <div className={styles.table}>
            <div
              className={`${styles.header} ${styles.grid} `}
            >
              <div>ID</div>
              <div>First Name</div>
              <div>Last Name</div>
              <div>Email</div>
              <div>Actions</div>
            </div>
            {this.props.items == null || this.props.items.length < 1 ? (
              <div style={{ margin: "10px auto", textAlign: "center" }}>
                Nenhum item encontrado!
              </div>
            ) : (
              this.props.items.map((item: ICustomListItem, index: number) => {
                return (
                  <div
                    className={`${
                      index % 2 == 0 ? styles.rowEven : styles.rowOdd
                    } ${styles.grid} `}
                  >
                    <div>{item.ID}</div>
                    {/* <div>{e.Name.replace(/\.[^/.]+$/, '')}</div>
                <div>{(moment as any).default(e.TimeLastModified).format('DD/MM/YYYY')}</div> */}
                    <div>{item.Title}</div>
                    <div>{item.LastName}</div>
                    <div>{item.EmailAddress}</div>
                    <div className={styles.actionsContainer}>
                      <button
                        className={`btn btn-primary btn-sm ${styles.actionButton}`}
                        onClick={() => this.setToEditItem(item)}
                      >
                        Editar
                      </button>
                      <button
                        className={`btn btn-secondary btn-sm ${styles.actionButton}`}
                        onClick={() => this.setToDeleteItem(item.ID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </InfiniteScroll>
        {this.props.items !== null ? (
          this.props.items.length < this.props.totalItems ? (
            this.props.scroll ? (
              <div key={0}>
                <label>Loading...</label>
              </div>
            ) : (
              <div>
                <a onClick={() => this.props.handleLoadMoreItems()}>Ver mais</a>
              </div>
            )
          ) : (
            <div></div>
          )
        ) : (
          <></>
        )}
      </div>
    );
  }
}
