import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
// TeamSetup route removed (team UI disabled)
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Game',
    path: '/game/:roomId',
    element: <GamePage />
  }
  // Team setup route removed
];

export default routes;
