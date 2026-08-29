import { describe, expect, it } from "vitest";

describe("public BeepAI plan catalog", () => {
  it("reads active subscription plans through RLS", async () => {
    const url = "https://bioqlzpqxfsyrbtssglj.supabase.co";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb3FsenBxeGZzeXJidHNzZ2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NzAxOTcsImV4cCI6MjEwMzQ0NjE5N30.g7iUMgzwQkmaYaPuB_Adad6RntiifG8Owysz2iZ92WM";
    const response = await fetch(`${url}/rest/v1/beepai_subscription_plans?select=id,name,monthly_price_rwf&is_active=eq.true&order=sort_order`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    expect(response.status).toBe(200);
    const rows = await response.json() as Array<{ id: string }>;
    expect(rows.length).toBeGreaterThan(0);
  });
});
