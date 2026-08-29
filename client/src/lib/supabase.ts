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

export async function getAdminSession() {
  if (!supabase) return { session: null, error: new Error("Supabase is not configured") };
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

export function subscribeToAuth(onSession: (session: NonNullable<Awaited<ReturnType<typeof getAdminSession>>["session"]> | null) => void) {
  if (!supabase) return { unsubscribe: () => undefined };
  const { data } = supabase.auth.onAuthStateChange((_event, session) => onSession(session));
  return { unsubscribe: () => data.subscription.unsubscribe() };
}

export async function signInAdmin(email: string, password: string) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signOutAdmin() {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  return supabase.auth.signOut();
}

export type AdminRequest = {
  id: string;
  description: string;
  involved_tools: string[];
  frequency: string;
  status: string;
  created_at: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
};

export type AdminAutomation = {
  id: string;
  name: string;
  status: string;
  schedule: string;
  created_at: string;
  request_id: string | null;
  redemption_code: string | null;
};

export type AdminRun = {
  id: string;
  status: string;
  duration_ms: number | null;
  created_at: string;
};

export type AdminSnapshot = {
  plans: Plan[];
  content: SiteContent[];
  requests: AdminRequest[];
  automations: AdminAutomation[];
  runs: AdminRun[];
  live: boolean;
  warnings: string[];
};

async function safeTable<T>(table: string, columns: string, query: (builder: any) => any): Promise<{ data: T[]; warning?: string }> {
  if (!supabase) return { data: [], warning: `${table} is unavailable because Supabase is not configured.` };
  try {
    const response = await query(supabase.from(table).select(columns));
    if (response.error) return { data: [], warning: `${table}: ${response.error.message}` };
    return { data: (response.data ?? []) as T[] };
  } catch (error) {
    return { data: [], warning: `${table}: ${error instanceof Error ? error.message : "Request failed"}` };
  }
}

export async function loadAdminSnapshot(): Promise<AdminSnapshot> {
  const [plans, content, requests, automations, runs] = await Promise.all([
    safeTable<Plan>("beepai_subscription_plans", "id,name,monthly_price_rwf,summary,features,accent", (q) => q.eq("is_active", true).order("sort_order").limit(20)),
    safeTable<SiteContent>("beepai_site_content", "slug,title,body,category", (q) => q.eq("is_active", true).order("sort_order").limit(50)),
    safeTable<AdminRequest>("beepai_automation_requests", "id,description,involved_tools,frequency,status,created_at,contact_name,contact_phone,contact_email", (q) => q.order("created_at", { ascending: false }).limit(25)),
    safeTable<AdminAutomation>("beepai_user_automations", "id,name,status,schedule,created_at,request_id,redemption_code", (q) => q.order("created_at", { ascending: false }).limit(25)),
    safeTable<AdminRun>("beepai_automation_runs", "id,status,duration_ms,created_at", (q) => q.order("created_at", { ascending: false }).limit(50)),
  ]);
  const warnings = [plans.warning, content.warning, requests.warning, automations.warning, runs.warning].filter(Boolean) as string[];
  return { plans: plans.data.length ? plans.data : fallbackPlans, content: content.data, requests: requests.data, automations: automations.data, runs: runs.data, live: warnings.length === 0, warnings };
}

export async function updateAdminPlan(plan: Pick<Plan, "id" | "name" | "monthly_price_rwf" | "summary" | "features" | "accent">) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  const { error } = await supabase.from("beepai_subscription_plans").update({ name: plan.name, monthly_price_rwf: plan.monthly_price_rwf, summary: plan.summary, features: plan.features, accent: plan.accent, updated_at: new Date().toISOString() }).eq("id", plan.id);
  return { error };
}

export async function updateAdminContent(content: Pick<SiteContent, "slug" | "title" | "body">) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  const { error } = await supabase.from("beepai_site_content").update({ title: content.title, body: content.body, updated_at: new Date().toISOString() }).eq("slug", content.slug);
  return { error };
}

export async function updateAdminRequestStatus(id: string, status: string) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  const { error } = await supabase.from("beepai_automation_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  return { error };
}

export type DeliverResult = { automationId: string; redemptionCode: string } | null;

/**
 * Builds the customer's package: creates the delivered automation record,
 * generates its redemption code, and marks the request as delivered — all
 * in one atomic call to a security-definer RPC that checks admin membership.
 */
export async function deliverAutomationRequest(requestId: string, name: string, description: string, schedule: string): Promise<{ result: DeliverResult; error: Error | null }> {
  if (!supabase) return { result: null, error: new Error("Supabase is not configured") };
  const { data, error } = await supabase.rpc("admin_deliver_automation_request", {
    p_request_id: requestId,
    p_name: name,
    p_description: description,
    p_schedule: schedule,
  });
  if (error) return { result: null, error: new Error(error.message) };
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { result: null, error: new Error("No package was returned.") };
  return { result: { automationId: row.automation_id as string, redemptionCode: row.redemption_code as string }, error: null };
}
