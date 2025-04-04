import { Routes, Route } from "react-router-dom";
import CharacterDetail from "./pages/CharacterDetail";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar con ancho del 20-25% */}
      <Sidebar className="w-1/5 min-w-[250px] bg-indigo-900 text-white p-4" />

      {/* Contenido principal ocupando el resto del espacio */}
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
