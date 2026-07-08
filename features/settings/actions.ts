"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/server/supabase/server";

type MutationResult = Promise<{ error: { message: string } | null }>;

type MutationBuilder = {
  insert: (payload: Record<string, unknown>) => MutationResult;
  upsert: (payload: Record<string, unknown>) => MutationResult;
};

type GenericMutationClient = {
  from: (table: string) => MutationBuilder;
};

const profileSchema = z.object({
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  ifsi: z.string().trim().max(120).optional(),
  cohort: z.string().trim().max(80).optional(),
  studyYear: z.enum(["", "1", "2", "3"])
});

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw : "";
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function redirectSettings(message: string, isError = false): never {
  const key = isError ? "error" : "message";
  redirect(`/parametres?${key}=${encodeURIComponent(message)}` as Route);
}

async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion" as Route);
  }

  return { supabase, user };
}

export async function updateProfileAction(formData: FormData) {
  const payload = profileSchema.safeParse({
    firstName: value(formData, "firstName"),
    lastName: value(formData, "lastName"),
    ifsi: value(formData, "ifsi"),
    cohort: value(formData, "cohort"),
    studyYear: value(formData, "studyYear")
  });

  if (!payload.success) {
    redirectSettings("Impossible d'enregistrer le profil. Vérifie les champs.", true);
  }

  const { supabase, user } = await getCurrentUser();
  const db = supabase as unknown as GenericMutationClient;
  const { error } = await db.from("profiles").upsert({
    id: user.id,
    first_name: payload.data.firstName || null,
    last_name: payload.data.lastName || null,
    ifsi: payload.data.ifsi || null,
    cohort: payload.data.cohort || null,
    study_year: payload.data.studyYear || null,
    updated_at: new Date().toISOString()
  });

  if (error) {
    redirectSettings(error.message, true);
  }

  revalidatePath("/parametres");
  revalidatePath("/dashboard");
  redirectSettings("Profil enregistré.");
}

export async function updatePreferencesAction(formData: FormData) {
  const { supabase, user } = await getCurrentUser();
  const db = supabase as unknown as GenericMutationClient;
  const privacy = {
    analytics_consent: checked(formData, "analyticsConsent"),
    ai_training_opt_in: checked(formData, "aiTrainingOptIn"),
    anonymization_reminder: checked(formData, "anonymizationReminder"),
    guided_learning: checked(formData, "guidedLearning"),
    strict_correction_mode: checked(formData, "strictCorrectionMode")
  };

  const { error } = await db.from("settings").upsert({
    user_id: user.id,
    dark_mode: checked(formData, "darkMode"),
    email_notifications: checked(formData, "emailNotifications"),
    push_notifications: checked(formData, "pushNotifications"),
    privacy,
    updated_at: new Date().toISOString()
  });

  if (error) {
    redirectSettings(error.message, true);
  }

  revalidatePath("/parametres");
  redirectSettings("Préférences enregistrées.");
}

export async function requestAccountDeletionAction() {
  const { supabase, user } = await getCurrentUser();
  const db = supabase as unknown as GenericMutationClient;
  const { error } = await db.from("notifications").insert({
    user_id: user.id,
    channel: "in_app",
    title: "Demande de suppression du compte",
    body: "Demande enregistrée. En production, cette action déclenchera le workflow RGPD avec confirmation email et délai légal."
  });

  if (error) {
    redirectSettings(error.message, true);
  }

  revalidatePath("/parametres");
  redirectSettings("Demande de suppression enregistrée. Aucune donnée n'a été supprimée automatiquement.");
}
