"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";
import { z } from "zod";
import { getServerActionAppUrl } from "@/lib/app-url";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { createSupabaseServerClient } from "@/server/supabase/server";

const resetPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide.")
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

type AuthPath = "/connexion" | "/inscription" | "/mot-de-passe-oublie";

function redirectWithError(path: AuthPath, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}` as Route);
}

function getSignInErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("email not confirmed")) {
    return "Ton email n'est pas encore confirmé. Ouvre l'email envoyé par Supabase/NurseAI et clique sur le lien de confirmation.";
  }

  if (lowerMessage.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect. Vérifie aussi que tu as bien confirmé ton email.";
  }

  return message;
}

export async function signInAction(formData: FormData) {
  const payload = signInSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password")
  });

  if (!payload.success) {
    redirectWithError("/connexion", payload.error.issues[0]?.message ?? "Connexion impossible.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(payload.data);

  if (error) {
    redirectWithError("/connexion", getSignInErrorMessage(error.message));
  }

  redirect("/activation");
}

export async function signUpAction(formData: FormData) {
  const payload = signUpSchema.safeParse({
    firstName: getString(formData, "firstName"),
    lastName: getString(formData, "lastName"),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    studyYear: getString(formData, "studyYear")
  });

  if (!payload.success) {
    redirectWithError("/inscription", payload.error.issues[0]?.message ?? "Inscription impossible.");
  }

  const supabase = await createSupabaseServerClient();
  const appUrl = await getServerActionAppUrl();
  const { error } = await supabase.auth.signUp({
    email: payload.data.email,
    password: payload.data.password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        first_name: payload.data.firstName,
        last_name: payload.data.lastName,
        study_year: payload.data.studyYear
      }
    }
  });

  if (error) {
    redirectWithError("/inscription", error.message);
  }

  redirect(
    "/connexion?message=Compte créé. Vérifie tes emails si Supabase demande une confirmation." as Route
  );
}

export async function resetPasswordAction(formData: FormData) {
  const payload = resetPasswordSchema.safeParse({
    email: getString(formData, "email")
  });

  if (!payload.success) {
    redirectWithError("/mot-de-passe-oublie", payload.error.issues[0]?.message ?? "Email invalide.");
  }

  const supabase = await createSupabaseServerClient();
  const appUrl = await getServerActionAppUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(payload.data.email, {
    redirectTo: `${appUrl}/auth/callback`
  });

  if (error) {
    redirectWithError("/mot-de-passe-oublie", error.message);
  }

  redirect("/mot-de-passe-oublie?message=Email envoyé si le compte existe." as Route);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
