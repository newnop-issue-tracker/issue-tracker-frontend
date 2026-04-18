interface IssueFlowLogoProps {
  className?: string;
}

function IssueFlowLogo({ className = "" }: IssueFlowLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-brand-navy rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">/</span>
      </div>
      <span className="text-brand-charcoal dark:text-white font-bold text-xl font-Mainfront tracking-tight">
        IssueFlow
      </span>
    </div>
  );
}

export default IssueFlowLogo;
