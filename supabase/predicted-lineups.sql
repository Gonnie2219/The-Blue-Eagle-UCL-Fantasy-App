-- ============================================================
-- Predicted Lineups table + seed data for R16 First Leg
-- Run this in the Supabase SQL Editor
-- ============================================================

create table if not exists predicted_lineups (
  id serial primary key,
  match_id integer references matches(id) on delete cascade,
  player_id integer references players(id),
  lineup_position integer not null, -- 1-11
  unique(match_id, player_id)
);

alter table predicted_lineups enable row level security;
create policy "Anyone can read predicted lineups" on predicted_lineups for select using (true);
create policy "Admins can manage predicted lineups" on predicted_lineups for all using (is_admin());

-- ============================================================
-- Helper: insert lineup by player name + club short_name
-- ============================================================
create or replace function insert_lineup(
  p_home_short text, p_away_short text, p_matchday_name text,
  p_player_name text, p_pos integer
)
returns void as $$
declare
  v_match_id integer;
  v_player_id integer;
begin
  select m.id into v_match_id
  from matches m
  join clubs h on h.id = m.home_club_id
  join clubs a on a.id = m.away_club_id
  join matchdays md on md.id = m.matchday_id
  where h.short_name = p_home_short
    and a.short_name = p_away_short
    and md.name = p_matchday_name;

  select p.id into v_player_id
  from players p
  where p.name = p_player_name
  limit 1;

  if v_match_id is not null and v_player_id is not null then
    insert into predicted_lineups (match_id, player_id, lineup_position)
    values (v_match_id, v_player_id, p_pos)
    on conflict (match_id, player_id) do update set lineup_position = p_pos;
  end if;
end;
$$ language plpgsql;

-- ============================================================
-- GALATASARAY vs LIVERPOOL (Tue March 10, 18:45)
-- ============================================================
-- Galatasaray predicted XI
select insert_lineup('GAL','LIV','R16 - First Leg','Ugurcan Cakir',1);
select insert_lineup('GAL','LIV','R16 - First Leg','Davinson Sanchez',2);
select insert_lineup('GAL','LIV','R16 - First Leg','Abdulkerim Bardakci',3);
select insert_lineup('GAL','LIV','R16 - First Leg','Ismail Jakobs',4);
select insert_lineup('GAL','LIV','R16 - First Leg','Wilfried Singo',5);
select insert_lineup('GAL','LIV','R16 - First Leg','Lucas Torreira',6);
select insert_lineup('GAL','LIV','R16 - First Leg','Ilkay Gundogan',7);
select insert_lineup('GAL','LIV','R16 - First Leg','Leroy Sane',8);
select insert_lineup('GAL','LIV','R16 - First Leg','Baris Alper Yilmaz',9);
select insert_lineup('GAL','LIV','R16 - First Leg','Victor Osimhen',10);
select insert_lineup('GAL','LIV','R16 - First Leg','Mario Lemina',11);

-- Liverpool predicted XI
select insert_lineup('GAL','LIV','R16 - First Leg','Alisson',1);
select insert_lineup('GAL','LIV','R16 - First Leg','Virgil van Dijk',2);
select insert_lineup('GAL','LIV','R16 - First Leg','Ibrahima Konate',3);
select insert_lineup('GAL','LIV','R16 - First Leg','Andy Robertson',4);
select insert_lineup('GAL','LIV','R16 - First Leg','Jeremie Frimpong',5);
select insert_lineup('GAL','LIV','R16 - First Leg','Ryan Gravenberch',6);
select insert_lineup('GAL','LIV','R16 - First Leg','Alexis Mac Allister',7);
select insert_lineup('GAL','LIV','R16 - First Leg','Dominik Szoboszlai',8);
select insert_lineup('GAL','LIV','R16 - First Leg','Mohamed Salah',9);
select insert_lineup('GAL','LIV','R16 - First Leg','Cody Gakpo',10);
select insert_lineup('GAL','LIV','R16 - First Leg','Hugo Ekitike',11);

