import React, { type PropsWithChildren } from "react";
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

type AppShellProps = PropsWithChildren<{
    title: string;
    description?: string;
    breadcrumbs?: AppShellBreadcrumbItem[];
    sidebar: React.ReactNode;
    headerActions?: React.ReactNode;
    mainId?: string;
}>;

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
        <div className="min-h-screen bg-ios-gray-6 dark:bg-slate-950 text-foreground font-sf-pro" id="app-shell-root">
            <a
                className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:rounded-ios focus:bg-ios-blue focus:px-4 focus:py-2 focus:text-white focus:shadow-ios"
                href={`#${mainId}`}
                onClick={handleSkipToMain}
            >
                Bỏ qua tới nội dung chính
            </a>
            <header className="ios-navbar safe-top">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-sf-pro text-ios-title-2 font-bold tracking-tight text-foreground">{title}</h1>
                        {description ? (
                            <p className="font-sf-pro text-ios-subhead text-muted-foreground/90">{description}</p>
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
                        "glass-subtle border-slate-200/50 dark:border-slate-800/50",
                        "border-b lg:w-72 lg:border-b-0 lg:border-r",
                    )}
                >
                    <div className="flex flex-col gap-6 px-6 py-6 scrollbar-ios">{sidebar}</div>
                </aside>
                <div className="flex flex-1 flex-col">
                    {breadcrumbs && breadcrumbs.length > 0 ? (
                        <div className="border-b border-slate-200/40 dark:border-slate-800/40 glass-subtle px-6 py-3">
                            <Breadcrumb>
                                <BreadcrumbList className="font-sf-pro text-ios-footnote">
                                    {breadcrumbs.map((item, index) => (
                                        <BreadcrumbItem key={`${item.label}-${index}`}>
                                            {item.href && !item.current ? (
                                                <BreadcrumbLink href={item.href} className="text-ios-blue hover:text-ios-blue/80">{item.label}</BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>
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
                        className="flex-1 space-y-6 px-6 py-6 safe-bottom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2"
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
