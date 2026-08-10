import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Header, Footer } from "./components/site";
import { Home as HomeIcon } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";
import { CommandMenu } from "./components/CommandMenu";
import GoogleOAuthPrompt from "./components/GoogleOAuthPrompt";
import { ProtectedRoute } from "./components/ProtectedRoute";
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

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <CommandMenu />
      {!isAuth && <GoogleOAuthPrompt />}
      {!isAuth && <Header />}
      {isAuth && (
        <Link
          to="/"
          aria-label="Back to home"
          className="fixed left-4 top-4 z-30 rounded-sm p-2 text-muted transition-colors hover:text-yellow"
        >
          <HomeIcon className="h-5 w-5" />
        </Link>
      )}
      <main className="flex-1">{children}</main>
      {!isAuth && <Footer />}
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
