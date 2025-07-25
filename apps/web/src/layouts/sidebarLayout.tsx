import { AppSidebar } from '@/components/app-sidebar';
import { navMenu } from '@/components/navMenu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { memo, useMemo } from 'react';
import { Outlet, useMatches } from 'react-router';

const SidebarLayout = memo(() => {
  const matches = useMatches();

  const breadcrumb = useMemo(() => {
    const lastMatch = matches[matches.length - 1];
    return navMenu.find((item) => item.path === lastMatch.pathname)?.title;
  }, [matches[matches.length - 1]]);

  return (
    <SidebarProvider className="w-screen h-screen overflow-hidden">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>Bookmark</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 h-0 bg-background p-2">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
});

export default SidebarLayout;