-- ============================================================
-- ATALANTA vs BAYERN MUNICH (Tue March 10, 21:00)
-- ============================================================
-- Atalanta predicted XI
select insert_lineup('ATA','BAY','R16 - First Leg','Marco Carnesecchi',1);
select insert_lineup('ATA','BAY','R16 - First Leg','Berat Djimsiti',2);
select insert_lineup('ATA','BAY','R16 - First Leg','Isak Hien',3);
select insert_lineup('ATA','BAY','R16 - First Leg','Odilon Kossounou',4);
select insert_lineup('ATA','BAY','R16 - First Leg','Ederson',5);
select insert_lineup('ATA','BAY','R16 - First Leg','Marten de Roon',6);
select insert_lineup('ATA','BAY','R16 - First Leg','Davide Zappacosta',7);
select insert_lineup('ATA','BAY','R16 - First Leg','Raoul Bellanova',8);
select insert_lineup('ATA','BAY','R16 - First Leg','Charles De Ketelaere',9);
select insert_lineup('ATA','BAY','R16 - First Leg','Gianluca Scamacca',10);
select insert_lineup('ATA','BAY','R16 - First Leg','Nikola Krstovic',11);

-- Bayern predicted XI
select insert_lineup('ATA','BAY','R16 - First Leg','Manuel Neuer',1);
select insert_lineup('ATA','BAY','R16 - First Leg','Jonathan Tah',2);
select insert_lineup('ATA','BAY','R16 - First Leg','Minjae Kim',3);
select insert_lineup('ATA','BAY','R16 - First Leg','Hiroki Ito',4);
select insert_lineup('ATA','BAY','R16 - First Leg','Joshua Kimmich',5);
select insert_lineup('ATA','BAY','R16 - First Leg','Aleksandar Pavlovic',6);
select insert_lineup('ATA','BAY','R16 - First Leg','Leon Goretzka',7);
select insert_lineup('ATA','BAY','R16 - First Leg','Jamal Musiala',8);
select insert_lineup('ATA','BAY','R16 - First Leg','Michael Olise',9);
select insert_lineup('ATA','BAY','R16 - First Leg','Luis Diaz',10);
select insert_lineup('ATA','BAY','R16 - First Leg','Harry Kane',11);

-- ============================================================
-- ATLETICO MADRID vs TOTTENHAM (Tue March 10, 21:00)
-- ============================================================
-- Atletico predicted XI
select insert_lineup('ATM','TOT','R16 - First Leg','Jan Oblak',1);
select insert_lineup('ATM','TOT','R16 - First Leg','Robin Le Normand',2);
select insert_lineup('ATM','TOT','R16 - First Leg','David Hancko',3);
select insert_lineup('ATM','TOT','R16 - First Leg','Nahuel Molina',4);
select insert_lineup('ATM','TOT','R16 - First Leg','Marc Pubill',5);
select insert_lineup('ATM','TOT','R16 - First Leg','Pablo Barrios',6);
select insert_lineup('ATM','TOT','R16 - First Leg','Alex Baena',7);
select insert_lineup('ATM','TOT','R16 - First Leg','Marcos Llorente',8);
select insert_lineup('ATM','TOT','R16 - First Leg','Antoine Griezmann',9);
select insert_lineup('ATM','TOT','R16 - First Leg','Julian Alvarez',10);
select insert_lineup('ATM','TOT','R16 - First Leg','Ademola Lookman',11);

