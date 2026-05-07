-- 1. Update students table to support financial contracts
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS billing_type text DEFAULT 'mensalidade',
ADD COLUMN IF NOT EXISTS billing_amount numeric,
ADD COLUMN IF NOT EXISTS billing_currency text DEFAULT 'BRL',
ADD COLUMN IF NOT EXISTS billing_day integer,
ADD COLUMN IF NOT EXISTS billing_package_size integer;

-- 2. Create the payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    currency text DEFAULT 'BRL',
    due_date date NOT NULL,
    paid_at timestamp with time zone,
    status text DEFAULT 'pending', -- 'pending', 'paid', 'canceled'
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS Policies for payments (Teacher can do everything on their own payments)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage their own payments"
ON public.payments
FOR ALL
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

-- Note: Students don't need a select policy here because we bypass RLS in the API using supabaseAdmin 
-- to check for overdue payments, ensuring a secure backend approach.
