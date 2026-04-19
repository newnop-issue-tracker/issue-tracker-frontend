import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Avatar } from "@/components/UI/Avatar";
import { Button } from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icon";
import Modal from "@/components/UI/Modal";
import IssueFlowLogo from "@/components/UI/IssueFlowLogo";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useLogout } from "@/features/auth/hooks";

interface NavbarProps {
  onCreate: () => void;
}

export function Navbar({ onCreate }: NavbarProps) {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const openCmd = useUiStore((s) => s.openCommandPalette);
  const logout = useLogout();

  const currentTab = location.pathname.startsWith("/issues")
    ? "issues"
    : "dashboard";

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <IssueFlowLogo />
      </Link>

      <div className="nav-search" onClick={openCmd}>
        <Icon.Search />
        <input
          className="input"
          placeholder="Search issues, users, labels…"
          readOnly
          onFocus={(e) => {
            e.target.blur();
            openCmd();
          }}
        />
        <span className="kbd">⌘ K</span>
      </div>

      <div className="row gap-2" style={{ marginLeft: "auto" }}>
        <div className="tabs" role="tablist" style={{ marginRight: 4 }}>
          <button
            className="tab"
            data-on={currentTab === "dashboard"}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="tab"
            data-on={currentTab === "issues"}
            onClick={() => navigate("/issues")}
          >
            Issues
          </button>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreate}
          icon={<Icon.Plus size={14} />}
        >
          New issue
        </Button>
        <Button
          variant="ghost"
          icon={<Icon.LogOut />}
          onClick={() => setLogoutModalOpen(true)}
          title="Sign out"
        />
        {user && <Avatar user={user} />}
      </div>

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p
            className="text-gray-700"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Are you sure you want to sign out?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setLogoutModalOpen(false)}
              disabled={logout.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                logout.mutate(undefined, {
                  onSuccess: () => setLogoutModalOpen(false),
                })
              }
              disabled={logout.isPending}
            >
              {logout.isPending ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </div>
      </Modal>
    </nav>
  );
}
