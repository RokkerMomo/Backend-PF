import { Model, Schema, Document, model, Date } from "mongoose";

export interface IClass extends Document {
    id_grade:string,
    desc:string,
    date:Date,
    url_vid:string,
}

const ClassSchema = new Schema ({
    id_grade: {type: String, required: true},
    desc: {type: String, required: true},
    date: {type: Date, required: true},
    url_vid: {type: String, required: true}
});

export default model<IClass>('hasAccess', ClassSchema);