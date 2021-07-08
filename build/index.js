"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var helmet_1 = __importDefault(require("helmet"));
var app = express_1.default();
app.use(helmet_1.default());
app.use(morgan_1.default('tiny'));
app.use(cors_1.default());
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.json({
        message: 'short urls for your garden',
    });
});
var port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log("Listening at http://localhost:" + port);
});
