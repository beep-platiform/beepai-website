create table if not exists public.beepai_site_content (
  slug text primary key,
  title text not null,
  body text not null,
  category text not null,
  sort_order smallint not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.beepai_site_content enable row level security;
drop policy if exists "Public can view active BeepAI site content" on public.beepai_site_content;
create policy "Public can view active BeepAI site content" on public.beepai_site_content for select using (is_active = true);
grant select on public.beepai_site_content to anon, authenticated;

insert into public.beepai_site_content (slug, title, body, category, sort_order)
values
  ('hero', 'Make busywork disappear.', 'BeepAI turns repetitive work into simple, powerful automations that run where your data already lives — on your device.', 'hero', 1),
  ('platform', 'Less busywork. More momentum.', 'A simpler way to automate the work between the work — without giving up control of your data.', 'platform', 2),
  ('help', 'Have a workflow in mind?', 'Tell us what is slowing your team down. We’ll help you find the clearest way forward.', 'help', 3)
on conflict (slug) do update set title = excluded.title, body = excluded.body, category = excluded.category, sort_order = excluded.sort_order, updated_at = now();
