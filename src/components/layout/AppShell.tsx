import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface AppShellBreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

interface AppShellProps {
    title: string;
    description?: string;
    breadcrumbs?: AppShellBreadcrumbItem[];
    sidebar: React.ReactNode;
    children: React.ReactNode;
    headerActions?: React.ReactNode;
    mainId?: string;
}

const DEFAULT_MAIN_ID = "app-main-content";

function focusMain(main: HTMLElement) {
    if (main.focus) {
        main.focus({ preventScroll: true });
    }
    if (typeof main.scrollIntoView === "function") {
        main.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

export default function AppShell({
    title,
    description,
    breadcrumbs,
    sidebar,
    children,
    headerActions,
    mainId = DEFAULT_MAIN_ID,
}: AppShellProps) {
    const mainRef = React.useRef<HTMLElement>(null);

    const handleSkipToMain = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            const main = mainRef.current;
            if (!main) {
                return;
            }
            event.preventDefault();
            focusMain(main);
            if (typeof window !== "undefined" && main.id) {
                window.location.hash = `#${main.id}`;
            }
        },
        [],
    );

    return (
        <div className="min-h-screen bg-background text-foreground" id="app-shell-root">
            <a
                className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
                href={`#${mainId}`}
                onClick={handleSkipToMain}
            >
                Bỏ qua tới nội dung chính
            </a>
            <header className="border-b bg-card/80">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h1>
                        {description ? (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        ) : null}
                    </div>
                    {headerActions ? (
                        <div className="text-sm text-muted-foreground sm:text-right">{headerActions}</div>
                    ) : null}
                </div>
            </header>
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
                <aside
                    aria-label="Sidebar"
                    className={cn(
                        "border-border/60 bg-sidebar text-sidebar-foreground",
                        "border-b lg:w-72 lg:border-b-0 lg:border-r",
                    )}
                >
                    <div className="flex flex-col gap-6 px-6 py-6">{sidebar}</div>
                </aside>
                <div className="flex flex-1 flex-col">
                    {breadcrumbs && breadcrumbs.length > 0 ? (
                        <div className="border-b border-border/60 bg-background/70 px-6 py-3">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((item, index) => (
                                        <BreadcrumbItem key={`${item.label}-${index}`}>
                                            {item.href && !item.current ? (
                                                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                            )}
                                            {index < breadcrumbs.length - 1 ? <BreadcrumbSeparator /> : null}
                                        </BreadcrumbItem>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    ) : null}
                    <main
                        aria-label="Main content"
                        className="flex-1 space-y-6 px-6 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        id={mainId}
                        ref={mainRef}
                        tabIndex={-1}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
