import IssueFlowLogo from "./IssueFlowLogo";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 bg-transparent border-t border-gray-100 dark:border-white/5 font-Inter mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <IssueFlowLogo className="scale-90 opacity-60 backdrop-grayscale grayscale" />
          <p className="text-sm text-gray-500 dark:text-slate-500 font-Mainfront mt-2">
            © {new Date().getFullYear()} IssueFlow. All rights reserved.
          </p>
        </div>
        
        <div className="flex gap-6 text-sm text-gray-500 dark:text-slate-500 font-medium">
          <a href="#" className="hover:text-event-navy dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-event-navy dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-event-navy dark:hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
