
Website validation: the public route renders the BeepAI hero, platform benefits, workflow explanation, Supabase-backed plan section, and help CTAs. The unlisted `/control-room` route renders the admin dashboard and explicitly states that Supabase Auth should be connected before sensitive write actions. The admin route is not linked in public navigation except the intentionally unlisted team-access link and is configured for noindex/nofollow/noarchive.

The current authenticated Supabase API Keys page is at `https://supabase.com/dashboard/project/bioqlzpqxfsyrbtssglj/settings/api-keys`. It shows the active publishable key and a separate tab labeled `Legacy anon, service_role API keys`; the anon key should be used for this public website with RLS.

The authenticated Supabase legacy API Keys page at `https://supabase.com/dashboard/project/bioqlzpqxfsyrbtssglj/settings/api-keys/legacy` shows an `anon public` key field for this project and separately labels `service_role` as secret. Only the anon public key is appropriate for the browser website; the service-role field was not revealed or used.
