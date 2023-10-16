import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import NavBar from './component/NavBar';
import routes from './routes';

// 여러개의 state를 업데이트해도 컴포넌트는 한 번만 렌더링이 일어난다.
// react-router package를 통해 여러개의 페이지를 가질 수 있다.
// npm install react-router-dom

function App() {
  return (
    <Router>
      <NavBar/>
      <div className="container mt-3">
        <Routes>
          {routes.map((route) => {
            return <Route key={route.path} path={route.path} component={route.component} />;
          })}
          {/* {[<Route path="/"><HomePage/></Route>,
          <Route path="/blogs"><ListPage/></Route>,
          <Route path="/blogs/create"><CreatePage /></Route>,
          <Route path="/blogs/edit"><EditPage/></Route>]} */}
        </Routes>
        </div>
    </Router>
  );
}

export default App; 