import './sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '~/context/darkModeContext';
import { useContext } from 'react';

function Sidebar() {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="logo">AminKTX</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Trang Chủ</p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">Sinh Viên</p>
          <Link to="/admin/students" style={{ textDecoration: 'none' }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Danh Sách Sinh Viên</span>
            </li>
          </Link>
          <li>
            <DashboardIcon className="icon" />
            <span>Cơ sở vật chất</span>
          </li>
          <p className="title">Nhân Viên</p>
          <Link to="/admin/staffs" style={{ textDecoration: 'none' }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Danh Sách Nhân Viên</span>
            </li>
          </Link>

          <p className="title">Tài Khoản Nhân Viên</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Quản Lý Tài Khoản</span>
          </li>
          <li>
            <DashboardIcon className="icon" />
            <span>Phân Quyền</span>
          </li>

          <p className="title">Chế độ nền</p>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption" onClick={() => dispatch({ type: 'LIGHT' })}></div>
        <div className="colorOption" onClick={() => dispatch({ type: 'DARK' })}></div>
      </div>
    </div>
  );
}

export default Sidebar;