import { describe, expect, it } from "vitest";

describe("public Supabase client", () => {
  it("authenticates the public anon key against project settings", async () => {
    const url = "https://bioqlzpqxfsyrbtssglj.supabase.co";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb3FsenBxeGZzeXJidHNzZ2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NzAxOTcsImV4cCI6MjEwMzQ0NjE5N30.g7iUMgzwQkmaYaPuB_Adad6RntiifG8Owysz2iZ92WM";
    const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    expect(response.status).toBe(200);
  });
});
