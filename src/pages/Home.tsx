import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  // Estados
  const [characterFilter, setCharacterFilter] = useState("All");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  // Alternar favoritos
  const toggleFavorite = (id: string) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  // Filtrar personajes
  const filteredCharacters = data.characters.results.filter((character: any) => {
    const isFavorite = favorites.includes(character.id);
    const matchesCharacter =
      characterFilter === "All" ||
      (characterFilter === "Starred" && isFavorite) ||
      (characterFilter === "Others" && !isFavorite);

    const matchesSpecies = speciesFilter === "All" || character.species === speciesFilter;

    return matchesCharacter && matchesSpecies;
  });

  // Ordenar personajes
  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
    if (sortOrder === "A-Z") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="text-center text-white">
      <h2 className="text-2xl mb-4">Selecciona un personaje</h2>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        <select
          value={characterFilter}
          onChange={(e) => setCharacterFilter(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded"
        >
          <option value="All">All Characters</option>
          <option value="Starred">Starred</option>
          <option value="Others">Others</option>
        </select>

        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded"
        >
          <option value="All">All Species</option>
          <option value="Human">Human</option>
          <option value="Alien">Alien</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded"
        >
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
        </select>
      </div>

      {/* Lista filtrada y ordenada */}
      <ul className="grid grid-cols-2 gap-4">
        {sortedCharacters.map((character: any) => (
          <li key={character.id} className="p-4 border rounded-lg">
            <Link to={`/character/${character.id}`} className="hover:underline">
              <img src={character.image} alt={character.name} className="w-20 h-20 rounded-full mx-auto" />
              <p className="mt-2">{character.name}</p>
            </Link>
            <button
              onClick={() => toggleFavorite(character.id)}
              className={`mt-2 px-4 py-1 rounded ${
                favorites.includes(character.id) ? "bg-yellow-500" : "bg-gray-600"
              }`}
            >
              {favorites.includes(character.id) ? "★ Starred" : "☆ Star"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
