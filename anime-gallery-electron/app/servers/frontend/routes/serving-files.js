"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const serve_pictures_1 = require("../handlers/serve-pictures");
const router = express.Router();
router.get('/picture', serve_pictures_1.servePictures);
exports.default = router;
//# sourceMappingURL=serving-files.js.map