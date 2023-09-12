"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const animes_controller_1 = require("../database/controllers/animes-controller");
const utils_1 = require("../database/controllers/utils");
let animeDatabaseConnection;
let animesController;
(() => __awaiter(void 0, void 0, void 0, function* () {
    animeDatabaseConnection = yield (0, utils_1.createDbConnection)(animes_controller_1.AnimesDatabasePath, animes_controller_1.AnimeDatabaseFilename);
    animesController = new animes_controller_1.AnimesController(animeDatabaseConnection);
}))();
exports.resolvers = {
    Query: {
        animes: () => __awaiter(void 0, void 0, void 0, function* () { return animesController.getAllAnimes(); }),
        anime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return animesController.getAnimeById(id); }),
    },
    Mutation: {
        createAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () { return animesController.createAnime(animeInput); }),
        updateAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () { return animesController.updateAnimeById(animeInput); }),
        deleteAnime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                affectedRows: animesController.deleteAnimeById(id),
            });
        }),
    },
};
//# sourceMappingURL=resolvers.js.map