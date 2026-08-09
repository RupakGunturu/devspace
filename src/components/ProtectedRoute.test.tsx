import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

vi.mock("@/components/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={["/secret"]}>
      <Routes>
        <Route
          path="/secret"
          element={
            <ProtectedRoute>
              <div>protected-content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>login-page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("shows a loader while the session is being restored", () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: true } as never);
    renderProtected();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("login-page")).not.toBeInTheDocument();
  });

  it("renders children when signed in", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "1", name: "Tester", email: "t@example.com" },
      loading: false,
    } as never);
    renderProtected();
    expect(screen.getByText("protected-content")).toBeInTheDocument();
  });

  it("redirects to /login only once restore has finished", () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false } as never);
    renderProtected();
    expect(screen.getByText("login-page")).toBeInTheDocument();
  });
});
