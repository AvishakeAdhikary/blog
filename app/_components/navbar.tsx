import { 
    NavigationMenu, 
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";

export default function Navbar() {
    return (
        <NavigationMenu className="flex p-4 gap-2 max-w-full">
            <NavigationMenuList className="flex justify-between max-w-full">
                <NavigationMenuItem className="font-extrabold">
                    <Link href="/">Blog</Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex flex-row">
                    <ModeToggle />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
} 