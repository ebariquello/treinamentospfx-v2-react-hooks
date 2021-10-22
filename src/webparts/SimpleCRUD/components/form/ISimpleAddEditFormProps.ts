import { ICustomListItem } from "../../../../models/ICustomListItem";
import { IFormModel } from "./IFormModel";

export interface ISimpleAddEditFormProps{
    buttonTitle: string;
    itemEdit?: ICustomListItem;
    showForm?: boolean;
    //listID : string;
    handleSubmit?(formModel: IFormModel):any;
}