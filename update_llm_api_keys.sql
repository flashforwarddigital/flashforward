alter table llm_api_keys add column if not exists is_active boolean default true;
create policy if not exists "Allow select on active keys" on llm_api_keys for select using (is_active = true);
