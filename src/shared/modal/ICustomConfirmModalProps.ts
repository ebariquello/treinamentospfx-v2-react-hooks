export interface ICustomConfirmModalProps{
  ModalBody: string;
  ModalTitle: string;
  IsModalOpen: boolean;
  HandleCancel?():any;
  HandleDelConfirm?(itemID:number, listID: string):any;
  ListID?: string;
  ItemID?: number;
}