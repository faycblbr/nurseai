export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          cohort: string | null;
          ifsi: string | null;
          study_year: "1" | "2" | "3" | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          cohort?: string | null;
          ifsi?: string | null;
          study_year?: "1" | "2" | "3" | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]> & {
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          user_id: string;
          dark_mode: boolean;
          email_notifications: boolean;
          push_notifications: boolean;
          privacy: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          dark_mode?: boolean;
          email_notifications?: boolean;
          push_notifications?: boolean;
          privacy?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]> & {
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          billing_provider?: "stripe" | "apple" | "google" | "manual";
          apple_original_transaction_id?: string | null;
          apple_product_id?: string | null;
          apple_environment?: string | null;
          apple_signed_transaction_info?: string | null;
          entitlement_updated_at?: string | null;
          status: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
          current_period_end: string | null;
          ai_monthly_quota: number;
          ai_monthly_usage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          billing_provider?: "stripe" | "apple" | "google" | "manual";
          apple_original_transaction_id?: string | null;
          apple_product_id?: string | null;
          apple_environment?: string | null;
          apple_signed_transaction_info?: string | null;
          entitlement_updated_at?: string | null;
          status?: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
          current_period_end?: string | null;
          ai_monthly_quota?: number;
          ai_monthly_usage?: number;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]> & {
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          channel: "in_app" | "email" | "push";
          title: string;
          body: string;
          read_at: string | null;
          scheduled_for: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel?: "in_app" | "email" | "push";
          title: string;
          body: string;
          read_at?: string | null;
          scheduled_for?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      care_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          patient_context: string;
          content_markdown: string | null;
          status: "draft" | "generated" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          patient_context: string;
          content_markdown?: string | null;
          status?: "draft" | "generated" | "archived";
        };
        Update: Partial<Database["public"]["Tables"]["care_plans"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
