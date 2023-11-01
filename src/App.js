// App.js - 최상위 컴포넌트
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from './component/NavBar';
import routes from './routes';
import Toast from './component/Toast';
import useToast from './hooks/toast';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';
import { login } from './store/authSlice';
import LoadingSpinner from './component/LoadingSpinner';

// 여러개의 state를 업데이트해도 컴포넌트는 한 번만 렌더링이 일어난다.
// react-router package를 통해 여러개의 페이지를 가질 수 있다.
// npm install react-router-dom

// toast를 최상위 컴포넌트 App.js에 넣어놓았기 때문에
// 페이지 이동을 하더라도 toast 메시지는 사라지지 않는다.

// addToast 함수는 DB에 데이터를 저장하고 성공시 toast를 추가해야하므로
// BlogForm.js에서 실행되어야 한다.
// App 컴포넌트에서 BlogForm 컴포넌트로 props를 이용해 addtoast함수 값을 넘겨줘야한다.

function App() {
  const toasts = useSelector(state => state.toast.toasts);
  const { deleteToast } = useToast();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      dispatch(login());
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <NavBar />
      <Toast 
        toasts={toasts}
        deleteToast={deleteToast}
      />
      <div className="container mt-3">
        <Routes>
          {routes.map((route) => {       
            return <Route 
              key={route.path} 
              path={route.path} 
              element={route.auth ? <ProtectedRoute
                element={route.element}
              /> : route.element} 
            />
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;