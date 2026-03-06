import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-background min-h-screen text-slate relative antialiased selection:bg-accent selection:text-obsidian">
      {/* Global Noise Texture */}
      <div className="noise-overlay" />

      <Navbar />

      <main>
        <Hero />
        <Features />
        <Philosophy />
        <Protocol />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}

export default App;
