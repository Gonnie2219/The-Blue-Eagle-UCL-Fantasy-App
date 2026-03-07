-- The Blue Eagle - UCL Fantasy App Database Schema
-- Run this in the Supabase SQL Editor

-- ============================================================
-- HELPER: check if current user is admin
-- ============================================================
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and is_admin = true
  );
$$ language sql security definer stable;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  is_admin boolean default false,
  total_points integer default 0,
  free_transfers integer default 3,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can read all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and is_admin = (select p.is_admin from profiles p where p.id = auth.uid()));

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CLUBS
-- ============================================================
create table clubs (
  id serial primary key,
  name text not null unique,
  short_name text not null,
  logo_url text,
  ucl_stage text default 'group' -- group, r16, qf, sf, final
);

alter table clubs enable row level security;
create policy "Anyone can read clubs" on clubs for select using (true);
create policy "Admins can manage clubs" on clubs for all using (is_admin());

-- ============================================================
-- PLAYERS
-- ============================================================
create type player_position as enum ('GK', 'DEF', 'MID', 'FWD');

create table players (
  id serial primary key,
  ucl_id text unique,            -- external UCL database ID
  name text not null,
  position player_position not null,
  club_id integer references clubs(id),
  is_available boolean default true,
  photo_url text,
  created_at timestamptz default now()
);

alter table players enable row level security;
create policy "Anyone can read players" on players for select using (true);
create policy "Admins can manage players" on players for all using (is_admin());

-- ============================================================
-- MATCHDAYS
-- ============================================================
create type matchday_status as enum ('upcoming', 'live', 'completed');

create table matchdays (
  id serial primary key,
  name text not null,                     -- e.g. "Matchday 1"
  status matchday_status default 'upcoming',
  first_kickoff timestamptz not null,     -- first match kickoff time
  last_whistle timestamptz,               -- when last match ends
  lineup_lock_at timestamptz,             -- 30min before first_kickoff
  waiver_draft_ends_at timestamptz,       -- 48h after last_whistle
  lineup_window_opens_at timestamptz,     -- 24h after last_whistle
  trade_deadline_at timestamptz,          -- 12h before first_kickoff
  created_at timestamptz default now()
);

alter table matchdays enable row level security;
create policy "Anyone can read matchdays" on matchdays for select using (true);
create policy "Admins can manage matchdays" on matchdays for all using (is_admin());

-- ============================================================
-- MATCHES (individual games within a matchday)
-- ============================================================
create type match_status as enum ('scheduled', 'live', 'finished');

create table matches (
  id serial primary key,
  matchday_id integer references matchdays(id),
  home_club_id integer references clubs(id),
  away_club_id integer references clubs(id),
  kickoff_at timestamptz not null,
  home_score integer default 0,
  away_score integer default 0,
  status match_status default 'scheduled',
  match_day_label text                    -- "Tuesday" or "Wednesday"
);

alter table matches enable row level security;
create policy "Anyone can read matches" on matches for select using (true);
create policy "Admins can manage matches" on matches for all using (is_admin());

