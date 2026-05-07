-- Add billing_package_start_date to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS billing_package_start_date date;
