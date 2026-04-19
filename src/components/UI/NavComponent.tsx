import { useState, useRef, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { FiLogIn, FiUserPlus, FiLogOut, FiGrid } from "react-icons/fi";
import CustomButton from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import IssueFlowLogo from "@/components/UI/IssueFlowLogo";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/auth.api";
import { queryClient } from "@/lib/queryClient";
import { useNavigate } from "react-router-dom";

function NavComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".sidebar-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      queryClient.clear();
      setIsLogoutModalOpen(false);
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <div className={`flex flex-col w-full sticky top-0 z-50 bg-brand-white ${isScrolled ? "shadow-md" : ""}`}>
      <div className={`flex items-center justify-between w-full px-4 sm:px-14 py-4 bg-brand-white max-w-[1920px] mx-auto ${isScrolled ? "border-b border-gray-200" : ""}`}>
        <a href="/" className="flex items-center">
          <IssueFlowLogo />
        </a>

        <button
          className="sm:hidden text-brand-charcoal sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        <div className="hidden sm:flex items-center gap-x-4">
          {user ? (
            <>
              <span className="text-sm text-brand-charcoal font-Mainfront">
                Hi, {user.name?.split(" ")[0] ?? "User"}
              </span>
              <CustomButton
                title="Dashboard"
                variant="outline"
                icon={<FiGrid className="w-4 h-4" />}
                iconPosition="left"
                fitWidth={true}
                onClick={() => navigate("/dashboard")}
                className="text-nowrap"
              />
              <CustomButton
                title="Logout"
                variant="outline"
                icon={<FiLogOut className="w-4 h-4" />}
                iconPosition="left"
                onClick={() => setIsLogoutModalOpen(true)}
                className="text-nowrap"
              />
            </>
          ) : (
            <>
              <a href="/signup">
                <CustomButton
                  title="SignUp"
                  variant="outline"
                  icon={<FiUserPlus className="w-4 h-4" />}
                  iconPosition="left"
                  fitWidth={true}
                  className="text-nowrap"
                />
              </a>
              <a href="/signin">
                <CustomButton
                  title="Login"
                  variant="outline"
                  icon={<FiLogIn className="w-4 h-4" />}
                  iconPosition="left"
                  className="text-nowrap"
                />
              </a>
            </>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 sm:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-brand-white z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 sm:hidden shadow-xl`}
        ref={sidebarRef}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <IssueFlowLogo />
          </div>

          <div className="mt-auto p-4 flex flex-col gap-3 border-t border-gray-200">
            {user ? (
              <>
                <p className="text-sm text-gray-600 mb-2 font-Mainfront">
                  Signed in as <strong>{user.name}</strong>
                </p>
                <CustomButton
                  title="Dashboard"
                  variant="outline"
                  icon={<FiGrid className="w-4 h-4" />}
                  iconPosition="left"
                  fitWidth={true}
                  onClick={() => { navigate("/dashboard"); setIsSidebarOpen(false); }}
                  className="w-full"
                />
                <CustomButton
                  title="Logout"
                  variant="outline"
                  icon={<FiLogOut className="w-4 h-4" />}
                  iconPosition="left"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full"
                />
              </>
            ) : (
              <>
                <a href="/signup" onClick={() => setIsSidebarOpen(false)} className="block w-full">
                  <CustomButton title="SignUp" variant="outline" icon={<FiUserPlus className="w-4 h-4" />} iconPosition="left" fitWidth={true} className="w-full" />
                </a>
                <a href="/signin" onClick={() => setIsSidebarOpen(false)} className="block w-full">
                  <CustomButton title="Login" variant="outline" icon={<FiLogIn className="w-4 h-4" />} iconPosition="left" fitWidth={true} className="w-full" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirm Logout">
        <div className="space-y-4">
          <p className="text-gray-700 font-Mainfront">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-end space-x-4">
            <button onClick={() => setIsLogoutModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NavComponent;
