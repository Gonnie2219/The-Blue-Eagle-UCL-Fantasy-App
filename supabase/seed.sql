-- ============================================================
-- The Blue Eagle - UCL Fantasy App Seed Data
-- 2025-26 Champions League Round of 16 Teams & Players
-- ============================================================

-- ============================================================
-- LIVERPOOL
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Liverpool', 'LIV', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Alisson', 'GK', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Giorgi Mamardashvili', 'GK', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Virgil van Dijk', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Ibrahima Konate', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Joe Gomez', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Andy Robertson', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Milos Kerkez', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Conor Bradley', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Jeremie Frimpong', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Ryan Gravenberch', 'MID', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Alexis Mac Allister', 'MID', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Dominik Szoboszlai', 'MID', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Curtis Jones', 'MID', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Wataru Endo', 'MID', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Florian Wirtz', 'MID', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Mohamed Salah', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Alexander Isak', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Cody Gakpo', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Hugo Ekitike', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Rio Ngumoha', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LIV'));
INSERT INTO players (name, position, club_id) VALUES ('Federico Chiesa', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LIV'));

-- ============================================================
-- BARCELONA
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Barcelona', 'BAR', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Marc-Andre ter Stegen', 'GK', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Wojciech Szczesny', 'GK', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Joan Garcia', 'GK', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Jules Kounde', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Ronald Araujo', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Pau Cubarsi', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Andreas Christensen', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Alejandro Balde', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Eric Garcia', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Gerard Martin', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Pedri', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Gavi', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Frenkie de Jong', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Marc Casado', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Marc Bernal', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Dani Olmo', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Fermin Lopez', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Lamine Yamal', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Raphinha', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Robert Lewandowski', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Marcus Rashford', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Ferran Torres', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAR'));
INSERT INTO players (name, position, club_id) VALUES ('Roony Bardghji', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAR'));

-- ============================================================
-- REAL MADRID
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Real Madrid', 'RMA', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Thibaut Courtois', 'GK', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Andriy Lunin', 'GK', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Dani Carvajal', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Trent Alexander-Arnold', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Eder Militao', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('David Alaba', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Antonio Rudiger', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Dean Huijsen', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Alvaro Carreras', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Ferland Mendy', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Fran Garcia', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Raul Asencio', 'DEF', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Jude Bellingham', 'MID', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Eduardo Camavinga', 'MID', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Fede Valverde', 'MID', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Aurelien Tchouameni', 'MID', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Arda Guler', 'MID', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Dani Ceballos', 'MID', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Brahim Diaz', 'MID', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Vinicius Junior', 'FWD', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Kylian Mbappe', 'FWD', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Rodrygo', 'FWD', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Endrick', 'FWD', (SELECT id FROM clubs WHERE short_name = 'RMA'));
INSERT INTO players (name, position, club_id) VALUES ('Franco Mastantuono', 'FWD', (SELECT id FROM clubs WHERE short_name = 'RMA'));

-- ============================================================
-- MANCHESTER CITY
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Manchester City', 'MCI', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Gianluigi Donnarumma', 'GK', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('James Trafford', 'GK', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Ruben Dias', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('John Stones', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Nathan Ake', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Josko Gvardiol', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Rayan Ait-Nouri', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Marc Guehi', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Abdukodir Khusanov', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Rico Lewis', 'DEF', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Rodri', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Bernardo Silva', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Mateo Kovacic', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Tijjani Reijnders', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Rayan Cherki', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Phil Foden', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Matheus Nunes', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Nico Gonzalez', 'MID', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Savinho', 'FWD', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Jeremy Doku', 'FWD', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Erling Haaland', 'FWD', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Omar Marmoush', 'FWD', (SELECT id FROM clubs WHERE short_name = 'MCI'));
INSERT INTO players (name, position, club_id) VALUES ('Antoine Semenyo', 'FWD', (SELECT id FROM clubs WHERE short_name = 'MCI'));

-- ============================================================
-- ARSENAL
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Arsenal', 'ARS', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('David Raya', 'GK', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Kepa Arrizabalaga', 'GK', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('William Saliba', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Gabriel', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Jurrien Timber', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Ben White', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Riccardo Calafiori', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Cristhian Mosquera', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Piero Hincapie', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Martin Odegaard', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Declan Rice', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Martin Zubimendi', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Mikel Merino', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Kai Havertz', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Eberechi Eze', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Leandro Trossard', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Christian Norgaard', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Noni Madueke', 'MID', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Bukayo Saka', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Viktor Gyokeres', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ARS'));
INSERT INTO players (name, position, club_id) VALUES ('Gabriel Martinelli', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ARS'));

-- ============================================================
-- TOTTENHAM
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Tottenham', 'TOT', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Guglielmo Vicario', 'GK', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Antonin Kinsky', 'GK', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Cristian Romero', 'DEF', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Micky van de Ven', 'DEF', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Pedro Porro', 'DEF', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Destiny Udogie', 'DEF', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Kevin Danso', 'DEF', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Radu Dragusin', 'DEF', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Djed Spence', 'DEF', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Joao Palhinha', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Xavi Simons', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Mohammed Kudus', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Conor Gallagher', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Lucas Bergvall', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Archie Gray', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Pape Matar Sarr', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Wilson Odobert', 'MID', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Richarlison', 'FWD', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Dominic Solanke', 'FWD', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Mathys Tel', 'FWD', (SELECT id FROM clubs WHERE short_name = 'TOT'));
INSERT INTO players (name, position, club_id) VALUES ('Randal Kolo Muani', 'FWD', (SELECT id FROM clubs WHERE short_name = 'TOT'));

-- ============================================================
-- BAYERN MUNICH
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Bayern Munich', 'BAY', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Manuel Neuer', 'GK', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Sven Ulreich', 'GK', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Dayot Upamecano', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Minjae Kim', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Jonathan Tah', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Hiroki Ito', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Raphael Guerreiro', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Josip Stanisic', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Joshua Kimmich', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Leon Goretzka', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Jamal Musiala', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Michael Olise', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Alphonso Davies', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Konrad Laimer', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Aleksandar Pavlovic', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Tom Bischof', 'MID', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Harry Kane', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Serge Gnabry', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Luis Diaz', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAY'));
INSERT INTO players (name, position, club_id) VALUES ('Nicolas Jackson', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BAY'));

-- ============================================================
-- ATALANTA
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Atalanta', 'ATA', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Marco Carnesecchi', 'GK', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Marco Sportiello', 'GK', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Odilon Kossounou', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Isak Hien', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Berat Djimsiti', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Sead Kolasinac', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Giorgio Scalvini', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Raoul Bellanova', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Davide Zappacosta', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Mitchel Bakker', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Ederson', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Marten de Roon', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Mario Pasalic', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Lazar Samardzic', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Yunus Musah', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Nicola Zalewski', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Charles De Ketelaere', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Gianluca Scamacca', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Nikola Krstovic', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Giacomo Raspadori', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATA'));
INSERT INTO players (name, position, club_id) VALUES ('Kamaldeen Sulemana', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATA'));

-- ============================================================
-- NEWCASTLE
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Newcastle', 'NEW', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Nick Pope', 'GK', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Aaron Ramsdale', 'GK', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Kieran Trippier', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Sven Botman', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Fabian Schar', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Malick Thiaw', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Dan Burn', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Tino Livramento', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Emil Krafth', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Lewis Hall', 'DEF', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Bruno Guimaraes', 'MID', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Sandro Tonali', 'MID', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Joelinton', 'MID', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Joe Willock', 'MID', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Jacob Ramsey', 'MID', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Lewis Miley', 'MID', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Anthony Gordon', 'FWD', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Harvey Barnes', 'FWD', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Yoane Wissa', 'FWD', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Anthony Elanga', 'FWD', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Jacob Murphy', 'FWD', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('Nick Woltemade', 'FWD', (SELECT id FROM clubs WHERE short_name = 'NEW'));
INSERT INTO players (name, position, club_id) VALUES ('William Osula', 'FWD', (SELECT id FROM clubs WHERE short_name = 'NEW'));

-- ============================================================
-- GALATASARAY
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Galatasaray', 'GAL', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Ugurcan Cakir', 'GK', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Gunay Guvenc', 'GK', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Davinson Sanchez', 'DEF', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Abdulkerim Bardakci', 'DEF', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Kaan Ayhan', 'DEF', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Ismail Jakobs', 'DEF', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Wilfried Singo', 'DEF', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Sacha Boey', 'DEF', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Eren Elmali', 'DEF', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Ilkay Gundogan', 'MID', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Leroy Sane', 'MID', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Lucas Torreira', 'MID', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Mario Lemina', 'MID', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Gabriel Sara', 'MID', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Yaser Asprilla', 'MID', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Ahmed Kutucu', 'MID', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Victor Osimhen', 'FWD', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Mauro Icardi', 'FWD', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Baris Alper Yilmaz', 'FWD', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Yunus Akgun', 'FWD', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Roland Sallai', 'FWD', (SELECT id FROM clubs WHERE short_name = 'GAL'));
INSERT INTO players (name, position, club_id) VALUES ('Noa Lang', 'FWD', (SELECT id FROM clubs WHERE short_name = 'GAL'));

-- ============================================================
-- ATLETICO MADRID
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Atletico Madrid', 'ATM', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Jan Oblak', 'GK', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Juan Musso', 'GK', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Jose Maria Gimenez', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Robin Le Normand', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('David Hancko', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Clement Lenglet', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Nahuel Molina', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Marc Pubill', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Matteo Ruggeri', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Daniel Munoz', 'DEF', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Koke', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Marcos Llorente', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Pablo Barrios', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Alex Baena', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Johnny Cardoso', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Thiago Almada', 'MID', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Antoine Griezmann', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Julian Alvarez', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Alexander Sorloth', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Giuliano Simeone', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Ademola Lookman', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATM'));
INSERT INTO players (name, position, club_id) VALUES ('Nicolas Gonzalez', 'FWD', (SELECT id FROM clubs WHERE short_name = 'ATM'));

