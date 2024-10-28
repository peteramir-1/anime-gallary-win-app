"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const statements = require("./settings-sql");
const graphql_1 = require("graphql");
class SettingsController {
    constructor(DatabaseConnection) {
        this.DatabaseConnection = DatabaseConnection;
        this.booleanFields = [
            'darkMode',
            'enableMute',
            'enableVolumeScroll',
            'enableHoverScroll',
            'enableFullscreen',
            'enableNumbers',
            'enableModifiersForNumbers',
            'alwaysCaptureHotkeys',
            'enableInactiveFocus',
            'skipInitialFocus',
            'pip',
            'controls',
            'autoplay',
            'loop',
            'muted',
            'skipButton',
            'audioOnlyMode',
            'audioPosterMode',
            'remainingTimeDisplayDisplayNegative',
            'hotkeys',
        ];
        this.prepareDatabaseConnection();
    }
    prepareDatabaseConnection() {
        try {
            this.DatabaseConnection.prepare(statements.CREATE_SETTINGS_TABLE_IF_NOT_EXISTED).run();
            const res = this.DatabaseConnection.prepare('SELECT id FROM Settings WHERE id = 0').get();
            if (!((res === null || res === void 0 ? void 0 : res.id) === 0)) {
                const createdAt = new Date().toLocaleDateString('en-CA');
                this.DatabaseConnection.prepare('INSERT INTO Settings(id, createdAt) VALUES(0, @createdAt);').run({ createdAt });
            }
        }
        catch (error) {
            throw new graphql_1.GraphQLError('Error in Preparing Database Connection', {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR',
                    origin: error,
                },
            });
        }
    }
    getAllSettings() {
        return new Promise((resolve, reject) => {
            try {
                const res = this.DatabaseConnection.prepare(statements.GET_SETTINGS).get();
                const settings = Object.assign({}, this.convertToApolloDataType(res));
                resolve(settings);
            }
            catch (error) {
                reject(new graphql_1.GraphQLError('Error in Fetching Saved Data', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                    },
                }));
            }
        });
    }
    updateSettings(update_settings) {
        return new Promise((resolve, reject) => {
            try {
                this.getAllSettings().then(previousSettings => {
                    const updatedAt = new Date().toLocaleDateString('en-CA');
                    const updatedSettings = Object.assign(Object.assign(Object.assign({}, previousSettings), this.convertToSqliteDataType(update_settings)), { updatedAt });
                    this.DatabaseConnection.prepare(statements.UPDATE_SETTINGS).run(updatedSettings);
                    this.getAllSettings().then(settings => {
                        resolve(settings);
                    }, error => {
                        reject(new graphql_1.GraphQLError('Error in Fetching Data After Updating', {
                            extensions: {
                                code: 'INTERNAL_SERVER_ERROR',
                                origin: error,
                            },
                        }));
                    });
                }, error => {
                    throw new graphql_1.GraphQLError('Error in Fetching Previously Saved Data', {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                            origin: error,
                        },
                    });
                });
            }
            catch (error) {
                throw new graphql_1.GraphQLError('Error in Updating Data', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                    },
                });
            }
        });
    }
    convertToSqliteDataType(obj) {
        return Object.fromEntries(Object.entries(obj).map(propertyArr => {
            const key = propertyArr[0];
            if (this.booleanFields.includes(key)) {
                return [propertyArr[0], Number(propertyArr[1])];
            }
            return [propertyArr[0], propertyArr[1]];
        }));
    }
    convertToApolloDataType(obj) {
        return Object.fromEntries(Object.entries(obj).map(propertyArr => {
            const key = propertyArr[0];
            if (this.booleanFields.includes(key)) {
                return [propertyArr[0], Boolean(propertyArr[1])];
            }
            return [propertyArr[0], propertyArr[1]];
        }));
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings-controller.js.map