import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/site";
import ScrollToTop from "./components/ScrollToTop";
import { CommandMenu } from "./components/CommandMenu";
import GoogleOAuthPrompt from "./components/GoogleOAuthPrompt";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import PostDetail from "./pages/PostDetail";
import SeriesFeed from "./pages/SeriesFeed";
import FeedArchive from "./pages/FeedArchive";
import StackBreakdown from "./pages/StackBreakdown";
import StackBreakdownDetail from "./pages/StackBreakdownDetail";
import About from "./pages/About";
import CheatSheets from "./pages/CheatSheets";
import CheatSheetDetail from "./pages/CheatSheetDetail";
import Tips from "./pages/Tips";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <CommandMenu />
      <GoogleOAuthPrompt />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Layout>
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
    </Layout>
  );
}
