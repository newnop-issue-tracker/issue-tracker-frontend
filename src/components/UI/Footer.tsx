import IssueFlowLogo from "./IssueFlowLogo";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 bg-white border-t border-gray-100 font-Inter mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <IssueFlowLogo className="scale-90" />
          <p className="text-sm text-gray-500 font-Mainfront mt-2">
            © {new Date().getFullYear()} IssueFlow. All rights reserved.
          </p>
        </div>
        
        <div className="flex gap-6 text-sm text-gray-500 font-medium">
          <a href="#" className="hover:text-brand-navy transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-navy transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-navy transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
