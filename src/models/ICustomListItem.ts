import { IBaseModel } from "../core/Models/IBaseModel";
export interface ICustomListItem extends IBaseModel {
    LastName?: string;
    Password?: string;
    EmailAddress?: string;
    ContentType?: string;
    Modified?: Date;
    Created?: Date;
    AuthorId?: number;
    EditorId?: number;
    OData__UIVersionString?: string;
    Attachments?: any;
    Edit?: string;
    DocIcon?: string;
    ItemChildCountId?: number;
    FolderChildCountId?: number;
    OData__IsRecord?: string;
}