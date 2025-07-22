import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

function AdminLayout() {
  return (
    <div className="flex  h-screen">
      <div className="flex flex-1">

        <AdminSideBar />
        <div className="flex-1 p-6 bg-slate-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;