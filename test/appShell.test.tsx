import { describe, expect, test } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppShell, { type AppShellBreadcrumbItem } from "../src/components/layout/AppShell";

const sidebar = <div>Sidebar content</div>;
const breadcrumbs: AppShellBreadcrumbItem[] = [
  { label: "Trang chủ", href: "#home" },
  { label: "Lịch phân ca", current: true },
];

describe("AppShell", () => {
  test("skip link focuses main content", async () => {
    const user = userEvent.setup();
    render(
      <AppShell title="Test" sidebar={sidebar} breadcrumbs={breadcrumbs}>
        <button type="button">Nội dung chính</button>
      </AppShell>
    );

    await user.tab();
    const skipLink = screen.getByRole("link", { name: /bỏ qua tới nội dung chính/i });
    expect(skipLink).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("main")).toHaveFocus();
  });

  test("renders breadcrumb navigation", () => {
    render(
      <AppShell title="Test" sidebar={sidebar} breadcrumbs={breadcrumbs}>
        <p>Nội dung</p>
      </AppShell>
    );

    const breadcrumbNav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(breadcrumbNav).toBeInTheDocument();
    expect(breadcrumbNav).toHaveTextContent("Trang chủ");
    expect(breadcrumbNav).toHaveTextContent("Lịch phân ca");
  });
});
