import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LayoutAdmin } from './shared/layouts/LayoutAdmin';
import { AdminRoutes, AdminAuthRoutes } from './shared/routes/index';
import { ToastContainer } from 'react-toastify';
import './shared/styles/index.css';

import ClientLayout from '../client/layouts/ClientLayout';
import Home from '../client/pages/Home';
import SinglePost from '../client/pages/SinglePost';
import DocsPage from '../client/pages/DocsPage';
import DocDetailPage from '../client/pages/DocDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:categorySlug" element={<DocDetailPage />} />
          <Route path="/docs/article/:articleSlug" element={<DocDetailPage />} />
          <Route path="/post/:slug" element={<SinglePost />} />
        </Route>

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