-- Tottenham predicted XI
select insert_lineup('ATM','TOT','R16 - First Leg','Guglielmo Vicario',1);
select insert_lineup('ATM','TOT','R16 - First Leg','Cristian Romero',2);
select insert_lineup('ATM','TOT','R16 - First Leg','Kevin Danso',3);
select insert_lineup('ATM','TOT','R16 - First Leg','Destiny Udogie',4);
select insert_lineup('ATM','TOT','R16 - First Leg','Pedro Porro',5);
select insert_lineup('ATM','TOT','R16 - First Leg','Pape Matar Sarr',6);
select insert_lineup('ATM','TOT','R16 - First Leg','Archie Gray',7);
select insert_lineup('ATM','TOT','R16 - First Leg','Xavi Simons',8);
select insert_lineup('ATM','TOT','R16 - First Leg','Dominic Solanke',9);
select insert_lineup('ATM','TOT','R16 - First Leg','Mathys Tel',10);
select insert_lineup('ATM','TOT','R16 - First Leg','Wilson Odobert',11);

-- ============================================================
-- NEWCASTLE vs BARCELONA (Tue March 10, 21:00)
-- ============================================================
-- Newcastle predicted XI
select insert_lineup('NEW','BAR','R16 - First Leg','Nick Pope',1);
select insert_lineup('NEW','BAR','R16 - First Leg','Sven Botman',2);
select insert_lineup('NEW','BAR','R16 - First Leg','Malick Thiaw',3);
select insert_lineup('NEW','BAR','R16 - First Leg','Dan Burn',4);
select insert_lineup('NEW','BAR','R16 - First Leg','Kieran Trippier',5);
select insert_lineup('NEW','BAR','R16 - First Leg','Bruno Guimaraes',6);
select insert_lineup('NEW','BAR','R16 - First Leg','Sandro Tonali',7);
select insert_lineup('NEW','BAR','R16 - First Leg','Jacob Ramsey',8);
select insert_lineup('NEW','BAR','R16 - First Leg','Anthony Gordon',9);
select insert_lineup('NEW','BAR','R16 - First Leg','Harvey Barnes',10);
select insert_lineup('NEW','BAR','R16 - First Leg','Yoane Wissa',11);

-- Barcelona predicted XI
select insert_lineup('NEW','BAR','R16 - First Leg','Joan Garcia',1);
select insert_lineup('NEW','BAR','R16 - First Leg','Jules Kounde',2);
select insert_lineup('NEW','BAR','R16 - First Leg','Pau Cubarsi',3);
select insert_lineup('NEW','BAR','R16 - First Leg','Alejandro Balde',4);
select insert_lineup('NEW','BAR','R16 - First Leg','Eric Garcia',5);
select insert_lineup('NEW','BAR','R16 - First Leg','Marc Casado',6);
select insert_lineup('NEW','BAR','R16 - First Leg','Fermin Lopez',7);
select insert_lineup('NEW','BAR','R16 - First Leg','Dani Olmo',8);
select insert_lineup('NEW','BAR','R16 - First Leg','Raphinha',9);
select insert_lineup('NEW','BAR','R16 - First Leg','Lamine Yamal',10);
select insert_lineup('NEW','BAR','R16 - First Leg','Robert Lewandowski',11);

-- ============================================================
-- LEVERKUSEN vs ARSENAL (Wed March 11, 18:45)
-- ============================================================
-- Leverkusen predicted XI
select insert_lineup('LEV','ARS','R16 - First Leg','Mark Flekken',1);
select insert_lineup('LEV','ARS','R16 - First Leg','Edmond Tapsoba',2);
select insert_lineup('LEV','ARS','R16 - First Leg','Loic Bade',3);
select insert_lineup('LEV','ARS','R16 - First Leg','Jarell Quansah',4);
select insert_lineup('LEV','ARS','R16 - First Leg','Alejandro Grimaldo',5);
select insert_lineup('LEV','ARS','R16 - First Leg','Robert Andrich',6);
select insert_lineup('LEV','ARS','R16 - First Leg','Aleix Garcia',7);
select insert_lineup('LEV','ARS','R16 - First Leg','Equi Fernandez',8);
select insert_lineup('LEV','ARS','R16 - First Leg','Malik Tillman',9);
select insert_lineup('LEV','ARS','R16 - First Leg','Ibrahim Maza',10);
select insert_lineup('LEV','ARS','R16 - First Leg','Patrik Schick',11);

