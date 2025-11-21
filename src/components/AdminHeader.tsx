import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LogOut, User } from 'lucide-react';

export const AdminHeader = () => {
  const { user, username, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      toast.success('Logout realizado com sucesso!');
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center group">
              <span className="text-2xl font-bold title-font text-primary group-hover:text-golden transition-colors">
                Sol & Lua
              </span>
              <span className="ml-3 text-sm font-medium text-muted-foreground">
                Painel Administrativo
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {username || user?.email?.split('@')[0] || 'Admin'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
