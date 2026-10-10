alter table public.words
  add column if not exists example_th text,
  add column if not exists example_en text,
  add column if not exists difficulty text not null default 'beginner';
