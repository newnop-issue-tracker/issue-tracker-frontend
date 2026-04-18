import { useState, useRef, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
import CustomButton from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import IssueFlowLogo from "@/components/UI/IssueFlowLogo";
import { toast } from "react-hot-toast";

interface User {
  role: string;
  fullName: string;
  email: string;
}

function NavComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside for sidebar
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

  // Fetch current user
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setIsLogoutModalOpen(false);
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className={`flex flex-col w-full sticky top-0 z-50 bg-brand-white ${isScrolled ? "shadow-md" : ""}`}>
      {/* Navbar */}
      <div
        className={`flex items-center justify-between w-full px-4 sm:px-14 py-4 bg-brand-white max-w-[1920px] mx-auto ${
          isScrolled ? "border-b border-gray-200" : ""
        }`}
      >
        {/* Logo — clicking goes to home/landing page */}
        <a href="/" className="flex items-center">
          <IssueFlowLogo />
        </a>

        {/* Hamburger Menu (Visible below sm) */}
        <button
          className="sm:hidden text-brand-charcoal sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        {/* Auth Buttons (Visible on sm and above) */}
        <div className="hidden sm:flex items-center gap-x-4">
          {currentUser ? (
            <>
              <span className="text-sm text-brand-charcoal font-Mainfront">
                Hi, {currentUser.fullName}
              </span>
              <CustomButton
                title="Logout"
                variant="outline"
                icon={<FiLogOut className="w-4 h-4" />}
                iconPosition="left"
                onClick={handleLogoutClick}
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

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Visible below sm) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-brand-white z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:hidden shadow-xl`}
        ref={sidebarRef}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <IssueFlowLogo />
          </div>

          {/* Sidebar Auth Buttons */}
          <div className="mt-auto p-4 flex flex-col gap-3 border-t border-gray-200">
            {currentUser ? (
              <>
                <p className="text-sm text-gray-600 mb-2 font-Mainfront">
                  Signed in as <strong>{currentUser.fullName}</strong>
                </p>
                <CustomButton
                  title="Logout"
                  variant="outline"
                  icon={<FiLogOut className="w-4 h-4" />}
                  iconPosition="left"
                  onClick={handleLogoutClick}
                  className="w-full text-left"
                />
              </>
            ) : (
              <>
                <a href="/signup" onClick={() => setIsSidebarOpen(false)} className="block w-full">
                  <CustomButton
                    title="SignUp"
                    variant="outline"
                    icon={<FiUserPlus className="w-4 h-4" />}
                    iconPosition="left"
                    fitWidth={true}
                    className="w-full text-left"
                  />
                </a>
                <a href="/signin" onClick={() => setIsSidebarOpen(false)} className="block w-full">
                  <CustomButton
                    title="Login"
                    variant="outline"
                    icon={<FiLogIn className="w-4 h-4" />}
                    iconPosition="left"
                    fitWidth={true}
                    className="w-full text-left"
                  />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-gray-700 font-Mainfront">
            Are you sure you want to logout? You will need to login again to
            access your account.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NavComponent;
