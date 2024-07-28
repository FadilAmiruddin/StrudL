-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
    districtNum INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    districtNum INTEGER NOT NULL,
    questName TEXT NOT NULL,
    questDescription TEXT NOT NULL,
    isCompleted BOOLEAN NOT NULL CHECK (isCompleted IN (0, 1)),
    FOREIGN KEY (districtNum) REFERENCES districts(districtNum)
);

-- Insert sample data into districts table
INSERT INTO districts (districtNum, name) VALUES (1, 'Innere Stadt');
INSERT INTO districts (districtNum, name) VALUES (2, 'Leopoldstadt');

-- Insert sample data into quests table
INSERT INTO quests (districtNum, questName, questDescription, isCompleted) VALUES (1, 'Quest 1', 'Description 1', 0);
INSERT INTO quests (districtNum, questName, questDescription, isCompleted) VALUES (1, 'Quest 2', 'Description 2', 1);
INSERT INTO quests (districtNum, questName, questDescription, isCompleted) VALUES (2, 'Quest 3', 'Description 3', 0);
