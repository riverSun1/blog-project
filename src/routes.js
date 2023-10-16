import HomePage from './pages/HomePage';
import EditPage from './pages/EditPage';
import ListPage from './pages/ListPage';
import CreatePage from './pages/CreatePage';
import ShowPage from './pages/ShowPage';

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
      path: '/blogs/create',
      component: CreatePage
    },
    {
      path: '/blogs/:id',
      component: ShowPage
    },
    {
      path: '/blogs/:id/edit',
      component: EditPage
    }
];

export default routes;