import { 
    NavigationMenu, 
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./modeToggle";

export default function Navbar() {
    return (
        <NavigationMenu className="p-4 gap-2">
            <NavigationMenuList>
                <NavigationMenuItem>
                    Blog
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
} 