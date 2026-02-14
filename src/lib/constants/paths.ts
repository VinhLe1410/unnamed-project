export const paths = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  YOUR_POSTS: '/your-posts',
  YOUR_POSTS_NEW: '/your-posts/new',
};

export const protectedPaths = [paths.DASHBOARD, paths.YOUR_POSTS];
export const publicPaths = [paths.HOME];

const navItems = [
  { href: paths.HOME, label: 'Home' },
  { href: paths.DASHBOARD, label: 'Dashboard' },
  { href: paths.YOUR_POSTS, label: 'Your Posts' },
] as const;

export const publicNavItems = navItems.filter((item) => publicPaths.includes(item.href));
export const protectedNavItems = navItems.filter((item) => protectedPaths.includes(item.href));