-- ============================================================
-- SQUADS (user's 21-player roster)
-- ============================================================
create table squad_players (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  player_id integer references players(id),
  is_starter boolean default false,
  is_captain boolean default false,
  is_vice_captain boolean default false,
  squad_position integer,                 -- slot index for lineup display
  added_at timestamptz default now(),
  unique(user_id, player_id)
);

alter table squad_players enable row level security;
create policy "Users can read all squads" on squad_players for select using (true);
create policy "Users can manage own squad" on squad_players for all using (auth.uid() = user_id);

-- ============================================================
-- DRAFT SESSIONS
-- ============================================================
create type draft_status as enum ('pending', 'active', 'paused', 'completed');
create type draft_type as enum ('initial', 'waiver');

create table draft_sessions (
  id serial primary key,
  matchday_id integer references matchdays(id),
  type draft_type not null,
  status draft_status default 'pending',
  pick_order uuid[] not null default '{}',  -- ordered array of user IDs
  current_pick integer default 0,
  current_round integer default 1,
  is_snake boolean default true,
  pick_timeout_seconds integer default 120,
  started_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

alter table draft_sessions enable row level security;
create policy "Anyone can read draft sessions" on draft_sessions for select using (true);
create policy "Admins can manage draft sessions" on draft_sessions for all using (is_admin());
-- Users need to update draft state when making picks
create policy "Users can update active drafts" on draft_sessions for update
  using (status = 'active' and auth.uid() = any(pick_order));

-- ============================================================
-- DRAFT PICKS
-- ============================================================
create table draft_picks (
  id serial primary key,
  draft_session_id integer references draft_sessions(id),
  user_id uuid references profiles(id),
  player_id integer references players(id),
  round integer not null,
  pick_number integer not null,
  picked_at timestamptz default now()
);

alter table draft_picks enable row level security;
create policy "Anyone can read draft picks" on draft_picks for select using (true);
create policy "Users can insert own picks" on draft_picks for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- TRADES
-- ============================================================
create type trade_status as enum ('pending', 'accepted', 'rejected', 'expired');

create table trades (
  id serial primary key,
  proposer_id uuid references profiles(id),
  receiver_id uuid references profiles(id),
  status trade_status default 'pending',
  proposed_at timestamptz default now(),
  resolved_at timestamptz,
  matchday_id integer references matchdays(id)
);

create table trade_players (
  id serial primary key,
  trade_id integer references trades(id) on delete cascade,
  player_id integer references players(id),
  from_user_id uuid references profiles(id),
  to_user_id uuid references profiles(id)
);

alter table trades enable row level security;
create policy "Users can read own trades" on trades for select
  using (auth.uid() = proposer_id or auth.uid() = receiver_id);
create policy "Users can propose trades" on trades for insert
  with check (auth.uid() = proposer_id);
create policy "Receivers can update trades" on trades for update
  using (auth.uid() = receiver_id);

alter table trade_players enable row level security;
create policy "Users can read own trade players" on trade_players for select
  using (
    exists (
      select 1 from trades t
      where t.id = trade_players.trade_id
        and (t.proposer_id = auth.uid() or t.receiver_id = auth.uid())
    )
  );
create policy "Users can insert trade players" on trade_players for insert
  with check (
    exists (
      select 1 from trades t
      where t.id = trade_players.trade_id
        and t.proposer_id = auth.uid()
    )
  );

-- ============================================================
-- PLAYER SCORES (per matchday)
-- ============================================================
create table player_scores (
  id serial primary key,
  player_id integer references players(id),
  matchday_id integer references matchdays(id),
  match_id integer references matches(id),
  minutes_played integer default 0,
  goals integer default 0,
  assists integer default 0,
  clean_sheet boolean default false,
  yellow_cards integer default 0,
  red_card boolean default false,
  penalties_won integer default 0,
  penalties_missed integer default 0,
  penalties_saved integer default 0,
  own_goals integer default 0,
  motm boolean default false,
  total_points integer default 0,
  is_manual_correction boolean default false,
  unique(player_id, match_id)
);

alter table player_scores enable row level security;
create policy "Anyone can read scores" on player_scores for select using (true);
create policy "Admins can manage scores" on player_scores for all using (is_admin());

-- ============================================================
-- TRANSFERS LOG
-- ============================================================
create table transfers (
  id serial primary key,
  user_id uuid references profiles(id),
  player_in_id integer references players(id),
  player_out_id integer references players(id),
  matchday_id integer references matchdays(id),
  is_free boolean default true,
  point_cost integer default 0,
  transferred_at timestamptz default now()
);

alter table transfers enable row level security;
create policy "Users can read own transfers" on transfers for select using (auth.uid() = user_id);
create policy "Users can insert own transfers" on transfers for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- MANUAL SUBSTITUTIONS (mid-matchday Tue->Wed swaps)
-- ============================================================
create table manual_subs (
  id serial primary key,
  user_id uuid references profiles(id),
  matchday_id integer references matchdays(id),
  player_out_id integer references players(id),   -- Tuesday player
  player_in_id integer references players(id),    -- Wednesday bench player
  subbed_at timestamptz default now()
);

alter table manual_subs enable row level security;
create policy "Users can read own subs" on manual_subs for select using (auth.uid() = user_id);
create policy "Users can make own subs" on manual_subs for insert with check (auth.uid() = user_id);

-- ============================================================
-- ATOMIC RPC FUNCTIONS
-- ============================================================

-- Make a draft pick atomically (insert pick + add to squad + advance state)
create or replace function rpc_make_draft_pick(
  p_session_id integer,
  p_user_id uuid,
  p_player_id integer,
  p_round integer,
  p_pick_number integer
)
returns jsonb as $$
declare
  v_total_pickers integer;
  v_next_pick integer;
  v_next_round integer;
  v_is_complete boolean;
  v_pick_order uuid[];
begin
  -- Verify caller matches the claimed user
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Get session info
  select pick_order into v_pick_order
  from draft_sessions where id = p_session_id and status = 'active';
  if not found then
    raise exception 'Draft session not active';
  end if;

  v_total_pickers := array_length(v_pick_order, 1);

  -- Insert the pick
  insert into draft_picks (draft_session_id, user_id, player_id, round, pick_number)
  values (p_session_id, p_user_id, p_player_id, p_round, p_pick_number);

  -- Add player to user's squad
  insert into squad_players (user_id, player_id, is_starter)
  values (p_user_id, p_player_id, false);

  -- Calculate next state
  v_next_pick := p_pick_number + 1;
  v_next_round := (v_next_pick / v_total_pickers) + 1;
  v_is_complete := v_next_round > 21; -- 21-player squad

  -- Advance draft session
  update draft_sessions set
    current_pick = v_next_pick,
    current_round = case when v_is_complete then 21 else v_next_round end,
    status = case when v_is_complete then 'completed' else 'active' end
  where id = p_session_id;

  return jsonb_build_object(
    'next_pick', v_next_pick,
    'next_round', v_next_round,
    'is_complete', v_is_complete
  );
end;
$$ language plpgsql security definer;

-- Accept a trade atomically (verify + swap players + mark accepted)
create or replace function rpc_accept_trade(
  p_trade_id integer,
  p_user_id uuid
)
returns void as $$
declare
  v_trade record;
  v_tp record;
begin
  -- Verify caller matches the claimed user
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Verify trade is pending and receiver matches
  select * into v_trade from trades
  where id = p_trade_id and status = 'pending' and receiver_id = p_user_id;
  if not found then
    raise exception 'Trade not found or not pending';
  end if;

  -- Swap each player
  for v_tp in select * from trade_players where trade_id = p_trade_id loop
    -- Verify the player still belongs to the expected user
    if not exists (
      select 1 from squad_players
      where user_id = v_tp.from_user_id and player_id = v_tp.player_id
    ) then
      raise exception 'Player % no longer owned by expected user', v_tp.player_id;
    end if;

    update squad_players set
      user_id = v_tp.to_user_id,
      is_starter = false,
      is_captain = false,
      is_vice_captain = false
    where user_id = v_tp.from_user_id and player_id = v_tp.player_id;
  end loop;

  -- Mark trade as accepted
  update trades set status = 'accepted', resolved_at = now()
  where id = p_trade_id;
end;
$$ language plpgsql security definer;

-- Make a transfer atomically (remove old + add new + log + update profile)
create or replace function rpc_make_transfer(
  p_user_id uuid,
  p_player_in_id integer,
  p_player_out_id integer
)
returns void as $$
declare
  v_profile record;
  v_is_free boolean;
  v_point_cost integer;
begin
  -- Verify caller matches the claimed user
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Get fresh profile
  select * into v_profile from profiles where id = p_user_id;
  if not found then
    raise exception 'Profile not found';
  end if;

  v_is_free := v_profile.free_transfers > 0;
  v_point_cost := case when v_is_free then 0 else 3 end;

  -- Remove old player (verify ownership)
  delete from squad_players
  where user_id = p_user_id and player_id = p_player_out_id;
  if not found then
    raise exception 'Player not in your squad';
  end if;

  -- Add new player
  insert into squad_players (user_id, player_id, is_starter)
  values (p_user_id, p_player_in_id, false);

  -- Log the transfer
  insert into transfers (user_id, player_in_id, player_out_id, is_free, point_cost)
  values (p_user_id, p_player_in_id, p_player_out_id, v_is_free, v_point_cost);

  -- Update profile
  update profiles set
    free_transfers = case when v_is_free then free_transfers - 1 else free_transfers end,
    total_points = case when v_is_free then total_points else total_points - v_point_cost end
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- Set captain atomically (clear old + set new)
create or replace function rpc_set_captain(
  p_user_id uuid,
  p_squad_player_id integer
)
returns void as $$
begin
  -- Verify caller matches the claimed user
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Clear existing captain for this user
  update squad_players set is_captain = false
  where user_id = p_user_id and is_captain = true;

  -- Set new captain, clear vice-captain if same player
  update squad_players set is_captain = true, is_vice_captain = false
  where id = p_squad_player_id and user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- Set vice-captain atomically (clear old + set new)
create or replace function rpc_set_vice_captain(
  p_user_id uuid,
  p_squad_player_id integer
)
returns void as $$
begin
  -- Verify caller matches the claimed user
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Clear existing vice-captain for this user
  update squad_players set is_vice_captain = false
  where user_id = p_user_id and is_vice_captain = true;

  -- Set new vice-captain, clear captain if same player
  update squad_players set is_vice_captain = true, is_captain = false
  where id = p_squad_player_id and user_id = p_user_id;
end;
$$ language plpgsql security definer;
