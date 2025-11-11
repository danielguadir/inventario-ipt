import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import LoginPage from '../pages/LoginPage'
import ReportarEquipoPage from '../pages/ReportarEquipoPage'
import StandPage from '../pages/StandPage'
import MisSolicitudesPage from '../pages/MisSolicitudesPage'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function MainLayout(){
  return (
    <div className="app">
      <Sidebar/>
      <div>
        <Topbar/>
        <div className="panel">
          <Routes>
            <Route path="reportar" element={<ReportarEquipoPage/>}/>
            <Route path="stand" element={<StandPage/>}/>
            <Route path="mis" element={<MisSolicitudesPage/>}/>
            <Route path="*" element={<Navigate to="reportar" replace/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function AppRouter(){
  return (
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/app/*" element={
        <PrivateRoute><MainLayout/></PrivateRoute>
      }/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}
