import HomePage from './pages/HomePage';
import EditPage from './pages/EditPage';
import ListPage from './pages/ListPage';
import CreatePage from './pages/CreatePage';
import ShowPage from './pages/ShowPage';
import AdminPage from './pages/AdminPage';

const routes = [
    {
      path: '/',
      component: HomePage
    },
    {
      path: '/blogs',
      component: ListPage
    },
    {
      path: '/admin',
      component: AdminPage,
      auth: true
    },
    {
      path: '/blogs/create',
      component: CreatePage,
      auth: true
    },
    {
      path: '/blogs/:id',
      component: ShowPage
    },
    {
      path: '/blogs/:id/edit',
      component: EditPage,
      auth: true
    }
];

export default routes;