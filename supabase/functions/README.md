# Supabase Edge Functions

## Pilot request email notification

The website saves pilot requests into `public.pilot_requests`.
After a successful insert, the frontend invokes the `pilot-request-notify` Edge Function.
The function sends a lead notification email through Resend.

Set secrets in Supabase:

```powershell
supabase secrets set RESEND_API_KEY="re_your_key_here"
supabase secrets set PILOT_NOTIFY_TO="you@company.com"
supabase secrets set RESEND_FROM="Elevated AI <hello@elevatedai.com>"
```

Deploy:

```powershell
supabase functions deploy pilot-request-notify
```

Notes:

- Do not put `RESEND_API_KEY` in `.env.local` or any Vite `VITE_*` variable.
- `RESEND_FROM` should use a verified Resend domain. Until `elevatedai.com` is verified, use a sender allowed by your Resend account.
- The frontend treats email notification as best-effort. A pilot request can still save even if the notification function is not deployed yet.
- Current production notification setup uses `PILOT_NOTIFY_TO=hello@elevatedai.com` and `RESEND_FROM=Elevated AI <hello@elevatedai.com>`.
