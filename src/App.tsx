import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/site";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import PostDetail from "./pages/PostDetail";
import SeriesFeed from "./pages/SeriesFeed";
import FeedArchive from "./pages/FeedArchive";
import About from "./pages/About";
import CheatSheets from "./pages/CheatSheets";
import CheatSheetDetail from "./pages/CheatSheetDetail";
import Tips from "./pages/Tips";
import NotFound from "./pages/NotFound";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
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
        <Route path="/feed/:series" element={<SeriesFeed />} />
        <Route path="/feed" element={<FeedArchive />} />
        <Route path="/about" element={<About />} />
        <Route path="/cheat-sheets" element={<CheatSheets />} />
        <Route path="/cheat-sheets/:id" element={<CheatSheetDetail />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
