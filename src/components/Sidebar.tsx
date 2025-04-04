import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaSlidersH, FaHeart, FaBars } from "react-icons/fa";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { loading, error, data } = useQuery(GET_CHARACTERS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [characterFilter, setCharacterFilter] = useState("All");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const location = useLocation();
  const selectedCharacterId = location.pathname.includes("/character/")
    ? location.pathname.split("/character/")[1]
    : null;

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "favorites") {
        const newFavorites = JSON.parse(e.newValue || "[]");
        setFavorites(newFavorites);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleFavorite = (id: string) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(id)) {
      updatedFavorites = updatedFavorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites.push(id);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    window.location.reload();
  };

  if (loading) return <p className="text-black">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const allCharacters = data.characters.results;

  const filteredCharacters = allCharacters.filter((character: any) => {
    const isFavorite = favorites.includes(character.id);
    const matchesCharacter =
      characterFilter === "All" ||
      (characterFilter === "Starred" && isFavorite) ||
      (characterFilter === "Others" && !isFavorite);

    const matchesSpecies = speciesFilter === "All" || character.species === speciesFilter;

    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCharacter && matchesSpecies && matchesSearch;
  });

  const sortedCharacters = [...filteredCharacters].sort((a, b) =>
    sortOrder === "A-Z" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const starredCharacters = sortedCharacters.filter((char: any) =>
    favorites.includes(char.id)
  );
  const otherCharacters = sortedCharacters.filter(
    (char: any) => !favorites.includes(char.id)
  );

  const renderCharacter = (character: any) => (
    <li
      key={character.id}
      className={`flex items-center gap-2 p-2 rounded-md ${selectedCharacterId === character.id ? "p-4 bg-purple-200" : ""}`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="w-14 h-14 rounded-full"
      />
      <div className="flex-1">
        <Link
          to={`/character/${character.id}`}
          className="font-bold text-black hover:underline"
        >
          {character.name}
        </Link>
        <p>{character.species || "Unknown"}</p>
      </div>
      <button
        onClick={() => toggleFavorite(character.id)}
        className="bg-white rounded-full p-1"
      >
        <FaHeart
          className={`text-lg ${favorites.includes(character.id) ? "text-green-500" : "text-gray-400"}`}
        />
      </button>
    </li>
  );

  return (
    <>
      {!isMobileSidebarOpen && (
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        >
          <FaBars className="text-black" />
        </button>
      )}

      <aside
        className={`md:w-1/5 w-full md:min-w-[20%] bg-gray-50 p-4 px-[20px] fixed md:static top-0 left-0 h-full md:h-auto overflow-y-auto z-40 transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ scrollbarWidth: "none" }}
      >
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-black font-bold p-2"
          >
            Close
          </button>
        </div>

        <h1 className="text-xl font-bold text-black mb-4">Rick and Morty List</h1>

        <div className="relative flex items-center mb-4">
          <input
            type="text"
            placeholder="Search or filter results"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-[40px] w-full p-4 pr-10 rounded-md border bg-gray-100 text-black"
          />
          <FaSearch className="absolute left-3 text-gray-500" />
          <button
            className={`absolute right-3 transition ${showFilters ? "text-black" : "text-gray-500 hover:text-black"}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaSlidersH />
          </button>
        </div>

        {showFilters && (
          <div className="relative z-40 w-full bg-white shadow-lg rounded-lg p-4 mb-4">
            <h3 className="text-black font-bold">Character</h3>
            <div className="flex gap-2 my-2">
              {['All', 'Starred', 'Others'].map((filter) => (
                <button
                  key={filter}
                  className={`border border-gray-300 flex-1 px-4 py-2 rounded text-black ${characterFilter === filter ? 'bg-purple-200' : 'bg-white'}`}
                  onClick={() => setCharacterFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <h3 className="text-black font-bold">Specie</h3>
            <div className="flex gap-2 my-2">
              {['All', 'Human', 'Alien'].map((filter) => (
                <button
                  key={filter}
                  className={`border border-gray-300 flex-1 px-4 py-2 rounded text-black ${speciesFilter === filter ? 'bg-purple-200' : 'bg-white'}`}
                  onClick={() => setSpeciesFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              className={`w-full mt-4 p-2 rounded transition-colors ${showFilters
                ? "bg-[#8054c7] text-white hover:bg-[#5a3696]"
                : "bg-gray-100 hover:bg-[#5a3696] hover:text-white"}`}
              onClick={() => setShowFilters(false)}
            >
              Filter
            </button>
          </div>
        )}

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-black mb-2">
            Starred Characters ({starredCharacters.length})
          </h2>
          <ul className="space-y-2">
            {starredCharacters.map((character) => renderCharacter(character))}
          </ul>

          <h2 className="text-lg font-semibold text-black mt-6 mb-2">
            Characters ({otherCharacters.length})
          </h2>
          <ul className="space-y-2">
            {otherCharacters.map((character, index) => (
              <React.Fragment key={character.id}>
                {renderCharacter(character)}
                {index < otherCharacters.length - 1 && <hr className="border-t border-gray-300" />}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </aside>

      <style>
        {`
          @media (min-width: 768px) {
            aside::-webkit-scrollbar {
              display: none;
            }
            aside {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;