-- Arsenal predicted XI
select insert_lineup('LEV','ARS','R16 - First Leg','David Raya',1);
select insert_lineup('LEV','ARS','R16 - First Leg','William Saliba',2);
select insert_lineup('LEV','ARS','R16 - First Leg','Gabriel',3);
select insert_lineup('LEV','ARS','R16 - First Leg','Ben White',4);
select insert_lineup('LEV','ARS','R16 - First Leg','Riccardo Calafiori',5);
select insert_lineup('LEV','ARS','R16 - First Leg','Declan Rice',6);
select insert_lineup('LEV','ARS','R16 - First Leg','Martin Zubimendi',7);
select insert_lineup('LEV','ARS','R16 - First Leg','Martin Odegaard',8);
select insert_lineup('LEV','ARS','R16 - First Leg','Bukayo Saka',9);
select insert_lineup('LEV','ARS','R16 - First Leg','Leandro Trossard',10);
select insert_lineup('LEV','ARS','R16 - First Leg','Viktor Gyokeres',11);

-- ============================================================
-- BODO/GLIMT vs SPORTING CP (Wed March 11, 18:45)
-- ============================================================
-- Bodo/Glimt predicted XI
select insert_lineup('BOD','SCP','R16 - First Leg','Nikita Haikin',1);
select insert_lineup('BOD','SCP','R16 - First Leg','Fredrik Andre Bjorkan',2);
select insert_lineup('BOD','SCP','R16 - First Leg','Odin Bjortuft',3);
select insert_lineup('BOD','SCP','R16 - First Leg','Haitam Aleesami',4);
select insert_lineup('BOD','SCP','R16 - First Leg','Jostein Gundersen',5);
select insert_lineup('BOD','SCP','R16 - First Leg','Patrick Berg',6);
select insert_lineup('BOD','SCP','R16 - First Leg','Sondre Brunstad Fet',7);
select insert_lineup('BOD','SCP','R16 - First Leg','Hakon Evjen',8);
select insert_lineup('BOD','SCP','R16 - First Leg','Sondre Auklend',9);
select insert_lineup('BOD','SCP','R16 - First Leg','Jens Petter Hauge',10);
select insert_lineup('BOD','SCP','R16 - First Leg','Kasper Hogh',11);

-- Sporting CP predicted XI
select insert_lineup('BOD','SCP','R16 - First Leg','Rui Silva',1);
select insert_lineup('BOD','SCP','R16 - First Leg','Goncalo Inacio',2);
select insert_lineup('BOD','SCP','R16 - First Leg','Ousmane Diomande',3);
select insert_lineup('BOD','SCP','R16 - First Leg','Matheus Reis',4);
select insert_lineup('BOD','SCP','R16 - First Leg','Ivan Fresneda',5);
select insert_lineup('BOD','SCP','R16 - First Leg','Morten Hjulmand',6);
select insert_lineup('BOD','SCP','R16 - First Leg','Pedro Goncalves',7);
select insert_lineup('BOD','SCP','R16 - First Leg','Francisco Trincao',8);
select insert_lineup('BOD','SCP','R16 - First Leg','Geovany Quenda',9);
select insert_lineup('BOD','SCP','R16 - First Leg','Geny Catamo',10);
select insert_lineup('BOD','SCP','R16 - First Leg','Fotis Ioannidis',11);

-- ============================================================
-- PSG vs CHELSEA (Wed March 11, 21:00)
-- ============================================================
-- PSG predicted XI
select insert_lineup('PSG','CHE','R16 - First Leg','Lucas Chevalier',1);
select insert_lineup('PSG','CHE','R16 - First Leg','Marquinhos',2);
select insert_lineup('PSG','CHE','R16 - First Leg','Willian Pacho',3);
select insert_lineup('PSG','CHE','R16 - First Leg','Nuno Mendes',4);
select insert_lineup('PSG','CHE','R16 - First Leg','Achraf Hakimi',5);
select insert_lineup('PSG','CHE','R16 - First Leg','Vitinha',6);
select insert_lineup('PSG','CHE','R16 - First Leg','Warren Zaire-Emery',7);
select insert_lineup('PSG','CHE','R16 - First Leg','Joao Neves',8);
select insert_lineup('PSG','CHE','R16 - First Leg','Ousmane Dembele',9);
select insert_lineup('PSG','CHE','R16 - First Leg','Khvicha Kvaratskhelia',10);
select insert_lineup('PSG','CHE','R16 - First Leg','Bradley Barcola',11);

