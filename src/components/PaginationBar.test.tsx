import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaginationBar } from "./PaginationBar";

describe("PaginationBar", () => {
  it("renders nothing when there is a single page", () => {
    const { container } = render(<PaginationBar page={1} totalPages={1} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders all page links for small totals", () => {
    render(<PaginationBar page={2} totalPages={5} onPageChange={() => {}} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("link", { name: String(i) })).toBeInTheDocument();
    }
  });

  it("marks the active page with aria-current", () => {
    render(<PaginationBar page={3} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "2" })).not.toHaveAttribute("aria-current");
  });

  it("renders ellipses for a large page range", () => {
    const { container } = render(
      <PaginationBar page={1} totalPages={10} onPageChange={() => {}} />,
    );

    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "10" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "3" })).not.toBeInTheDocument();
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(1);
  });

  it("renders ellipses on both sides for a middle page", () => {
    const { container } = render(
      <PaginationBar page={5} totalPages={10} onPageChange={() => {}} />,
    );

    expect(screen.getByRole("link", { name: "5" })).toBeInTheDocument();
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(2);
  });

  it("disables previous on the first page and next on the last", () => {
    const { rerender } = render(<PaginationBar page={1} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
      "aria-disabled",
      "false",
    );

    rerender(<PaginationBar page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  });

  it("calls onPageChange when a page link is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<PaginationBar page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("link", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with page +/- 1 for prev/next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<PaginationBar page={3} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("link", { name: "Go to previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByRole("link", { name: "Go to next page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
