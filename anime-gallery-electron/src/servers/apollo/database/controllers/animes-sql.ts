export const CREATE_ANIME_TABLE_IF_NOT_EXISTED = `
    CREATE TABLE IF NOT EXISTS Animes(
			id VARCHAR(36) PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT,
			thumbnail TEXT,
			numOfEpisodes INTEGER DEFAULT 1,
			status TEXT NOT NULL,
			type TEXT NOT NULL,
			released VARCHAR(4),
			season TEXT,
			createdAt DATE NOT NULL,
			updatedAt DATE
		);
	`,
  CREATE_ANIME_EPISODES_TABLE_IF_NOT_EXISTED = `
		CREATE TABLE IF NOT EXISTS AnimeEpisodes(
			anime_id VARCHAR(36),
			link TEXT,
			FOREIGN KEY(anime_id) REFERENCES Animes(id) ON DELETE CASCADE
		);
	`,
  GET_ANIMES = `SELECT * FROM Animes;`,
  GET_ANIME_BY_ID = `SELECT * FROM Animes WHERE id = @id;`,
  GET_ANIME_EPISODES_BY_ID = `SELECT link from AnimeEpisodes WHERE anime_id = @id`,
  INSERT_ANIME_DETAILS = `
		INSERT INTO Animes(
			id,
			name,
			description,
			numOfEpisodes,
			status,
			type,
			thumbnail,
			released,
			season,
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
			@released,
			@season,
			@createdAt
		);
	`,
  INSERT_ANIME_EPISODES = `
		INSERT INTO AnimeEpisodes(
			anime_id,
			link
		)
		VALUES(@anime_id, @link);
	`,
  UPDATE_ANIME_BY_ID = `
		UPDATE Animes
		SET name = @name,
				description = @description,
				numOfEpisodes = @numOfEpisodes,
				status = @status,
				type = @type,
				thumbnail = @thumbnail,
				updatedAt = @updatedAt,
				released = @released,
				season = @season
		WHERE id = @id;
	`,
  DELETE_ANIME_BY_ID = `
		DELETE FROM ANIMES
		WHERE id = @id;
	`,
  DELETE_ANIME_EPISODES_BY_ID = `
		DELETE FROM AnimeEpisodes
		WHERE anime_id = @id;
	`;
