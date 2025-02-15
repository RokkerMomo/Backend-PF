import { Model, Schema, Document, model, Date } from "mongoose";


//INTERFACE
export interface Igrade extends Document {
    name:string,
    desc:string,
    slogan:string,
    price:number,
    url_pic:string,
    vidId:string
}

const GradeSchema = new Schema ({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    slogan: {type: String, required: true},
    price: {type: Number, required: true},
    url_pic: {type: String, required: true},
    vidId: {type: String, required: true},
});


export default model<Igrade>('grades', GradeSchema);