import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './i18n/LanguageProvider';
import { Toaster } from '@/components/ui/sonner';
import TabShell from './layouts/TabShell';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPoliciesPage from './pages/CategoryPoliciesPage';
import PolicyDetailPage from './pages/PolicyDetailPage';
import ComparePage from './pages/ComparePage';
import CompareDetailPage from './pages/CompareDetailPage';
import RewardsPage from './pages/RewardsPage';
import SupportPage from './pages/SupportPage';
import LeadFormPage from './pages/LeadFormPage';
import MyLeadsPage from './pages/MyLeadsPage';
import NotificationsPage from './pages/NotificationsPage';
import MySupportRequestsPage from './pages/MySupportRequestsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: TabShell,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories',
  component: CategoriesPage,
});

const categoryPoliciesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories/$categoryId',
  component: CategoryPoliciesPage,
});

const policyDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/policy/$policyId',
  component: PolicyDetailPage,
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: ComparePage,
});

const compareDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare/detail',
  component: CompareDetailPage,
});

const rewardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rewards',
  component: RewardsPage,
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: SupportPage,
});

const leadFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lead/$policyId',
  component: LeadFormPage,
});

const myLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-leads',
  component: MyLeadsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const mySupportRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-support-requests',
  component: MySupportRequestsPage,
});

const disclaimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/disclaimer',
  component: DisclaimerPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  categoriesRoute,
  categoryPoliciesRoute,
  policyDetailRoute,
  compareRoute,
  compareDetailRoute,
  rewardsRoute,
  supportRoute,
  leadFormRoute,
  myLeadsRoute,
  notificationsRoute,
  mySupportRequestsRoute,
  disclaimerRoute,
]);

const router = createRouter({ routeTree, defaultPreload: 'intent' });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <RouterProvider router={router} />
        <ProfileSetupModal />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
