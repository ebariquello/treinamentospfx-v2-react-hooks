import { ICustomListItem } from "../../../../models/ICustomListItem";
import { IFormModel } from "./IFormModel";

export interface ISimpleAddEditFormProps{
    handleCancel?(): void;
    buttonTitle: string;
    itemEdit?: ICustomListItem | undefined;
    editModeForm?: boolean;
    handleSubmit?(customListItem:ICustomListItem):void;
}