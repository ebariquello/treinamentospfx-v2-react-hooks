import { IListItemProps } from "./IListItemProps";

export interface ISimpleAddEditFormProps{
    buttonTitle: string;
    listID : string;
    handleSubmit?(item: IListItemProps):any;
}