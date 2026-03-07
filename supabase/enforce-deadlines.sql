-- ============================================================
-- Enforce matchday deadlines in RPC functions
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Helper: get the next upcoming matchday's deadlines
create or replace function get_next_deadline()
returns record as $$
declare
  v_md record;
begin
  select * into v_md from matchdays
  where first_kickoff > now() - interval '6 hours'
  order by first_kickoff asc
  limit 1;
  return v_md;
end;
$$ language plpgsql security definer stable set search_path = public;

-- Updated: Accept trade with deadline check
create or replace function rpc_accept_trade(
  p_trade_id integer,
  p_user_id uuid
)
returns void as $$
declare
  v_trade record;
  v_tp record;
  v_md record;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Check trade deadline
  select * into v_md from matchdays
  where first_kickoff > now() - interval '6 hours'
  order by first_kickoff asc limit 1;

  if v_md.trade_deadline_at is not null and now() > v_md.trade_deadline_at then
    raise exception 'Trade window is closed (deadline was %)', v_md.trade_deadline_at;
  end if;

  select * into v_trade from trades
  where id = p_trade_id and status = 'pending' and receiver_id = p_user_id;
  if not found then
    raise exception 'Trade not found or not pending';
  end if;

  for v_tp in select * from trade_players where trade_id = p_trade_id loop
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

  update trades set status = 'accepted', resolved_at = now()
  where id = p_trade_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Updated: Make transfer with deadline check
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
  v_md record;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Check trade deadline (transfers also blocked)
  select * into v_md from matchdays
  where first_kickoff > now() - interval '6 hours'
  order by first_kickoff asc limit 1;

  if v_md.trade_deadline_at is not null and now() > v_md.trade_deadline_at then
    raise exception 'Transfer window is closed (deadline was %)', v_md.trade_deadline_at;
  end if;

  select * into v_profile from profiles where id = p_user_id;
  if not found then
    raise exception 'Profile not found';
  end if;

  v_is_free := v_profile.free_transfers > 0;
  v_point_cost := case when v_is_free then 0 else 3 end;

  delete from squad_players
  where user_id = p_user_id and player_id = p_player_out_id;
  if not found then
    raise exception 'Player not in your squad';
  end if;

  insert into squad_players (user_id, player_id, is_starter)
  values (p_user_id, p_player_in_id, false);

  insert into transfers (user_id, player_in_id, player_out_id, is_free, point_cost)
  values (p_user_id, p_player_in_id, p_player_out_id, v_is_free, v_point_cost);

  update profiles set
    free_transfers = case when v_is_free then free_transfers - 1 else free_transfers end,
    total_points = case when v_is_free then total_points else total_points - v_point_cost end
  where id = p_user_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Updated: Set captain with lineup lock check
create or replace function rpc_set_captain(
  p_user_id uuid,
  p_squad_player_id integer
)
returns void as $$
declare
  v_md record;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Check lineup lock
  select * into v_md from matchdays
  where first_kickoff > now() - interval '6 hours'
  order by first_kickoff asc limit 1;

  if v_md.lineup_lock_at is not null and now() > v_md.lineup_lock_at then
    raise exception 'Lineup is locked (locked at %)', v_md.lineup_lock_at;
  end if;

  update squad_players set is_captain = false
  where user_id = p_user_id and is_captain = true;

  update squad_players set is_captain = true, is_vice_captain = false
  where id = p_squad_player_id and user_id = p_user_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Updated: Set vice-captain with lineup lock check
create or replace function rpc_set_vice_captain(
  p_user_id uuid,
  p_squad_player_id integer
)
returns void as $$
declare
  v_md record;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user mismatch';
  end if;

  -- Check lineup lock
  select * into v_md from matchdays
  where first_kickoff > now() - interval '6 hours'
  order by first_kickoff asc limit 1;

  if v_md.lineup_lock_at is not null and now() > v_md.lineup_lock_at then
    raise exception 'Lineup is locked (locked at %)', v_md.lineup_lock_at;
  end if;

  update squad_players set is_vice_captain = false
  where user_id = p_user_id and is_vice_captain = true;

  update squad_players set is_vice_captain = true, is_captain = false
  where id = p_squad_player_id and user_id = p_user_id;
end;
$$ language plpgsql security definer set search_path = public;
