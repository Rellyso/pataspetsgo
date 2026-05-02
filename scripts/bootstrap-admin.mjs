import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

function requireArg(index) {
  const value = process.argv[index];

  if (!value) {
    throw new Error(`Usage: pnpm admin:bootstrap <email> <password>`);
  }

  return value;
}

async function findUserByEmail(client, email) {
  let page = 1;

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const user = data.users.find((entry) => entry.email === email);
    if (user) {
      return user;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function main() {
  const email = requireArg(2);
  const password = requireArg(3);

  const client = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );

  let user = await findUserByEmail(client, email);

  if (!user) {
    const { data, error } = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      throw error;
    }

    user = data.user;
  }

  const { error: profileError } = await client.from("profiles").upsert({
    id: user.id,
    role: "admin",
  });

  if (profileError) {
    throw profileError;
  }

  console.log(`Admin ready: ${email} (${user.id})`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
