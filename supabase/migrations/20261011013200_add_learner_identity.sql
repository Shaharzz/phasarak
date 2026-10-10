-- Allow both learners to use the same anonymous Supabase session.
-- Existing rows are assigned to Shahar so no current progress is lost.

alter table public.progress
  add column if not exists learner text not null default 'shahar';

alter table public.checkins
  add column if not exists learner text not null default 'shahar';

alter table public.progress
  drop constraint if exists progress_pkey;

alter table public.progress
  add constraint progress_pkey primary key (user_id, learner, word_id);

alter table public.checkins
  drop constraint if exists checkins_pkey;

alter table public.checkins
  add constraint checkins_pkey primary key (user_id, learner, day);

alter table public.progress
  drop constraint if exists progress_learner_check;

alter table public.progress
  add constraint progress_learner_check
  check (learner in ('shahar', 'athittaya'));

alter table public.checkins
  drop constraint if exists checkins_learner_check;

alter table public.checkins
  add constraint checkins_learner_check
  check (learner in ('shahar', 'athittaya'));

create index if not exists progress_user_learner_idx
  on public.progress (user_id, learner, learned_on desc);

create index if not exists checkins_user_learner_day_idx
  on public.checkins (user_id, learner, day desc);