-- Chelsea predicted XI
select insert_lineup('PSG','CHE','R16 - First Leg','Robert Sanchez',1);
select insert_lineup('PSG','CHE','R16 - First Leg','Reece James',2);
select insert_lineup('PSG','CHE','R16 - First Leg','Wesley Fofana',3);
select insert_lineup('PSG','CHE','R16 - First Leg','Marc Cucurella',4);
select insert_lineup('PSG','CHE','R16 - First Leg','Jorell Hato',5);
select insert_lineup('PSG','CHE','R16 - First Leg','Moises Caicedo',6);
select insert_lineup('PSG','CHE','R16 - First Leg','Enzo Fernandez',7);
select insert_lineup('PSG','CHE','R16 - First Leg','Cole Palmer',8);
select insert_lineup('PSG','CHE','R16 - First Leg','Pedro Neto',9);
select insert_lineup('PSG','CHE','R16 - First Leg','Jamie Gittens',10);
select insert_lineup('PSG','CHE','R16 - First Leg','Liam Delap',11);

-- ============================================================
-- REAL MADRID vs MAN CITY (Wed March 11, 21:00)
-- ============================================================
-- Real Madrid predicted XI
select insert_lineup('RMA','MCI','R16 - First Leg','Thibaut Courtois',1);
select insert_lineup('RMA','MCI','R16 - First Leg','Dean Huijsen',2);
select insert_lineup('RMA','MCI','R16 - First Leg','Antonio Rudiger',3);
select insert_lineup('RMA','MCI','R16 - First Leg','Alvaro Carreras',4);
select insert_lineup('RMA','MCI','R16 - First Leg','Trent Alexander-Arnold',5);
select insert_lineup('RMA','MCI','R16 - First Leg','Fede Valverde',6);
select insert_lineup('RMA','MCI','R16 - First Leg','Jude Bellingham',7);
select insert_lineup('RMA','MCI','R16 - First Leg','Aurelien Tchouameni',8);
select insert_lineup('RMA','MCI','R16 - First Leg','Vinicius Junior',9);
select insert_lineup('RMA','MCI','R16 - First Leg','Rodrygo',10);
select insert_lineup('RMA','MCI','R16 - First Leg','Kylian Mbappe',11);

-- Man City predicted XI
select insert_lineup('RMA','MCI','R16 - First Leg','Gianluigi Donnarumma',1);
select insert_lineup('RMA','MCI','R16 - First Leg','Nathan Ake',2);
select insert_lineup('RMA','MCI','R16 - First Leg','Ruben Dias',3);
select insert_lineup('RMA','MCI','R16 - First Leg','Rayan Ait-Nouri',4);
select insert_lineup('RMA','MCI','R16 - First Leg','Rico Lewis',5);
select insert_lineup('RMA','MCI','R16 - First Leg','Rodri',6);
select insert_lineup('RMA','MCI','R16 - First Leg','Bernardo Silva',7);
select insert_lineup('RMA','MCI','R16 - First Leg','Phil Foden',8);
select insert_lineup('RMA','MCI','R16 - First Leg','Rayan Cherki',9);
select insert_lineup('RMA','MCI','R16 - First Leg','Jeremy Doku',10);
select insert_lineup('RMA','MCI','R16 - First Leg','Erling Haaland',11);

-- Clean up helper function
drop function insert_lineup(text, text, text, text, integer);
