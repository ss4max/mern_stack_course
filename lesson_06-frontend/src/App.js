import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import RoomsList from './features/rooms/RoomsList'
import ReservationsList from './features/reservations/ReservationsList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>

          <Route index element={<Welcome />} />

          <Route path="rooms">
            <Route index element={<RoomsList />} />
          </Route>

          <Route path="reservations">
            <Route index element={<ReservationsList />} />
          </Route>

        </Route>{/* End Dash */}

      </Route>
    </Routes>
  );
}

export default App;
