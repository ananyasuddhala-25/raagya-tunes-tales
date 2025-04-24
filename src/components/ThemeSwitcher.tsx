
import { Moon, Sun, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {theme === 'dark' && <Moon className="h-5 w-5" />}
          {theme === 'light' && <Sun className="h-5 w-5" />}
          {theme === 'ocean' && <Circle className="h-5 w-5 text-ocean" />}
          {theme === 'sunny' && <Circle className="h-5 w-5 text-sunny" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ocean')}>
          <Circle className="mr-2 h-4 w-4 text-ocean" />
          <span>Ocean Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sunny')}>
          <Circle className="mr-2 h-4 w-4 text-sunny" />
          <span>Sunny Yellow</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
