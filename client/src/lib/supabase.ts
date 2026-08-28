import { createClient } from "@supabase/supabase-js";

export type Plan = {
  id: string;
  name: string;
  monthly_price_rwf: number;
  summary: string;
  features: string[];
  accent: string;
};

export type SiteContent = {
  slug: string;
  title: string;
  body: string;
  category: string;
};

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "https://bioqlzpqxfsyrbtssglj.supabase.co";
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb3FsenBxeGZzeXJidHNzZ2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NzAxOTcsImV4cCI6MjEwMzQ0NjE5N30.g7iUMgzwQkmaYaPuB_Adad6RntiifG8Owysz2iZ92WM";
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const fallbackPlans: Plan[] = [
  { id: "free", name: "Free", monthly_price_rwf: 0, summary: "A private start for simple tasks.", features: ["1 basic automation", "Up to 30 runs / month", "Offline execution", "Community support"], accent: "#16A34A" },
  { id: "personal", name: "Personal", monthly_price_rwf: 2000, summary: "More automations for individual work.", features: ["Up to 5 automations", "Up to 500 runs / month", "Scheduled automations", "Email notifications"], accent: "#2563EB" },
  { id: "professional", name: "Professional", monthly_price_rwf: 10000, summary: "Built for productive professional teams.", features: ["Up to 20 automations", "Unlimited runs", "Email, WhatsApp, notifications", "Priority support"], accent: "#7C3AED" },
  { id: "business", name: "Business", monthly_price_rwf: 25000, summary: "Scale automation across your business.", features: ["Unlimited automations", "Multi-user workspace", "API access", "Usage analytics"], accent: "#EA580C" },
];

export async function loadPlans() {
  if (!supabase) return { plans: fallbackPlans, live: false };
  const { data, error } = await supabase.from("beepai_subscription_plans").select("id,name,monthly_price_rwf,summary,features,accent").eq("is_active", true).order("sort_order");
  if (error || !data?.length) return { plans: fallbackPlans, live: false };
  return { plans: data as Plan[], live: true };
}

export async function loadPublicContent() {
  if (!supabase) return { content: [] as SiteContent[], live: false };
  const { data, error } = await supabase.from("beepai_site_content").select("slug,title,body,category").eq("is_active", true).order("sort_order");
  if (error || !data) return { content: [] as SiteContent[], live: false };
  return { content: data as SiteContent[], live: true };
}
