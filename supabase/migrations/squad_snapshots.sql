-- Squad Snapshots: saves a copy of each user's squad when a matchday goes live
-- Run this in the Supabase SQL Editor

create table squad_snapshots (
  id serial primary key,
  matchday_id integer references matchdays(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  player_id integer references players(id),
  is_starter boolean default false,
  is_captain boolean default false,
  is_vice_captain boolean default false,
  snapped_at timestamptz default now(),
  unique(matchday_id, user_id, player_id)
);

alter table squad_snapshots enable row level security;
create policy "Anyone can read snapshots" on squad_snapshots for select using (true);
create policy "Admins can manage snapshots" on squad_snapshots for all using (is_admin());

-- Matchday Chat Messages
create table matchday_messages (
  id serial primary key,
  matchday_id integer references matchdays(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  message text not null check (char_length(message) <= 500),
  created_at timestamptz default now()
);

alter table matchday_messages enable row level security;
create policy "Anyone can read messages" on matchday_messages for select using (true);
create policy "Users can insert own messages" on matchday_messages for insert
  with check (auth.uid() = user_id);
