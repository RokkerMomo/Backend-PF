"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GradeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    slogan: { type: String, required: true },
    price: { type: Number, required: true },
    url_pic: { type: String, required: true },
    vidId: { type: Number, required: true },
});
exports.default = (0, mongoose_1.model)('grades', GradeSchema);