-- ============================================================
-- BAYER LEVERKUSEN
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Bayer Leverkusen', 'LEV', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Mark Flekken', 'GK', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Jonas Omlin', 'GK', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Janis Blaswich', 'GK', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Edmond Tapsoba', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Jarell Quansah', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Loic Bade', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Arthur', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Alejandro Grimaldo', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Lucas Vazquez', 'DEF', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Robert Andrich', 'MID', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Equi Fernandez', 'MID', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Aleix Garcia', 'MID', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Exequiel Palacios', 'MID', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Jonas Hofmann', 'MID', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Malik Tillman', 'MID', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Ibrahim Maza', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Patrik Schick', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Martin Terrier', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Nathan Tella', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LEV'));
INSERT INTO players (name, position, club_id) VALUES ('Eliesse Ben Seghir', 'FWD', (SELECT id FROM clubs WHERE short_name = 'LEV'));

-- ============================================================
-- PSG
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Paris Saint-Germain', 'PSG', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Matvey Safonov', 'GK', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Lucas Chevalier', 'GK', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Marquinhos', 'DEF', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Achraf Hakimi', 'DEF', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Nuno Mendes', 'DEF', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Illia Zabarnyi', 'DEF', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Lucas Hernandez', 'DEF', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Willian Pacho', 'DEF', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Lucas Beraldo', 'DEF', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Vitinha', 'MID', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Fabian Ruiz', 'MID', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Joao Neves', 'MID', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Warren Zaire-Emery', 'MID', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Kang-in Lee', 'MID', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Senny Mayulu', 'MID', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Ousmane Dembele', 'FWD', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Goncalo Ramos', 'FWD', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Khvicha Kvaratskhelia', 'FWD', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Bradley Barcola', 'FWD', (SELECT id FROM clubs WHERE short_name = 'PSG'));
INSERT INTO players (name, position, club_id) VALUES ('Desire Doue', 'FWD', (SELECT id FROM clubs WHERE short_name = 'PSG'));

