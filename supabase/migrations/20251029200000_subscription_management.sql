-- Location: supabase/migrations/20251029200000_subscription_management.sql
-- Schema Analysis: Existing BGP payments system with payments, user_profiles, merchant_settings tables
-- Integration Type: Addition - adding subscription functionality to existing payment system  
-- Dependencies: user_profiles, payments tables

-- 1. Create subscription-related ENUM types
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'paused', 'expired');
CREATE TYPE public.billing_interval AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
CREATE TYPE public.plan_status AS ENUM ('active', 'inactive', 'archived');

-- 2. Create subscription plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    billing_interval public.billing_interval NOT NULL DEFAULT 'monthly',
    trial_days INTEGER DEFAULT 0,
    max_subscribers INTEGER,
    features JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    status public.plan_status DEFAULT 'active'::public.plan_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id TEXT NOT NULL UNIQUE,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
    subscriber_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.subscription_status DEFAULT 'active'::public.subscription_status,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    paused_at TIMESTAMPTZ,
    resumed_at TIMESTAMPTZ,
    subscriber_email TEXT NOT NULL,
    billing_amount NUMERIC NOT NULL,
    billing_currency TEXT NOT NULL DEFAULT 'USD',
    payment_method JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create subscription payments table (links to main payments table)
CREATE TABLE public.subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    billing_period_start TIMESTAMPTZ NOT NULL,
    billing_period_end TIMESTAMPTZ NOT NULL,
    amount_due NUMERIC NOT NULL,
    amount_paid NUMERIC DEFAULT 0,
    currency TEXT NOT NULL,
    payment_attempt INTEGER DEFAULT 1,
    payment_status TEXT DEFAULT 'pending',
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create subscription analytics table
CREATE TABLE public.subscription_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    new_subscriptions INTEGER DEFAULT 0,
    cancelled_subscriptions INTEGER DEFAULT 0,
    active_subscriptions INTEGER DEFAULT 0,
    churn_rate NUMERIC DEFAULT 0,
    monthly_recurring_revenue NUMERIC DEFAULT 0,
    average_revenue_per_user NUMERIC DEFAULT 0,
    lifetime_value NUMERIC DEFAULT 0,
    trial_conversion_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_id, date)
);

