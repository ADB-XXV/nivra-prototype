import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Hero from './components/hero';
import StdDashb from './components/std_dashb';
import EmpDashb from './components/emp_dashb';
import CreateGig from './components/createGig';
import GigFeed from './components/gigFeed';
import GigApp from './components/gigApp';
import Payout from './components/payout';
import Rating from './components/rating';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
        <NavLink to="/student" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Student Profile</NavLink>
        <NavLink to="/employer" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Employer Dashboard</NavLink>
        <NavLink to="/create-gig" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Create Gig</NavLink>
        <NavLink to="/feed" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Gig Feed</NavLink>
        <NavLink to="/applications" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Applications</NavLink>
        <NavLink to="/payouts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Payouts</NavLink>
        <NavLink to="/ratings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Ratings</NavLink>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/student" element={<StdDashb />} />
          <Route path="/employer" element={<EmpDashb />} />
          <Route path="/create-gig" element={<CreateGig />} />
          <Route path="/feed" element={<GigFeed />} />
          <Route path="/applications" element={<GigApp />} />
          <Route path="/payouts" element={<Payout />} />
          <Route path="/ratings" element={<Rating />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}