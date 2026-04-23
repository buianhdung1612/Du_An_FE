import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LayoutAdmin } from './shared/layouts/LayoutAdmin';
import { AdminRoutes, AdminAuthRoutes } from './shared/routes/index';
import { ToastContainer } from 'react-toastify';
import './shared/styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect Root to Admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin Routes */}
        <Route path='/admin'>
          {AdminAuthRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route element={<LayoutAdmin />}>
            {AdminRoutes.map(({ path, element, index }: any) => (
              <Route key={path || "index"} path={path} index={index} element={element} />
            ))}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  )
}

export default App