-- 6. Create indexes for performance
CREATE INDEX idx_subscription_plans_status ON public.subscription_plans(status);
CREATE INDEX idx_subscription_plans_plan_id ON public.subscription_plans(plan_id);
CREATE INDEX idx_subscriptions_subscription_id ON public.subscriptions(subscription_id);
CREATE INDEX idx_subscriptions_plan_id ON public.subscriptions(plan_id);
CREATE INDEX idx_subscriptions_subscriber_id ON public.subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_merchant_id ON public.subscriptions(merchant_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing_date ON public.subscriptions(next_billing_date);
CREATE INDEX idx_subscription_payments_subscription_id ON public.subscription_payments(subscription_id);
CREATE INDEX idx_subscription_payments_due_date ON public.subscription_payments(due_date);
CREATE INDEX idx_subscription_payments_payment_status ON public.subscription_payments(payment_status);
CREATE INDEX idx_subscription_analytics_plan_id ON public.subscription_analytics(plan_id);
CREATE INDEX idx_subscription_analytics_date ON public.subscription_analytics(date);

-- 7. Enable RLS on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_analytics ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_subscription_plans"
ON public.subscription_plans
FOR ALL
TO authenticated
USING (true)  -- Plans can be viewed by all authenticated users
WITH CHECK (true);  -- Plans can be created by authenticated users

CREATE POLICY "users_manage_own_subscriptions"
ON public.subscriptions
FOR ALL
TO authenticated
USING (merchant_id = auth.uid() OR subscriber_id = auth.uid())
WITH CHECK (merchant_id = auth.uid() OR subscriber_id = auth.uid());

CREATE POLICY "users_manage_own_subscription_payments"
ON public.subscription_payments
FOR ALL
TO authenticated
USING (
    subscription_id IN (
        SELECT id FROM public.subscriptions 
        WHERE merchant_id = auth.uid() OR subscriber_id = auth.uid()
    )
)
WITH CHECK (
    subscription_id IN (
        SELECT id FROM public.subscriptions 
        WHERE merchant_id = auth.uid() OR subscriber_id = auth.uid()
    )
);

CREATE POLICY "users_manage_own_subscription_analytics"
ON public.subscription_analytics
FOR ALL
TO authenticated
USING (merchant_id = auth.uid())
WITH CHECK (merchant_id = auth.uid());

-- 9. Create utility functions
CREATE OR REPLACE FUNCTION public.generate_subscription_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $func$
BEGIN
    RETURN 'sub_' || substr(md5(random()::text), 1, 8) || '_' || extract(epoch from now())::bigint;
END;
$func$;

CREATE OR REPLACE FUNCTION public.calculate_next_billing_date(
    start_date TIMESTAMPTZ,
    interval_type public.billing_interval
)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
AS $func$
BEGIN
    RETURN CASE interval_type
        WHEN 'daily' THEN start_date + INTERVAL '1 day'
        WHEN 'weekly' THEN start_date + INTERVAL '1 week'
        WHEN 'monthly' THEN start_date + INTERVAL '1 month'
        WHEN 'quarterly' THEN start_date + INTERVAL '3 months'
        WHEN 'yearly' THEN start_date + INTERVAL '1 year'
        ELSE start_date + INTERVAL '1 month'
    END;
END;
$func$;

-- 10. Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_subscription_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_subscription_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_subscription_updated_at();

CREATE TRIGGER update_subscription_payments_updated_at
    BEFORE UPDATE ON public.subscription_payments
    FOR EACH ROW EXECUTE FUNCTION public.update_subscription_updated_at();

-- 11. Sample subscription data for existing users
DO $$
DECLARE
    existing_merchant_id UUID;
    plan1_id UUID := gen_random_uuid();
    plan2_id UUID := gen_random_uuid();
    plan3_id UUID := gen_random_uuid();
    sub1_id UUID := gen_random_uuid();
    sub2_id UUID := gen_random_uuid();
BEGIN
    -- Get existing merchant ID from user_profiles
    SELECT id INTO existing_merchant_id FROM public.user_profiles WHERE role = 'merchant' LIMIT 1;
    
    IF existing_merchant_id IS NOT NULL THEN
        -- Insert subscription plans
        INSERT INTO public.subscription_plans (id, plan_id, name, description, amount, currency, billing_interval, trial_days, features) VALUES
            (plan1_id, 'basic_monthly', 'Basic Monthly', 'Basic plan with essential features', 29.99, 'USD', 'monthly', 7, 
             '["Up to 100 transactions", "Basic analytics", "Email support"]'::jsonb),
            (plan2_id, 'pro_monthly', 'Pro Monthly', 'Professional plan with advanced features', 79.99, 'USD', 'monthly', 14,
             '["Unlimited transactions", "Advanced analytics", "Priority support", "API access"]'::jsonb),
            (plan3_id, 'enterprise_yearly', 'Enterprise Yearly', 'Enterprise plan with all features', 999.99, 'USD', 'yearly', 30,
             '["Unlimited everything", "Custom integrations", "Dedicated support", "White-label options"]'::jsonb);

        -- Insert sample subscriptions
        INSERT INTO public.subscriptions (
            id, subscription_id, plan_id, subscriber_id, merchant_id, status, 
            current_period_start, current_period_end, next_billing_date,
            subscriber_email, billing_amount, billing_currency
        ) VALUES
            (sub1_id, public.generate_subscription_id(), plan1_id, existing_merchant_id, existing_merchant_id, 'active',
             CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month', CURRENT_TIMESTAMP + INTERVAL '1 month',
             'subscriber1@example.com', 29.99, 'USD'),
            (sub2_id, public.generate_subscription_id(), plan2_id, existing_merchant_id, existing_merchant_id, 'active',
             CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '15 days',
             'subscriber2@example.com', 79.99, 'USD');

        -- Insert sample analytics data for the last 7 days
        FOR i IN 0..6 LOOP
            INSERT INTO public.subscription_analytics (
                plan_id, merchant_id, date, new_subscriptions, cancelled_subscriptions, 
                active_subscriptions, monthly_recurring_revenue, churn_rate
            ) VALUES
                (plan1_id, existing_merchant_id, CURRENT_DATE - INTERVAL '1 day' * i, 
                 CASE WHEN i < 3 THEN 2 ELSE 1 END, 
                 CASE WHEN i = 1 THEN 1 ELSE 0 END,
                 5 + i, 149.95, 
                 CASE WHEN i = 1 THEN 5.2 ELSE 2.1 END),
                (plan2_id, existing_merchant_id, CURRENT_DATE - INTERVAL '1 day' * i,
                 CASE WHEN i < 2 THEN 1 ELSE 0 END,
                 0, 3 + (i % 2), 239.97, 1.8);
        END LOOP;
    END IF;
END $$;