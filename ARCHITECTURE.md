# The Blue Eagle - Architecture

## Overview
UCL Fantasy App built with React (Vite) + Supabase. Mobile-first design with Royal Blue (#0047AB) theme.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, Realtime)
- **Icons:** Lucide React
- **Routing:** React Router v7

## Project Structure
```
src/
  components/
    draft/
      DraftRoom.tsx      -- Main draft experience (status, pool, board)
      DraftBoard.tsx     -- Visual display of all picks by round
      PlayerPool.tsx     -- Searchable/filterable player list for picking
    layout/
      AppLayout.tsx      -- Main layout wrapper (header + content + bottom nav)
      BottomNav.tsx      -- Mobile bottom navigation bar
    squad/
      FormationView.tsx  -- Pitch-style formation display (GK/DEF/MID/FWD rows)
      PlayerCard.tsx     -- Single player display with captain/bench actions
      SquadManager.tsx   -- Full squad management (starters, bench, stats)
    trades/
      TradeCard.tsx      -- Single trade proposal display with accept/reject
      NewTradeForm.tsx   -- 3-step trade creation (opponent, your player, their player)
      TransferPanel.tsx  -- In-week free agent transfers with cost display
    live/
      LiveMatch.tsx      -- Match card with score, live indicator, kickoff time
      LiveScoreboard.tsx -- Squad live points breakdown (captain x2, VC takeover)
      HeadToHead.tsx     -- Side-by-side squad comparison with opponent
      MatchChat.tsx      -- Real-time matchday chat (Supabase realtime)
      ManualSubs.tsx     -- Tuesday->Wednesday player swap (max 2 per matchday)
      PredictedLineup.tsx-- 2-column predicted XI for upcoming matches
    player/
      PlayerStatsModal.tsx -- Match-by-match stats modal (tappable from anywhere)
      UserSquadModal.tsx   -- View any user's squad + player points
    admin/
      DraftManager.tsx   -- Create/start/pause/complete draft sessions
      MatchdayManager.tsx-- Create matchdays, add matches, set status, auto-timers
      ScoreManager.tsx   -- View/edit player scores, recalculate points
      PlayerManager.tsx  -- Add players/clubs, toggle availability
    ui/                  -- shadcn/ui components (button, card, badge, tabs, dialog)
  contexts/
    AuthContext.tsx       -- Supabase auth state management
  hooks/
    useDraft.ts          -- Draft session state, realtime subscription, pick logic
    useSquad.ts          -- Squad CRUD, formation validation, captain selection
    useTrades.ts         -- Trade CRUD, realtime, accept/reject with squad swap
    useTransfers.ts      -- Free agent transfers, free transfer budget tracking
    useLive.ts           -- Live matchday, matches, scores, manual subs (realtime)
    useDeadlines.ts      -- Matchday deadline state + 30s tick for countdown timer
    usePlayerPoints.ts   -- Aggregated season points per player
    useAdmin.ts          -- Admin check + CRUD hooks (draft, matchday, scores, players)
  lib/
    supabase.ts          -- Supabase client initialization
    scoring.ts           -- Point calculation engine + scoring table
    utils.ts             -- Tailwind merge utility (cn)
    constants.ts         -- Shared UI constants (posColors, posColorsWithBorder)
    footballData.ts      -- football-data.org API (fixture import, result sync, standings)
  pages/
    Login.tsx            -- Auth page (sign in / sign up)
    MyTeam.tsx           -- Squad view via SquadManager
    Draft.tsx            -- Draft room via DraftRoom
    Trades.tsx           -- Trade market (4 tabs: incoming/outgoing/new/transfers)
    Live.tsx             -- Live matchday (7 tabs: matches/points/h2h/chat/subs/lineups/rules)
    Leaderboard.tsx      -- League hub (4 tabs: standings/history/stats/activity)
    History.tsx           -- Completed matchday results + per-user scores (uses snapshots)
    Stats.tsx             -- Season stats (top players, scorers, assisters)
    Activity.tsx          -- Draft picks, trades, transfers timeline
    Admin.tsx            -- Admin panel (4 tabs: draft/matchdays/scores/players, admin-only)
  types/
    index.ts             -- All TypeScript interfaces matching DB schema
  App.tsx                -- Router configuration with protected routes
  main.tsx               -- Entry point
  index.css              -- Tailwind + shadcn theme (Royal Blue)
supabase/
  schema.sql             -- Full database schema with RLS policies + atomic RPC functions
```

## Database Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends auth.users), points, admin flag |
| `clubs` | UCL clubs with stage progression |
| `players` | All UCL players with position and club |
| `matchdays` | Matchday schedule with timer deadlines |
| `matches` | Individual matches within a matchday |
| `squad_players` | User's 21-player squad (starters, bench, captain) |
| `draft_sessions` | Snake draft configuration and state |
| `draft_picks` | Individual picks within a draft |
| `trades` | Player-for-player trade proposals |
| `trade_players` | Players involved in each trade |
| `player_scores` | Per-match scoring breakdown |
| `transfers` | In-week transfer log (3 free, -3pts extra) |
| `manual_subs` | Mid-matchday Tuesday-to-Wednesday substitutions |
| `squad_snapshots` | Frozen squad state per matchday (saved when matchday goes live) |
| `matchday_messages` | Real-time chat messages per matchday |

## Auth Flow
1. User visits app -> AuthContext checks Supabase session
2. No session -> redirect to /login
3. Login/signup -> Supabase auth -> trigger creates profile -> redirect to /
4. Session persists via Supabase cookie/localStorage

## Key Timers (Post-Matchday Cycle)
- **Waiver Draft:** Starts when matchday ends, lasts 48 hours
- **Lineup Window:** Opens 24h after matchday ends, closes 30min before next kickoff
- **Trade Deadline:** 12h before next matchday's first kickoff
- These are enforced by Supabase Edge Functions (to be built in Phase 5)

## Atomic Database Operations
Multi-step operations use PostgreSQL functions (`supabase.rpc()`) for transaction safety:
- `rpc_make_draft_pick` — Insert pick + add to squad + advance draft state atomically
- `rpc_accept_trade` — Verify ownership + swap players + mark accepted in one transaction
- `rpc_make_transfer` — Remove old player + add new + log + update profile atomically
- `rpc_set_captain` / `rpc_set_vice_captain` — Clear old + set new in one call

## Snake Draft Flow
1. Admin creates a `draft_session` with `pick_order` (array of user IDs) and sets status to `active`
2. `useDraft` hook subscribes to realtime changes on `draft_sessions` and `draft_picks`
3. Snake index calculation: odd rounds go forward (0,1,2...), even rounds reverse (...2,1,0)
4. When it's a user's turn, they see "It's Your Pick!" and can select from the player pool
5. On pick: inserts `draft_pick`, adds player to `squad_players`, advances `current_pick`/`current_round`
6. After 21 rounds (21-player squad), draft status becomes `completed`
7. Waiver drafts follow the same flow but with `type: 'waiver'` and only unowned players

## Squad Management Flow
1. `useSquad` hook fetches all `squad_players` with joined `player` and `club` data
2. Users toggle players between starters (11) and bench (10)
3. `validateFormation()` checks: 1 GK, 3-5 DEF, 3-5 MID, 1-3 FWD
4. Captain (x2 points) and Vice-Captain set via dedicated buttons on starter cards
5. `FormationView` renders a pitch-style layout grouped by position rows

## Trade Flow
1. Proposer selects opponent, picks their own player to give, and opponent's player to receive
2. `useTrades` inserts a `trades` row + two `trade_players` rows (one per direction)
3. Receiver sees trade in "Incoming" tab with Accept/Reject buttons
4. On accept: `squad_players` ownership is swapped for both players
5. Realtime subscription keeps both users' views in sync
6. Trade deadline (12h before matchday) enforced by Edge Functions

## Transfer Flow
1. User selects a player to drop from their squad
2. Browses free agents (searchable/filterable by position)
3. `useTransfers.makeTransfer()`: deletes old squad_player, inserts new, logs to `transfers`
4. If `free_transfers > 0`: free. Otherwise: deducts 3 points from `total_points`
5. `profiles.free_transfers` decremented on each transfer

## Live Scoring Flow
1. `useLive` loads current matchday (live > upcoming), matches, player_scores, user's squad, manual subs
2. Realtime subscriptions on `matches`, `player_scores`, `matchdays` tables
3. `LiveScoreboard` computes per-player points; captain gets x2, vice-captain takes over if captain DNP (0 min)
4. `ManualSubs` lets user swap up to 2 Tuesday starters with Wednesday bench players
5. `PredictedLineup` shows first 11 available players per club, sorted by position
6. `scoring.ts` contains the full point calculation engine (goals by position, assists, CS, cards, etc.)

## Admin Panel
- Protected by `useAdmin()` which checks `profiles.is_admin`
- **Draft Manager:** Create draft sessions with ordered pick list, start/pause/resume/complete
- **Matchday Manager:** Create matchdays (auto-computes lineup lock 30min before, trade deadline 12h before). Set status to live/completed (completed auto-sets 48h waiver + 24h lineup window). Expandable: add matches with home/away clubs, kickoff, Tue/Wed label, set match status.
- **Score Manager:** Filter by matchday, expand any player score to edit stats (goals, assists, minutes, cards, CS, MotM, penalties). "Recalculate Points" button runs `scoring.ts` engine.
- **Player Manager:** Add clubs (name + short code) and players (name, position, club). Toggle player availability. Search + filter by position.

## Game Rules Summary
- **Squad:** 21 players (11 starters + 10 bench)
- **Formation:** 1 GK, 3-5 DEF, 3-5 MID, 1-3 FWD
- **Bench:** 1 GK, 3 DEF, 3 MID, 3 FWD
- **Club limits:** Group=3, R16=4, QF=5, SF=6, Final=7
- **Captain:** x2 points; Vice takes over if Captain DNP
- **Manual subs:** Up to 2 Tuesday->Wednesday bench swaps
- **Transfers:** 3 free per week, -3 pts each additional
