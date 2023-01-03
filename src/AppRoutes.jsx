import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import AuthLayout from './layout/AuthLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UpdateProfilePage from './pages/UpdateProfile';


function RequireAuth({ children }) {
    const { currentUser } = useContext(AuthContext);

    const location = useLocation();

    if (!currentUser) return <Navigate to='/login'></Navigate>;

    if (location.pathname !== '/update-profile' && !currentUser.displayName && !currentUser.photoURL) {
        return <Navigate to='/update-profile' />;
    }

    return children;
}

function NoRequireAuth({ children }) {
    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Navigate to='/'></Navigate>
    }
    else {
        return children;
    }
}

const AppRoutes = () => {
    // Khai báo một biến context (tên gì cũng được)
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<RequireAuth>
                    <HomePage />
                </RequireAuth>} />
                <Route element={<AuthLayout />}>
                    <Route path='/login' element={<NoRequireAuth>
                        <LoginPage />
                    </NoRequireAuth>} />
                    <Route path='/register' element={<NoRequireAuth>
                        <RegisterPage />
                    </NoRequireAuth>} />
                </Route>
                <Route path='update-profile' element={
                    <RequireAuth>
                        <UpdateProfilePage />
                    </RequireAuth>
                } />
            </Routes>
        </BrowserRouter>)
}

export default AppRoutes;