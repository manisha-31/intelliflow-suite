import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ROLE_NAV_ACCESS } from "@/types/auth";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import OrdersPage from "@/pages/OrdersPage";
import InventoryPage from "@/pages/InventoryPage";
import DesignsPage from "@/pages/DesignsPage";
import ProductionPage from "@/pages/ProductionPage";
import ReportsPage from "@/pages/ReportsPage";
import AIAnalyticsPage from "@/pages/AIAnalyticsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout />;
};

const RoleGuard: React.FC<{ path: string; children: React.ReactNode }> = ({ path, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const allowed = ROLE_NAV_ACCESS[user.role];
  if (!allowed.includes(path)) return <Navigate to={allowed[0]} replace />;
  return <>{children}</>;
};

const LoginGuard = () => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) return <Navigate to={ROLE_NAV_ACCESS[user.role][0]} replace />;
  return <LoginPage />;
};

const DefaultRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_NAV_ACCESS[user.role][0]} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginGuard />} />
            <Route path="/" element={<DefaultRedirect />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<RoleGuard path="/dashboard"><DashboardPage /></RoleGuard>} />
              <Route path="/orders" element={<RoleGuard path="/orders"><OrdersPage /></RoleGuard>} />
              <Route path="/inventory" element={<RoleGuard path="/inventory"><InventoryPage /></RoleGuard>} />
              <Route path="/designs" element={<RoleGuard path="/designs"><DesignsPage /></RoleGuard>} />
              <Route path="/production" element={<RoleGuard path="/production"><ProductionPage /></RoleGuard>} />
              <Route path="/reports" element={<RoleGuard path="/reports"><ReportsPage /></RoleGuard>} />
              <Route path="/ai-analytics" element={<RoleGuard path="/ai-analytics"><AIAnalyticsPage /></RoleGuard>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
