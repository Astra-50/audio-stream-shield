
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield, Home, Settings, CreditCard, Users, Headphones } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/audio-setup', label: 'Audio Setup', icon: Headphones },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/billing', label: 'Billing', icon: CreditCard },
    { href: '/testimonials', label: 'Testimonials', icon: Users },
  ];

  const NavContent = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">AudioGuard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <NavContent />
                <div className="ml-6 pl-6 border-l border-gray-200">
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-2 mt-8">
                  {user ? (
                    <>
                      <NavContent />
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <Button
                          onClick={handleSignOut}
                          variant="ghost"
                          className="w-full justify-start text-gray-600 hover:text-gray-900"
                        >
                          Sign out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button asChild variant="ghost" className="justify-start">
                        <Link to="/auth" onClick={() => setIsOpen(false)}>Sign in</Link>
                      </Button>
                      <Button asChild className="justify-start">
                        <Link to="/auth" onClick={() => setIsOpen(false)}>Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
