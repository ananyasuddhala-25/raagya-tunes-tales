
import { useAuth } from '@/context/AuthContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { LogOut, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  openChatbot: () => void;
}

export function Navbar({ openChatbot }: NavbarProps) {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-background/80 border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Raagya</span>
          <span className="hidden sm:inline-block text-sm text-muted-foreground">Tunes & Tales</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
            Discover
          </Link>
          <Link to="/stories" className="text-sm font-medium hover:text-primary">
            Story Engine
          </Link>
          <Link to="/favorites" className="text-sm font-medium hover:text-primary">
            Favorites
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={openChatbot}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <ThemeSwitcher />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={logout} 
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
