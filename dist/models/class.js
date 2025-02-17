"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ClassSchema = new mongoose_1.Schema({
    id_grade: { type: String, required: true },
    desc: { type: String, required: true },
    date: { type: Date, required: true },
    url_vid: { type: String, required: true }
});
exports.default = (0, mongoose_1.model)('hasAccess', ClassSchema);
