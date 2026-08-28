# BeepAI Public Website Design

## Direction

A conversion-focused, privacy-first automation landing page with a dark ink canvas, luminous violet gradients, restrained glass panels, and crisp editorial typography. The public experience should feel like a confident platform overview rather than a generic SaaS template: every section explains the benefit of keeping repetitive work local, private, and understandable.

## Public Information Architecture

The home route explains what BeepAI does, how the Beep platform works, use cases, plan comparison, help pathways, and a clear request-demo / get-started CTA. Public plan cards and public feature copy are loaded from Supabase so content owners can update the marketing story without changing the frontend bundle.

## Admin Information Architecture

The unlisted `/control-room` route uses a persistent sidebar and operational dashboard for reviewing active plans, automation templates, public feature content, and incoming help requests. It is not linked from the public site. It receives `noindex,nofollow,noarchive` metadata and is blocked by `robots.txt`; URL hiding is not a security boundary, so the portal should be protected by Supabase authentication before production use.

## Visual Tokens

| Token | Value | Use |
|---|---:|---|
| Ink | `#080A13` | Page canvas and hero backdrop. |
| Panel | `#11152A` | Elevated cards and admin surfaces. |
| Violet | `#8B5CF6` | Primary brand accent and calls to action. |
| Orchid | `#C084FC` | Gradient highlight and secondary emphasis. |
| Sky | `#38BDF8` | Integrations and explanatory accents. |
| Mint | `#34D399` | Privacy, success, and healthy status. |
| Cloud | `#F7F7FB` | Primary light text and public card interiors. |
| Slate | `#A8B0C7` | Supporting copy and metadata. |

## Key Interactions

Navigation anchors scroll to public sections. Plan cards show their Supabase-backed state and support a responsive comparison layout. Help CTAs open a lightweight contact panel or mail link. The admin route provides compact filters and save affordances; authentication and write operations should be added before using it with sensitive operational data.