-- ============================================================
-- CHELSEA
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Chelsea', 'CHE', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Robert Sanchez', 'GK', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Filip Jorgensen', 'GK', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Reece James', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Wesley Fofana', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Levi Colwill', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Marc Cucurella', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Malo Gusto', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Tosin Adarabioyo', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Benoit Badiashile', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Jorell Hato', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Trevoh Chalobah', 'DEF', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Moises Caicedo', 'MID', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Enzo Fernandez', 'MID', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Andrey Santos', 'MID', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Cole Palmer', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Pedro Neto', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Liam Delap', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Alejandro Garnacho', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Jamie Gittens', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Joao Pedro', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Marc Guiu', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));
INSERT INTO players (name, position, club_id) VALUES ('Estevao Willian', 'FWD', (SELECT id FROM clubs WHERE short_name = 'CHE'));

-- ============================================================
-- BODO/GLIMT
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Bodo/Glimt', 'BOD', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Nikita Haikin', 'GK', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Julian Faye Lund', 'GK', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Fredrik Andre Bjorkan', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Odin Bjortuft', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Villads Nielsen', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Haitam Aleesami', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Jostein Gundersen', 'DEF', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Patrick Berg', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Ulrik Saltnes', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Sondre Brunstad Fet', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Hakon Evjen', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Sondre Auklend', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Fredrik Sjovold', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Anders Klynge', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Magnus Riisnaes', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('August Mikkelsen', 'MID', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Jens Petter Hauge', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Kasper Hogh', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Ole Didrik Blomberg', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Andreas Helmersen', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Daniel Bassi', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BOD'));
INSERT INTO players (name, position, club_id) VALUES ('Isak Dybvik Maatta', 'FWD', (SELECT id FROM clubs WHERE short_name = 'BOD'));

-- ============================================================
-- SPORTING CP
-- ============================================================
INSERT INTO clubs (name, short_name, ucl_stage) VALUES ('Sporting CP', 'SCP', 'r16');

