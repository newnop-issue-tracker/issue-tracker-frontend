import { colorForUser, initials } from '@/lib/formatters';

interface AvatarProps {
  user?: { id: string; name: string; email?: string } | null;
  size?: 'sm' | 'lg' | 'xl';
}

export function Avatar({ user, size = 'sm' }: AvatarProps) {
  const sizeClass =
    size === 'lg' ? 'avatar avatar-lg' : size === 'xl' ? 'avatar avatar-xl' : 'avatar';

  if (!user) {
    return <span className={sizeClass}>–</span>;
  }

  const color = colorForUser(user.id);
  const style = {
    background: `color-mix(in oklch, ${color} 18%, transparent)`,
    color,
    borderColor: 'transparent',
  };

  return (
    <span className={sizeClass} style={style} title={user.name}>
      {initials(user.name)}
    </span>
  );
}
