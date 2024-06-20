"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsTypeDefs = void 0;
exports.settingsTypeDefs = `
    type Settings {
        id: Int!
        theme: String
        volumeStep: Float
        seekStep: Int
        enableMute: Boolean
        darkMode: Boolean
        enableVolumeScroll: Boolean
        enableHoverScroll: Boolean
        enableFullscreen: Boolean
        enableNumbers: Boolean
        enableModifiersForNumbers: Boolean
        alwaysCaptureHotkeys: Boolean
        enableInactiveFocus: Boolean
        skipInitialFocus: Boolean
        pip: Boolean
        controls: Boolean
        autoplay: Boolean
        loop: Boolean
        muted: Boolean
        poster: String
        skipButton: Boolean
        skipButtonForward: Int
        skipButtonBackward: Int
        preload: String
        src: String
        aspectRatio: String
        audioOnlyMode: Boolean
        audioPosterMode: Boolean
        remainingTimeDisplayDisplayNegative: Boolean
        hotkeys: Boolean
        createdAt: String!
        updatedAt: String
    }

    extend type Query {
        settings: Settings
    }

    input UpdatedSettingsInput {
        theme: String
        volumeStep: Float
        seekStep: Int
        enableMute: Boolean
        darkMode: Boolean
        enableVolumeScroll: Boolean
        enableHoverScroll: Boolean
        enableFullscreen: Boolean
        enableNumbers: Boolean
        enableModifiersForNumbers: Boolean
        alwaysCaptureHotkeys: Boolean
        enableInactiveFocus: Boolean
        skipInitialFocus: Boolean
        pip: Boolean
        controls: Boolean
        autoplay: Boolean
        loop: Boolean
        muted: Boolean
        poster: String
        skipButton: Boolean
        skipButtonForward: Int
        skipButtonBackward: Int
        preload: String
        src: String
        aspectRatio: String
        audioOnlyMode: Boolean
        audioPosterMode: Boolean
        remainingTimeDisplayDisplayNegative: Boolean
        hotkeys: Boolean
    }

    extend type Mutation {
        updateSettings(settingsInput: UpdatedSettingsInput): Settings
    }
`;
//# sourceMappingURL=settings-types.js.map