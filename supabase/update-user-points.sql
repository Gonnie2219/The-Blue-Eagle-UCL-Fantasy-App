-- ============================================================
-- RPC to recalculate total points for all users
-- Call after scoring a matchday: SELECT update_all_user_points();
-- ============================================================
create or replace function update_all_user_points()
returns void as $$
begin
  update profiles p set total_points = coalesce((
    select sum(
      case when sp.is_captain then ps.total_points * 2
           else ps.total_points
      end
    )
    from squad_players sp
    join player_scores ps on ps.player_id = sp.player_id
    where sp.user_id = p.id
      and sp.is_starter = true
  ), 0);
end;
$$ language plpgsql security definer set search_path = public;
