import { Routes, Route } from "react-router-dom";
import CharacterDetail from "./pages/CharacterDetail";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className="flex">
      <main className="flex-1 p-4 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
