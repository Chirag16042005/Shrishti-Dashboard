-- Create tables for Shrish Creative Studio Freelancer Dashboard (Simplified Auth Version)

-- Clients table
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  company text,
  email text,
  phone text,
  gst text,
  address text,
  notes text
);

-- Projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references public.clients on delete restrict not null,
  brand_name text,
  service text not null,
  description text,
  status text default 'Planning' check (status in ('Planning', 'Active', 'Completed', 'On Hold', 'Cancelled')),
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  project_value numeric default 0 not null,
  amount_received numeric default 0 not null,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  notes text
);

-- Payments table
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references public.projects on delete cascade not null,
  amount numeric not null,
  payment_date timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'Pending' check (status in ('Paid', 'Pending', 'Overdue', 'Partially Paid')),
  notes text
);

-- Functions and Triggers for updated_at

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_clients
  before update on public.clients
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_projects
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_payments
  before update on public.payments
  for each row execute procedure public.handle_updated_at();
