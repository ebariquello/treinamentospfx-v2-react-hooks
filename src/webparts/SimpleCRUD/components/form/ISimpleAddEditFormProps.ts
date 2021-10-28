import { ICustomListItem } from "../../../../models/ICustomListItem";


export interface ISimpleAddEditFormProps{
    handleCancel?(): void;
    buttonTitle: string;
    itemEdit?: ICustomListItem | undefined;
    editModeForm?: boolean;
    handleSubmit?(customListItem:ICustomListItem):void;
}