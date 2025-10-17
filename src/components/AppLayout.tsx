import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 relative">
          <header className="sticky top-0 z-10 h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4">
            <SidebarTrigger />
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
