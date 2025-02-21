"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middlewares/passport"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const aut_routes_1 = __importDefault(require("./routes/aut.routes"));
const special_routes_1 = __importDefault(require("./routes/special.routes"));
const app = (0, express_1.default)();
// settings
app.set('port', process.env.PORT || 5173);
// middlewares
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
app.get('/', (req, res) => {
    return res.send(`the mongouri is ${process.env.MONGODB_URI} The API is at http://localhost:${app.get('port')}`);
});
app.use(aut_routes_1.default);
app.use(special_routes_1.default);
exports.default = app;
