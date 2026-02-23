
-- ============================================
-- IntelliFlow Suite: Database Schema
-- ============================================

-- 1. App Role Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'marketing_manager', 'designer', 'factory', 'distributor');

-- 2. User Roles Table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  department TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Collections Table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  season TEXT,
  year INTEGER,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning','design','production','marketing','launched','archived')),
  target_launch_date DATE,
  actual_launch_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- 5. Designs Table
CREATE TABLE public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  designer_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('bra','brief','panty','camisole','shapewear','nightwear','sportswear')),
  sku_code TEXT UNIQUE,
  file_url TEXT,
  thumbnail_url TEXT,
  approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft','submitted','under_review','revision_requested','approved','rejected')),
  version_number INTEGER DEFAULT 1,
  rejection_reason TEXT,
  product_copy JSONB,
  website_sync_status TEXT DEFAULT 'not_synced' CHECK (website_sync_status IN ('not_synced','draft','live')),
  synced_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- 6. Approval Stages Table
CREATE TABLE public.approval_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id),
  stage_name TEXT,
  decision TEXT DEFAULT 'pending' CHECK (decision IN ('pending','approved','revision_requested','rejected')),
  comments TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.approval_stages ENABLE ROW LEVEL SECURITY;

-- 7. Production Orders Table
CREATE TABLE public.production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
  factory_id UUID REFERENCES public.profiles(id),
  order_number TEXT UNIQUE,
  quantity INTEGER,
  current_stage TEXT DEFAULT 'material_sourcing' CHECK (current_stage IN ('material_sourcing','fabric_cutting','stitching','quality_check','packing','dispatch','delivered')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  due_date DATE,
  completion_percentage INTEGER DEFAULT 0,
  delay_flag BOOLEAN DEFAULT false,
  delay_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;

-- 8. BOM Items Table
CREATE TABLE public.bom_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID REFERENCES public.production_orders(id) ON DELETE CASCADE NOT NULL,
  material_name TEXT,
  material_type TEXT,
  quantity_required DECIMAL,
  quantity_available DECIMAL,
  unit TEXT,
  supplier_name TEXT,
  unit_cost DECIMAL,
  is_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.bom_items ENABLE ROW LEVEL SECURITY;

-- 9. Campaigns Table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  title TEXT,
  description TEXT,
  campaign_type TEXT CHECK (campaign_type IN ('social_media','email','influencer','paid_ads','website_banner')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','active','completed','paused')),
  channels TEXT[],
  start_date DATE,
  end_date DATE,
  budget DECIMAL,
  asset_urls TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- 10. Distributor Orders Table
CREATE TABLE public.distributor_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES public.profiles(id) NOT NULL,
  design_id UUID REFERENCES public.designs(id),
  order_number TEXT UNIQUE,
  quantity_ordered INTEGER,
  quantity_delivered INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','dispatched','partially_delivered','delivered','cancelled')),
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  actual_delivery DATE,
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.distributor_orders ENABLE ROW LEVEL SECURITY;

-- 11. Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT,
  message TEXT,
  type TEXT CHECK (type IN ('approval','production','campaign','system','ai_insight')),
  related_id UUID,
  related_table TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 12. AI Forecasts Table
CREATE TABLE public.ai_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  category TEXT,
  predicted_demand_units INTEGER,
  confidence_score DECIMAL,
  forecast_basis TEXT,
  season_insights TEXT,
  generated_by_model TEXT DEFAULT 'gemini-3-flash-preview',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ai_forecasts ENABLE ROW LEVEL SECURITY;

-- 13. Messages Table (team chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  content TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================
-- Helper Functions (SECURITY DEFINER)
-- ============================================

-- Get current user's profile ID
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
$$;

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Shorthand: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Shorthand: is current user marketing_manager?
CREATE OR REPLACE FUNCTION public.is_marketing_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'marketing_manager')
$$;

-- ============================================
-- Auto-create profile + role on signup trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
  _profile_id UUID;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'designer');
  
  INSERT INTO public.profiles (user_id, full_name, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'department', '')
  )
  RETURNING id INTO _profile_id;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_designs_updated_at BEFORE UPDATE ON public.designs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_production_orders_updated_at BEFORE UPDATE ON public.production_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_distributor_orders_updated_at BEFORE UPDATE ON public.distributor_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

