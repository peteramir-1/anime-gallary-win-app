"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_SETTINGS = exports.GET_SETTINGS = exports.CREATE_SETTINGS_TABLE_IF_NOT_EXISTED = void 0;
exports.CREATE_SETTINGS_TABLE_IF_NOT_EXISTED = `
    CREATE TABLE IF NOT EXISTS Settings(
        id INTEGER PRIMARY KEY DEFAULT 0,
        theme TEXT NOT NULL DEFAULT "custom-theme-1",
        darkMode Boolean DEFAULT 0,
        volumeStep REAL DEFAULT 0.1,
        seekStep INTEGER DEFAULT 5,
        enableMute INTEGER DEFAULT 1,
        enableVolumeScroll INTEGER DEFAULT 1,
        enableHoverScroll INTEGER DEFAULT 0,
        enableFullscreen INTEGER DEFAULT 1,
        enableNumbers INTEGER DEFAULT 1,
        enableModifiersForNumbers INTEGER DEFAULT 1,
        alwaysCaptureHotkeys INTEGER DEFAULT 0,
        enableInactiveFocus INTEGER DEFAULT 1,
        skipInitialFocus INTEGER DEFAULT 0,
        pip INTEGER DEFAULT 0,
        controls INTEGER DEFAULT 1,
        autoplay INTEGER DEFAULT 0,
        loop INTEGER DEFAULT 0,
        muted INTEGER DEFAULT 0,
        poster VARCHAR(266),
        skipButton INTEGER DEFAULT 0,
        skipButtonForward INTEGER, 
        skipButtonBackward INTEGER,
        preload VARCHAR(20) DEFAULT "auto",
        src VARCHAR(266),
        aspectRatio VARCHAR(266),
        audioOnlyMode INTEGER DEFAULT 0,
        audioPosterMode INTEGER DEFAULT 0,
        remainingTimeDisplayDisplayNegative INTEGER DEFAULT 0,
        hotkeys INTEGER DEFAULT 0,
        createdAt DATE NOT NULL,
        updatedAt DATE
    );
`;
exports.GET_SETTINGS = `
    SELECT * FROM Settings WHERE id = 0;
`;
exports.UPDATE_SETTINGS = `
    UPDATE Settings SET
        theme = @theme,
        darkMode = @darkMode,
        volumeStep = @volumeStep,
        seekStep = @seekStep,
        enableMute = @enableMute,
        enableVolumeScroll = @enableVolumeScroll,
        enableHoverScroll = @enableHoverScroll,
        enableFullscreen = @enableFullscreen,
        enableNumbers = @enableNumbers,
        enableModifiersForNumbers = @enableModifiersForNumbers,
        alwaysCaptureHotkeys = @alwaysCaptureHotkeys,
        enableInactiveFocus = @enableInactiveFocus,
        skipInitialFocus = @skipInitialFocus,
        pip = @pip,
        controls = @controls,
        autoplay = @autoplay,
        loop = @loop,
        muted = @muted,
        poster = @poster,
        skipButton = @skipButton,
        skipButtonForward = @skipButtonForward, 
        skipButtonBackward = @skipButtonBackward,
        preload = @preload,
        src = @src,
        aspectRatio = @aspectRatio,
        audioOnlyMode = @audioOnlyMode,
        audioPosterMode = @audioPosterMode,
        remainingTimeDisplayDisplayNegative = @remainingTimeDisplayDisplayNegative,
        hotkeys = @hotkeys,
        updatedAt = @updatedAt
    WHERE id = 0;
`;
//# sourceMappingURL=settings-sql.js.map