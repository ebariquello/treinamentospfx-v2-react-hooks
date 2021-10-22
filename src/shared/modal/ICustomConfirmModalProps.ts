export interface ICustomConfirmModalProps{
  ModalBody: string;
  ModalTitle: string;
  IsModalOpen: boolean;
  HandleCancel?():any;
  //HandleDelConfirm?(itemID:number, listID: string):any;
  HandleDelConfirm?(itemID:number):Promise<void>;
  //ListID?: string;
  ItemID?: number;
}