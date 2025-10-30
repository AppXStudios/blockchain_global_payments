-- Location: supabase/migrations/20241229165400_bgp_payments_system.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete BGP Payment System with Authentication
-- Dependencies: New complete schema creation

-- 1. TYPES AND ENUMS
CREATE TYPE public.user_role AS ENUM ('admin', 'merchant', 'operator');
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE public.transaction_type AS ENUM ('payment', 'refund', 'withdrawal', 'fee');
CREATE TYPE public.currency_type AS ENUM ('fiat', 'crypto');
CREATE TYPE public.api_key_status AS ENUM ('active', 'inactive', 'revoked');
CREATE TYPE public.webhook_status AS ENUM ('active', 'inactive', 'failed');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- 2. CORE TABLES

-- User profiles (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    company_name TEXT,
    role public.user_role DEFAULT 'merchant'::public.user_role,
    avatar_url TEXT,
    phone TEXT,
    country TEXT,
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Merchant settings and configurations
CREATE TABLE public.merchant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT,
    website_url TEXT,
    business_address JSONB,
    tax_id TEXT,
    webhook_url TEXT,
    webhook_secret TEXT,
    callback_url TEXT,
    notification_email TEXT,
    settlement_currency TEXT DEFAULT 'USD',
    auto_settlement BOOLEAN DEFAULT true,
    settlement_threshold DECIMAL(15,2) DEFAULT 100.00,
    fee_percentage DECIMAL(5,4) DEFAULT 2.5000,
    daily_limit DECIMAL(15,2) DEFAULT 10000.00,
    monthly_limit DECIMAL(15,2) DEFAULT 100000.00,
    logo_url TEXT,
    brand_colors JSONB,
    terms_url TEXT,
    privacy_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- API Keys management
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    permissions JSONB DEFAULT '["read", "write"]'::jsonb,
    ip_whitelist TEXT[],
    status public.api_key_status DEFAULT 'active'::public.api_key_status,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    payment_id TEXT NOT NULL UNIQUE,
    external_id TEXT,
    order_id TEXT,
    amount_fiat DECIMAL(15,2) NOT NULL,
    currency_fiat TEXT NOT NULL,
    amount_crypto DECIMAL(20,8),
    currency_crypto TEXT,
    exchange_rate DECIMAL(20,8),
    pay_address TEXT,
    amount_received DECIMAL(20,8) DEFAULT 0,
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 1,
    status public.payment_status DEFAULT 'pending'::public.payment_status,
    payment_method TEXT,
    network TEXT,
    tx_hash TEXT,
    block_number BIGINT,
    fee_amount DECIMAL(20,8) DEFAULT 0,
    fee_currency TEXT,
    callback_url TEXT,
    success_url TEXT,
    cancel_url TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Payment history and status updates
CREATE TABLE public.payment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    status public.payment_status NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Webhook configurations
CREATE TABLE public.webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    secret TEXT,
    events TEXT[] DEFAULT ARRAY['payment.completed', 'payment.failed'],
    status public.webhook_status DEFAULT 'active'::public.webhook_status,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    last_triggered_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Webhook delivery logs
CREATE TABLE public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID REFERENCES public.webhooks(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    attempt_number INTEGER DEFAULT 1,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Payout management
CREATE TABLE public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    payout_id TEXT NOT NULL UNIQUE,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    destination_tag TEXT,
    network TEXT,
    fee_amount DECIMAL(15,2) DEFAULT 0,
    status public.payout_status DEFAULT 'pending'::public.payout_status,
    tx_hash TEXT,
    confirmation_code TEXT,
    requires_confirmation BOOLEAN DEFAULT true,
    confirmed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    confirmed_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    priority INTEGER DEFAULT 1,
    action_url TEXT,
    action_label TEXT,
    is_read BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs for security tracking
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_merchant_settings_user_id ON public.merchant_settings(user_id);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_status ON public.api_keys(status);
CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX idx_payments_merchant_id ON public.payments(merchant_id);
CREATE INDEX idx_payments_payment_id ON public.payments(payment_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);
CREATE INDEX idx_payment_logs_payment_id ON public.payment_logs(payment_id);
CREATE INDEX idx_webhooks_user_id ON public.webhooks(user_id);
CREATE INDEX idx_webhook_logs_webhook_id ON public.webhook_logs(webhook_id);
CREATE INDEX idx_payouts_merchant_id ON public.payouts(merchant_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- 4. FUNCTIONS (MUST BE BEFORE RLS POLICIES)

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name, 
    role
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'merchant')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Function to generate payment ID
CREATE OR REPLACE FUNCTION public.generate_payment_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
SELECT 'bgp_' || lower(encode(gen_random_bytes(12), 'hex'));
$$;

-- Function to generate API key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
SELECT 'bgp_' || encode(gen_random_bytes(32), 'base64');
$$;

-- 5. ENABLE RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for other tables
CREATE POLICY "users_manage_own_merchant_settings"
ON public.merchant_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_api_keys"
ON public.api_keys
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_payments"
ON public.payments
FOR ALL
TO authenticated
USING (merchant_id = auth.uid())
WITH CHECK (merchant_id = auth.uid());

CREATE POLICY "users_view_own_payment_logs"
ON public.payment_logs
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.payments p 
  WHERE p.id = payment_logs.payment_id 
  AND p.merchant_id = auth.uid()
));

