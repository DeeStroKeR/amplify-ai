"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { CreateChat } from "@/components/Sidebar/CreateChat";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/Sidebar/Logout";
import { ColorMode } from "@aws-amplify/ui-react";

export function ConditionalSidebar({ colorMode }: { colorMode: ColorMode }) {
  const pathname = usePathname();
  
  // Only show sidebar on chat pages
  const showSidebar = pathname?.startsWith('/chat');

  if (!showSidebar) {
    return null;
  }

  return (
    <Sidebar>
      <LogoutButton />
      <CreateChat />
      <ThemeToggle initialValue={colorMode} />
    </Sidebar>
  );
}
