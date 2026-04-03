import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AddMatch } from './pages/AddMatch';
import { Players } from './pages/Players';
import { Stats } from './pages/Stats';
import { Matches } from './pages/Matches';
import { MatchDetail } from './pages/MatchDetail';
import { PlayerDetail } from './pages/PlayerDetail';
import { Venues } from './pages/Venues';
import { TeamPresets } from './pages/TeamPresets';
import { Settings } from './pages/Settings';
import { ImportData } from './pages/ImportData';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMatch />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/match/:id" element={<MatchDetail />} />
          <Route path="/match/:id/edit" element={<AddMatch />} />
          <Route path="/players" element={<Players />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/presets" element={<TeamPresets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/import" element={<ImportData />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
