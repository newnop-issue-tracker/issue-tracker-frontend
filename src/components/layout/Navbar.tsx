import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Avatar } from '@/components/UI/Avatar';
import { Button } from '@/components/UI/Button';
import { Icon } from '@/components/UI/Icon';
import IssueFlowLogo from '@/components/UI/IssueFlowLogo';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useLogout } from '@/features/auth/hooks';

interface NavbarProps {
  onCreate: () => void;
}

export function Navbar({ onCreate }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const openCmd = useUiStore((s) => s.openCommandPalette);
  const logout = useLogout();

  const currentTab = location.pathname.startsWith('/issues') ? 'issues' : 'dashboard';

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
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

      <div className="row gap-2" style={{ marginLeft: 'auto' }}>
        <div className="tabs" role="tablist" style={{ marginRight: 4 }}>
          <button
            className="tab"
            data-on={currentTab === 'dashboard'}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className="tab"
            data-on={currentTab === 'issues'}
            onClick={() => navigate('/issues')}
          >
            Issues
          </button>
        </div>
        <Button variant="primary" size="sm" onClick={onCreate} icon={<Icon.Plus size={14} />}>
          New issue
        </Button>
        <Button
          variant="ghost"
          icon={<Icon.LogOut />}
          onClick={() => logout.mutate()}
          title="Sign out"
        />
        {user && <Avatar user={user} />}
      </div>
    </nav>
  );
}
