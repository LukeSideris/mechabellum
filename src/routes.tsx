import App from './App.tsx';
import CombatCalculatorPage from './combatCalculator/CombatCalculator.tsx';
import AboutPage from './about/About.tsx';
import ErrorPage from './errorPage/routeError.tsx';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <CombatCalculatorPage />,
      },
      {
        path: 'about/',
        element: <AboutPage />,
      },
    ],
  },
];

export default routes;