CREATE POLICY "users_manage_own_webhooks"
ON public.webhooks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_own_webhook_logs"
ON public.webhook_logs
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.webhooks w 
  WHERE w.id = webhook_logs.webhook_id 
  AND w.user_id = auth.uid()
));

CREATE POLICY "users_manage_own_payouts"
ON public.payouts
FOR ALL
TO authenticated
USING (merchant_id = auth.uid())
WITH CHECK (merchant_id = auth.uid());

CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin access for audit logs
CREATE POLICY "admin_view_audit_logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_profiles up 
  WHERE up.id = auth.uid() 
  AND up.role = 'admin'
));

CREATE POLICY "users_view_own_audit_logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 7. TRIGGERS
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_merchant_settings_updated_at
  BEFORE UPDATE ON public.merchant_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 8. MOCK DATA FOR TESTING
DO $$
DECLARE
    admin_user_id UUID := gen_random_uuid();
    merchant_user_id UUID := gen_random_uuid();
    test_payment_id UUID := gen_random_uuid();
    test_webhook_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@bgp.com', crypt('AdminPass123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "BGP Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (merchant_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'merchant@bgp.com', crypt('MerchantPass123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Test Merchant", "role": "merchant"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert merchant settings
    INSERT INTO public.merchant_settings (
        user_id, business_name, business_type, website_url, 
        settlement_currency, fee_percentage, daily_limit
    ) VALUES
        (merchant_user_id, 'Test Crypto Store', 'E-commerce', 'https://teststore.com',
         'USD', 2.5000, 5000.00);

    -- Insert test API key
    INSERT INTO public.api_keys (
        user_id, key_name, key_hash, key_prefix, permissions
    ) VALUES
        (merchant_user_id, 'Main API Key', 
         encode(digest('bgp_test_key_' || merchant_user_id::text, 'sha256'), 'hex'),
         'bgp_live_', '["read", "write", "payments"]'::jsonb);

    -- Insert test payments
    INSERT INTO public.payments (
        id, merchant_id, payment_id, amount_fiat, currency_fiat, 
        amount_crypto, currency_crypto, status, description
    ) VALUES
        (test_payment_id, merchant_user_id, 'bgp_' || encode(gen_random_bytes(12), 'hex'),
         99.99, 'USD', 0.0025, 'BTC', 'completed', 'Test payment for product purchase'),
        (gen_random_uuid(), merchant_user_id, 'bgp_' || encode(gen_random_bytes(12), 'hex'),
         249.50, 'USD', 0.15, 'ETH', 'pending', 'Premium service subscription');

    -- Insert webhook configuration
    INSERT INTO public.webhooks (
        id, user_id, url, events, status
    ) VALUES
        (test_webhook_id, merchant_user_id, 'https://teststore.com/webhook',
         ARRAY['payment.completed', 'payment.failed'], 'active');

    -- Insert test notifications
    INSERT INTO public.notifications (
        user_id, title, message, type, priority
    ) VALUES
        (merchant_user_id, 'Payment Received', 'New payment of $99.99 received successfully', 'success', 2),
        (merchant_user_id, 'API Key Created', 'New API key has been generated for your account', 'info', 1),
        (admin_user_id, 'System Update', 'BGP system maintenance scheduled for tonight', 'warning', 3);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 9. CLEANUP FUNCTION
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email IN ('admin@bgp.com', 'merchant@bgp.com');

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.webhook_logs WHERE webhook_id IN (
        SELECT id FROM public.webhooks WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.payment_logs WHERE payment_id IN (
        SELECT id FROM public.payments WHERE merchant_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.notifications WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.audit_logs WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.payouts WHERE merchant_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.webhooks WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.payments WHERE merchant_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.api_keys WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.merchant_settings WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;