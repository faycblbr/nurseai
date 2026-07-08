create extension if not exists "pgcrypto";

create type study_year as enum ('1', '2', '3');
create type document_status as enum ('draft', 'generated', 'archived');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'unpaid');
create type notification_channel as enum ('in_app', 'email', 'push');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  cohort text,
  study_year study_year,
  ifsi text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  semester text not null,
  ue_code text not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  kind text not null,
  storage_path text,
  content_markdown text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  patient_context text not null,
  content_markdown text,
  status document_status not null default 'draft',
  ai_prompt_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transmissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  situation text not null,
  target text,
  data_markdown text,
  actions_markdown text,
  results_markdown text,
  status document_status not null default 'draft',
  ai_prompt_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.revision_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_document_id uuid references public.documents(id) on delete set null,
  title text not null,
  summary_markdown text,
  flashcards jsonb not null default '[]'::jsonb,
  quiz jsonb not null default '[]'::jsonb,
  mindmap jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  semester text not null,
  ue_code text not null,
  title text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quiz(id) on delete cascade,
  question_type text not null check (question_type in ('mcq', 'open')),
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer jsonb not null,
  explanation_markdown text,
  created_at timestamptz not null default now()
);

create table public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid references public.quiz(id) on delete set null,
  score numeric(5, 2) not null,
  answers jsonb not null default '{}'::jsonb,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create table public.dose_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  exercise_type text not null,
  statement text not null,
  expected_answer jsonb not null,
  explanation_markdown text not null,
  difficulty integer not null default 1 check (difficulty between 1 and 5),
  created_at timestamptz not null default now()
);

create table public.dose_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid references public.dose_exercises(id) on delete set null,
  mode text not null check (mode in ('training', 'exam')),
  answer jsonb not null,
  is_correct boolean not null,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create table public.stages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  service text,
  starts_on date,
  ends_on date,
  objectives jsonb not null default '[]'::jsonb,
  competencies jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stage_id uuid references public.stages(id) on delete cascade,
  title text not null,
  content_markdown text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status subscription_status not null default 'trialing',
  current_period_end timestamptz,
  ai_monthly_quota integer not null default 50,
  ai_monthly_usage integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  channel notification_channel not null default 'in_app',
  title text not null,
  body text not null,
  read_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz not null default now()
);

create table public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dark_mode boolean not null default false,
  email_notifications boolean not null default true,
  push_notifications boolean not null default false,
  privacy jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index courses_user_id_idx on public.courses(user_id);
create index documents_user_id_created_at_idx on public.documents(user_id, created_at desc);
create index care_plans_user_id_created_at_idx on public.care_plans(user_id, created_at desc);
create index transmissions_user_id_created_at_idx on public.transmissions(user_id, created_at desc);
create index results_user_id_created_at_idx on public.results(user_id, created_at desc);
create index notifications_user_id_read_at_idx on public.notifications(user_id, read_at);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.documents enable row level security;
alter table public.care_plans enable row level security;
alter table public.transmissions enable row level security;
alter table public.revision_cards enable row level security;
alter table public.quiz enable row level security;
alter table public.questions enable row level security;
alter table public.results enable row level security;
alter table public.dose_exercises enable row level security;
alter table public.dose_attempts enable row level security;
alter table public.stages enable row level security;
alter table public.notes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.notifications enable row level security;
alter table public.settings enable row level security;

create policy "Users manage their profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own courses" on public.courses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own documents" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own care plans" on public.care_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own transmissions" on public.transmissions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own revision cards" on public.revision_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read public or own quiz" on public.quiz
  for select using (is_public or auth.uid() = user_id);
create policy "Users manage own quiz" on public.quiz
  for insert with check (auth.uid() = user_id);
create policy "Users update own quiz" on public.quiz
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read questions from accessible quiz" on public.questions
  for select using (
    exists (
      select 1 from public.quiz
      where quiz.id = questions.quiz_id
      and (quiz.is_public or quiz.user_id = auth.uid())
    )
  );

create policy "Users manage own results" on public.results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read public or own dose exercises" on public.dose_exercises
  for select using (user_id is null or auth.uid() = user_id);
create policy "Users manage own dose attempts" on public.dose_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own stages" on public.stages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own notes" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users manage own notifications" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own settings" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
