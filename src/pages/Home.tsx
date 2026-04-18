import { FiArrowRight, FiGithub } from "react-icons/fi";
import CustomButton from "@/components/UI/Button";
import { Link } from "react-router-dom";
import Footer from "@/components/UI/Footer";

const Home = () => {
  return (
    <div className="flex flex-col bg-slate-950 w-full overflow-x-hidden">
      {/* Hero Section takes exactly full screen minus nav */}
      <main className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-center font-Inter lg:py-0">
        {/* Background Graphic Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,white_40%,transparent)]">
          <svg className="absolute inset-0 h-full w-full stroke-white/[0.05]" aria-hidden="true">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M.5 40V.5H40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Background Gradient Glowing Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] animate-in fade-in duration-[1500ms]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] animate-in fade-in duration-[1500ms] delay-500" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium font-Mainfront shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            IssueFlow 2.0 is now live
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-Mainfront mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            Ship fewer bugs, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
              faster than ever.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-Inter animate-in fade-in slide-in-from-bottom-6 duration-[900ms]">
            The intelligent issue tracker designed to keep your development loop perfectly in sync. Built for speed, precision, and modern engineering teams.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-[1100ms]">
            <Link to="/signup">
              <CustomButton
                title="Start for free"
                variant="primary"
                icon={<FiArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="text-base px-8 py-6 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
              />
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <CustomButton
                title="View GitHub"
                variant="outline"
                icon={<FiGithub className="w-5 h-5" />}
                iconPosition="left"
                className="text-base px-8 py-6 rounded-full bg-transparent border-white/20 text-white hover:bg-white/5 w-full sm:w-auto"
              />
            </a>
          </div>
        </div>
      </main>

      <div className="dark">
         <Footer />
      </div>
    </div>
  );
};

export default Home;
