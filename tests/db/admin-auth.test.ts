import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createAnonClient, createServiceRoleClient } from "./supabase";

describe("admin auth foundation", () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const regularEmail = `operator-${suffix}@example.com`;
  const adminEmail = `admin-${suffix}@example.com`;
  const password = "secret123";

  const serviceClient = createServiceRoleClient();
  const regularClient = createAnonClient();
  const adminClient = createAnonClient();

  let regularUserId = "";
  let adminUserId = "";

  function requireUserId(userId: string, label: string) {
    if (!userId) {
      throw new Error(`Missing ${label} user id`);
    }

    return userId;
  }

  beforeAll(async () => {
    const [regularUserResult, adminUserResult] = await Promise.all([
      serviceClient.auth.admin.createUser({
        email: regularEmail,
        password,
        email_confirm: true,
      }),
      serviceClient.auth.admin.createUser({
        email: adminEmail,
        password,
        email_confirm: true,
      }),
    ]);

    expect(regularUserResult.error).toBeNull();
    expect(adminUserResult.error).toBeNull();

    if (!regularUserResult.data.user || !adminUserResult.data.user) {
      throw new Error("Expected admin.createUser() to return users");
    }

    regularUserId = regularUserResult.data.user.id;
    adminUserId = adminUserResult.data.user.id;

    const { error: promoteError } = await serviceClient
      .from("profiles")
      .update({
        role: "admin",
      })
      .eq("id", adminUserId);

    expect(promoteError).toBeNull();
  });

  afterAll(async () => {
    await regularClient.auth.signOut();
    await adminClient.auth.signOut();

    await Promise.all([
      serviceClient.auth.admin.deleteUser(requireUserId(regularUserId, "regular")),
      serviceClient.auth.admin.deleteUser(requireUserId(adminUserId, "admin")),
    ]);
  });

  it("creates a profile row for new auth users", async () => {
    const { data, error } = await serviceClient
      .from("profiles")
      .select("id, role")
      .in("id", [regularUserId, adminUserId])
      .order("id", { ascending: true });

    expect(error).toBeNull();
    expect(data).toHaveLength(2);
    expect(data?.find((profile) => profile.id === regularUserId)?.role).toBeNull();
    expect(data?.find((profile) => profile.id === adminUserId)?.role).toBe("admin");
  });

  it("allows a signed-in user to read only its own profile", async () => {
    const signInResult = await regularClient.auth.signInWithPassword({
      email: regularEmail,
      password,
    });

    expect(signInResult.error).toBeNull();

    const { data, error } = await regularClient.from("profiles").select("id, role");

    expect(error).toBeNull();
    expect(data).toEqual([{ id: regularUserId, role: null }]);
  });

  it("does not expose profiles to anonymous users", async () => {
    await regularClient.auth.signOut();

    const { data, error } = await regularClient.from("profiles").select("id, role");

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});
