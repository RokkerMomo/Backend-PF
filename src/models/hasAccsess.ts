import { Model, Schema, Document, model, Date } from "mongoose";

export interface IhasAccess extends Document {
    id_user:string,
    id_grade:string,
}

const hasAccessSchema = new Schema ({
    id_user: {type: String, required: true},
    id_grade: {type: String, required: true},
});

export default model<IhasAccess>('hasAccess', hasAccessSchema);