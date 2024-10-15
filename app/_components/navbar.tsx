import { 
    NavigationMenu, 
    NavigationMenuContent, 
    NavigationMenuItem, 
    NavigationMenuLink, 
    NavigationMenuList, 
    NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";
import Image from "next/image";

export default function Navbar() {
    return (
        <NavigationMenu className="p-4">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink>
                        Blog
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
} 