-- user_roles: users can read their own, admins can manage all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- profiles: all authenticated can read, users update own
CREATE POLICY "Authenticated can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- collections: all authenticated can read, admin/marketing can manage
CREATE POLICY "Authenticated can view collections" ON public.collections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Marketing can insert collections" ON public.collections FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_marketing_manager());
CREATE POLICY "Admin/Marketing can update collections" ON public.collections FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_marketing_manager());
CREATE POLICY "Admin can delete collections" ON public.collections FOR DELETE TO authenticated USING (public.is_admin());

-- designs: all authenticated can read, designers own, admin all
CREATE POLICY "Authenticated can view designs" ON public.designs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Designers/Admin can insert designs" ON public.designs FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.has_role(auth.uid(), 'designer')
);
CREATE POLICY "Designers update own draft or admin all" ON public.designs FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.is_marketing_manager() OR (designer_id = public.get_my_profile_id() AND approval_status = 'draft')
);
CREATE POLICY "Admin can delete designs" ON public.designs FOR DELETE TO authenticated USING (public.is_admin());

-- approval_stages: all can read, admin/marketing can manage
CREATE POLICY "Authenticated can view approvals" ON public.approval_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Marketing can manage approvals" ON public.approval_stages FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_marketing_manager());
CREATE POLICY "Admin/Marketing can update approvals" ON public.approval_stages FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_marketing_manager());

-- production_orders: all can read, factory updates own, admin all
CREATE POLICY "Authenticated can view production orders" ON public.production_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Factory can insert production orders" ON public.production_orders FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.has_role(auth.uid(), 'factory'));
CREATE POLICY "Admin or factory owner can update" ON public.production_orders FOR UPDATE TO authenticated USING (
  public.is_admin() OR factory_id = public.get_my_profile_id()
);

-- bom_items: all can read, factory/admin can manage
CREATE POLICY "Authenticated can view bom" ON public.bom_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Factory can manage bom" ON public.bom_items FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.has_role(auth.uid(), 'factory'));
CREATE POLICY "Admin/Factory can update bom" ON public.bom_items FOR UPDATE TO authenticated USING (public.is_admin() OR public.has_role(auth.uid(), 'factory'));

-- campaigns: all can read, admin/marketing manage
CREATE POLICY "Authenticated can view campaigns" ON public.campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Marketing can insert campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_marketing_manager());
CREATE POLICY "Admin/Marketing can update campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (public.is_admin() OR public.is_marketing_manager());
CREATE POLICY "Admin can delete campaigns" ON public.campaigns FOR DELETE TO authenticated USING (public.is_admin());

-- distributor_orders: distributors see own, admin/marketing see all
CREATE POLICY "Distributors view own orders or admin/marketing all" ON public.distributor_orders FOR SELECT TO authenticated USING (
  public.is_admin() OR public.is_marketing_manager() OR distributor_id = public.get_my_profile_id()
);
CREATE POLICY "Distributors/Admin can insert orders" ON public.distributor_orders FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR (public.has_role(auth.uid(), 'distributor') AND distributor_id = public.get_my_profile_id())
);
CREATE POLICY "Admin can update distributor orders" ON public.distributor_orders FOR UPDATE TO authenticated USING (public.is_admin());

-- notifications: users see own only
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = public.get_my_profile_id());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = public.get_my_profile_id());
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- ai_forecasts: all can read, admin can manage
CREATE POLICY "Authenticated can view forecasts" ON public.ai_forecasts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage forecasts" ON public.ai_forecasts FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR public.is_marketing_manager());

-- messages: all authenticated can read and send
CREATE POLICY "Authenticated can view messages" ON public.messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = public.get_my_profile_id());
