"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_ANIME_EPISODES_BY_ID = exports.DELETE_ANIME_BY_ID = exports.UPDATE_ANIME_BY_ID = exports.INSERT_ANIME_EPISODES = exports.INSERT_ANIME_DETAILS = exports.GET_ANIME_EPISODES_BY_ID = exports.GET_ANIME_BY_ID = exports.GET_ANIMES = exports.CREATE_ANIME_EPISODES_TABLE_IF_NOT_EXISTED = exports.CREATE_ANIME_TABLE_IF_NOT_EXISTED = void 0;
exports.CREATE_ANIME_TABLE_IF_NOT_EXISTED = `
    CREATE TABLE IF NOT EXISTS Animes(
			id VARCHAR(36) PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT,
			thumbnail TEXT,
			numOfEpisodes INTEGER DEFAULT 1,
			status TEXT NOT NULL,
			type TEXT NOT NULL,
			createdAt DATE NOT NULL,
			updatedAt DATE
		);
	`, exports.CREATE_ANIME_EPISODES_TABLE_IF_NOT_EXISTED = `
		CREATE TABLE IF NOT EXISTS AnimeEpisodes(
			anime_id VARCHAR(36),
			link TEXT,
			FOREIGN KEY(anime_id) REFERENCES Animes(id) ON DELETE CASCADE
		);
	`, exports.GET_ANIMES = `SELECT * FROM Animes;`, exports.GET_ANIME_BY_ID = `SELECT * FROM Animes WHERE id = @id;`, exports.GET_ANIME_EPISODES_BY_ID = `SELECT link from AnimeEpisodes WHERE anime_id = @id`, exports.INSERT_ANIME_DETAILS = `
		INSERT INTO Animes(
			id,
			name,
			description,
			numOfEpisodes,
			status,
			type,
			thumbnail,
			createdAt
		)
		VALUES(
			@id,
			@name,
			@description,
			@numOfEpisodes,
			@status,
			@type,
			@thumbnail,
			@createdAt
		);
	`, exports.INSERT_ANIME_EPISODES = `
		INSERT INTO AnimeEpisodes(
			anime_id,
			link
		)
		VALUES(@anime_id, @link);
	`, exports.UPDATE_ANIME_BY_ID = `
		UPDATE Animes
		SET name = @name,
				description = @description,
				numOfEpisodes = @numOfEpisodes,
				status = @status,
				type = @type,
				thumbnail = @thumbnail,
				updatedAt = @updatedAt
		WHERE id = @id;
	`, exports.DELETE_ANIME_BY_ID = `
		DELETE FROM ANIMES
		WHERE id = @id;
	`, exports.DELETE_ANIME_EPISODES_BY_ID = `
		DELETE FROM AnimeEpisodes
		WHERE anime_id = @id;
	`;
//# sourceMappingURL=animes-sql.js.map