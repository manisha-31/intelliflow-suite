import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_DEFAULT_ROUTE } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import modenikLogo from '@/assets/modenik-logo.png';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';

const demoAccounts = [
  { role: 'Admin', email: 'admin@modenik.com', password: 'test123456' },
  { role: 'Marketing', email: 'marketing@modenik.com', password: 'test123456' },
  { role: 'Designer', email: 'designer@modenik.com', password: 'test123456' },
  { role: 'Factory', email: 'factory@modenik.com', password: 'test123456' },
  { role: 'Distributor', email: 'distributor@modenik.com', password: 'test123456' },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error, variant: 'destructive' });
    }
  };

  React.useEffect(() => {
    if (profile) {
      navigate(ROLE_DEFAULT_ROUTE[profile.role], { replace: true });
    }
  }, [profile, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <img src={modenikLogo} alt="Modenik Lifestyle" className="w-16 h-16 rounded-2xl mx-auto glow-primary object-cover" />
          <h1 className="text-3xl font-bold font-heading text-foreground">Modenik Lifestyle</h1>
          <p className="text-muted-foreground font-body">IntelliFlow Suite — Intelligent Collaboration</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-heading">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demo accounts — bottom right */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card/90 backdrop-blur border border-border/60 rounded-lg p-3 shadow-lg w-52">
          <div className="flex items-center gap-1.5 mb-2">
            <KeyRound className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-heading text-muted-foreground tracking-wider">Demo Accounts</span>
          </div>
          <div className="space-y-1">
            {demoAccounts.map(a => (
              <button
                key={a.role}
                type="button"
                onClick={() => { setEmail(a.email); setPassword(a.password); }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-body hover:bg-muted/60 transition-colors group"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">{a.role}</span>
                <span className="text-[10px] text-muted-foreground truncate ml-2">{a.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;