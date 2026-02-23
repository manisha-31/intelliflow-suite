import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ROLE_DEFAULT_ROUTE } from "@/types/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import MarketingDashboard from "@/pages/marketing/MarketingDashboard";
import DesignerWorkspace from "@/pages/designer/DesignerWorkspace";
import FactoryProduction from "@/pages/factory/FactoryProduction";
import DistributorOrders from "@/pages/distributor/DistributorOrders";
import CollectionsPage from "@/pages/CollectionsPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFound from "@/pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const DefaultRedirect = () => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!isAuthenticated || !profile) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_DEFAULT_ROUTE[profile.role]} replace />;
};

const LoginGuard = () => {
  const { isAuthenticated, profile } = useAuth();
  if (isAuthenticated && profile) return <Navigate to={ROLE_DEFAULT_ROUTE[profile.role]} replace />;
  return <LoginPage />;
};

const SignupGuard = () => {
  const { isAuthenticated, profile } = useAuth();
  if (isAuthenticated && profile) return <Navigate to={ROLE_DEFAULT_ROUTE[profile.role]} replace />;
  return <SignupPage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginGuard />} />
            <Route path="/signup" element={<SignupGuard />} />
            <Route path="/" element={<DefaultRedirect />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes with sidebar layout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><div className="text-muted-foreground">User Management — coming soon</div></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><div className="text-muted-foreground">Analytics — coming soon</div></ProtectedRoute>} />

              {/* Marketing routes */}
              <Route path="/marketing/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'marketing_manager']}><MarketingDashboard /></ProtectedRoute>} />
              <Route path="/marketing/campaigns" element={<ProtectedRoute allowedRoles={['admin', 'marketing_manager']}><div className="text-muted-foreground">Campaigns — coming soon</div></ProtectedRoute>} />

              {/* Designer routes */}
              <Route path="/designer/workspace" element={<ProtectedRoute allowedRoles={['admin', 'designer']}><DesignerWorkspace /></ProtectedRoute>} />

              {/* Factory routes */}
              <Route path="/factory/production" element={<ProtectedRoute allowedRoles={['admin', 'factory']}><FactoryProduction /></ProtectedRoute>} />

              {/* Distributor routes */}
              <Route path="/distributor/orders" element={<ProtectedRoute allowedRoles={['admin', 'distributor']}><DistributorOrders /></ProtectedRoute>} />

              {/* Shared routes */}
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/approvals" element={<ProtectedRoute allowedRoles={['admin', 'marketing_manager']}><div className="text-muted-foreground">Approvals — coming soon</div></ProtectedRoute>} />
              <Route path="/production" element={<ProtectedRoute allowedRoles={['admin']}><div className="text-muted-foreground">Production Overview — coming soon</div></ProtectedRoute>} />
              <Route path="/ai-insights" element={<ProtectedRoute allowedRoles={['admin', 'marketing_manager']}><div className="text-muted-foreground">AI Insights — coming soon</div></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;