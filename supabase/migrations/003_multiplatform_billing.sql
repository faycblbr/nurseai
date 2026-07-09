alter table public.subscriptions
  add column if not exists billing_provider text not null default 'stripe',
  add column if not exists apple_original_transaction_id text unique,
  add column if not exists apple_product_id text,
  add column if not exists apple_environment text,
  add column if not exists apple_signed_transaction_info text,
  add column if not exists entitlement_updated_at timestamptz;

alter table public.subscriptions
  drop constraint if exists subscriptions_billing_provider_check,
  add constraint subscriptions_billing_provider_check
    check (billing_provider in ('stripe', 'apple', 'google', 'manual'));

create index if not exists subscriptions_apple_original_transaction_id_idx
  on public.subscriptions(apple_original_transaction_id)
  where apple_original_transaction_id is not null;