INSERT INTO players (name, position, club_id) VALUES ('Rui Silva', 'GK', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Joao Virginia', 'GK', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Goncalo Inacio', 'DEF', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Ousmane Diomande', 'DEF', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Zeno Debast', 'DEF', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Matheus Reis', 'DEF', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Ivan Fresneda', 'DEF', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Eduardo Quaresma', 'DEF', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Ricardo Mangas', 'DEF', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Morten Hjulmand', 'MID', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Pedro Goncalves', 'MID', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Hidemasa Morita', 'MID', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Daniel Braganca', 'MID', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Giorgi Kochorashvili', 'MID', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Maximiliano Araujo', 'MID', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Francisco Trincao', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Geovany Quenda', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Geny Catamo', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Nuno Santos', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Fotis Ioannidis', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Luis Guilherme', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Luis Suarez', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));
INSERT INTO players (name, position, club_id) VALUES ('Rodrigo Ribeiro', 'FWD', (SELECT id FROM clubs WHERE short_name = 'SCP'));

-- ============================================================
-- MATCHDAY 1: Round of 16 - First Leg (March 10-11, 2026)
-- ============================================================
INSERT INTO matchdays (name, status, first_kickoff, lineup_lock_at, trade_deadline_at)
VALUES (
  'R16 - First Leg',
  'upcoming',
  '2026-03-10T18:45:00Z',
  '2026-03-10T18:15:00Z',
  '2026-03-10T06:45:00Z'
);

-- Tuesday March 10 matches
INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'GAL'),
  (SELECT id FROM clubs WHERE short_name = 'LIV'),
  '2026-03-10T18:45:00Z',
  'Tuesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'ATA'),
  (SELECT id FROM clubs WHERE short_name = 'BAY'),
  '2026-03-10T21:00:00Z',
  'Tuesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'ATM'),
  (SELECT id FROM clubs WHERE short_name = 'TOT'),
  '2026-03-10T21:00:00Z',
  'Tuesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'NEW'),
  (SELECT id FROM clubs WHERE short_name = 'BAR'),
  '2026-03-10T21:00:00Z',
  'Tuesday'
);

-- Wednesday March 11 matches
INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'LEV'),
  (SELECT id FROM clubs WHERE short_name = 'ARS'),
  '2026-03-11T18:45:00Z',
  'Wednesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'BOD'),
  (SELECT id FROM clubs WHERE short_name = 'SCP'),
  '2026-03-11T18:45:00Z',
  'Wednesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'PSG'),
  (SELECT id FROM clubs WHERE short_name = 'CHE'),
  '2026-03-11T21:00:00Z',
  'Wednesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - First Leg'),
  (SELECT id FROM clubs WHERE short_name = 'RMA'),
  (SELECT id FROM clubs WHERE short_name = 'MCI'),
  '2026-03-11T21:00:00Z',
  'Wednesday'
);

-- ============================================================
-- MATCHDAY 2: Round of 16 - Second Leg (March 17-18, 2026)
-- ============================================================
INSERT INTO matchdays (name, status, first_kickoff, lineup_lock_at, trade_deadline_at)
VALUES (
  'R16 - Second Leg',
  'upcoming',
  '2026-03-17T18:45:00Z',
  '2026-03-17T18:15:00Z',
  '2026-03-17T06:45:00Z'
);

-- Tuesday March 17 matches (home/away reversed)
INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'LIV'),
  (SELECT id FROM clubs WHERE short_name = 'GAL'),
  '2026-03-17T18:45:00Z',
  'Tuesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'BAY'),
  (SELECT id FROM clubs WHERE short_name = 'ATA'),
  '2026-03-17T21:00:00Z',
  'Tuesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'TOT'),
  (SELECT id FROM clubs WHERE short_name = 'ATM'),
  '2026-03-17T21:00:00Z',
  'Tuesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'BAR'),
  (SELECT id FROM clubs WHERE short_name = 'NEW'),
  '2026-03-17T21:00:00Z',
  'Tuesday'
);

-- Wednesday March 18 matches (home/away reversed)
INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'ARS'),
  (SELECT id FROM clubs WHERE short_name = 'LEV'),
  '2026-03-18T18:45:00Z',
  'Wednesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'SCP'),
  (SELECT id FROM clubs WHERE short_name = 'BOD'),
  '2026-03-18T18:45:00Z',
  'Wednesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'CHE'),
  (SELECT id FROM clubs WHERE short_name = 'PSG'),
  '2026-03-18T21:00:00Z',
  'Wednesday'
);

INSERT INTO matches (matchday_id, home_club_id, away_club_id, kickoff_at, match_day_label)
VALUES (
  (SELECT id FROM matchdays WHERE name = 'R16 - Second Leg'),
  (SELECT id FROM clubs WHERE short_name = 'MCI'),
  (SELECT id FROM clubs WHERE short_name = 'RMA'),
  '2026-03-18T21:00:00Z',
  'Wednesday'
);
