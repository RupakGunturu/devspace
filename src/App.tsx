import { lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Header, Footer } from "./components/site";
import { SiteSidebar } from "./components/SiteSidebar";
import { Home as HomeIcon } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";
import { CommandMenu } from "./components/CommandMenu";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RequireAdmin } from "./components/admin/RequireAdmin";
import { AdminLayout } from "./components/admin/AdminLayout";
import { PageSkeleton } from "./components/skeletons/PageSkeleton";

const Home = lazy(() => import("./pages/Home"));
const Tools = lazy(() => import("./pages/Tools"));
const ToolDetail = lazy(() => import("./pages/ToolDetail"));
const Games = lazy(() => import("./pages/Games"));
const GameDetail = lazy(() => import("./pages/GameDetail"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const SeriesFeed = lazy(() => import("./pages/SeriesFeed"));
const FeedArchive = lazy(() => import("./pages/FeedArchive"));
const StackBreakdown = lazy(() => import("./pages/StackBreakdown"));
const StackBreakdownDetail = lazy(() => import("./pages/StackBreakdownDetail"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CheatSheets = lazy(() => import("./pages/CheatSheets"));
const CheatSheetDetail = lazy(() => import("./pages/CheatSheetDetail"));
const Tips = lazy(() => import("./pages/Tips"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Profile = lazy(() => import("./pages/Profile"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Hiring = lazy(() => import("./pages/Hiring"));
const McpSkills = lazy(() => import("./pages/McpSkills"));
const HiddenGems = lazy(() => import("./pages/HiddenGems"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ContentEditor = lazy(() => import("./pages/admin/ContentEditor"));
const ContentManager = lazy(() => import("./pages/admin/ContentManager"));
const GamesManager = lazy(() => import("./pages/admin/GamesManager"));
const GameEditor = lazy(() => import("./pages/admin/GameEditor"));
const ToolsManager = lazy(() => import("./pages/admin/ToolsManager"));
const ToolEditor = lazy(() => import("./pages/admin/ToolEditor"));
const ImageManager = lazy(() => import("./pages/admin/ImageManager"));
const DeploymentLog = lazy(() => import("./pages/admin/DeploymentLog"));

const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
]);

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.has(pathname);
  const isAdmin = pathname.startsWith("/admin");
  const showNav = !isAuth && !isAdmin;
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <CommandMenu />
      {showNav && <SiteSidebar open={navOpen} onClose={() => setNavOpen(false)} />}
      {showNav ? (
        <Header onMenuClick={() => setNavOpen((v) => !v)} />
      ) : isAuth ? (
        <Link
          to="/"
          aria-label="Back to home"
          className="fixed left-4 top-4 z-30 rounded-sm p-2 text-muted transition-colors hover:text-yellow"
        >
          <HomeIcon className="h-5 w-5" />
        </Link>
      ) : null}
      <main className={`flex-1 ${showNav ? "lg:pl-16" : ""}`}>{children}</main>
      {showNav && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:slug" element={<ToolDetail />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/hot-take/:slug" element={<PostDetail />} />
          <Route path="/stack-breakdown" element={<StackBreakdown />} />
          <Route path="/stack-breakdown/:slug" element={<StackBreakdownDetail />} />
          <Route path="/feed/:series" element={<SeriesFeed />} />
          <Route path="/feed" element={<FeedArchive />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/tos" element={<TermsOfService />} />
          <Route path="/cheat-sheets" element={<CheatSheets />} />
          <Route path="/cheat-sheets/:id" element={<CheatSheetDetail />} />
          <Route path="/tips" element={<Tips />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/mcp-skills" element={<McpSkills />} />
          <Route path="/hidden-gems" element={<HiddenGems />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="content/new" element={<ContentEditor />} />
            <Route path="content/:id/edit" element={<ContentEditor />} />
            <Route path="games" element={<GamesManager />} />
            <Route path="games/new" element={<GameEditor />} />
            <Route path="games/:id/edit" element={<GameEditor />} />
            <Route path="tools" element={<ToolsManager />} />
            <Route path="tools/new" element={<ToolEditor />} />
            <Route path="tools/:id/edit" element={<ToolEditor />} />
            <Route path="images" element={<ImageManager />} />
            <Route path="deployments" element={<DeploymentLog />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
