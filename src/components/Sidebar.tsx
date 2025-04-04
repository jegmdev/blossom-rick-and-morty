import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import { Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { loading, error, data } = useQuery(GET_CHARACTERS);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  if (loading) return <p className="text-black">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const allCharacters = data.characters.results;
  const starredCharacters = allCharacters.filter((char: any) =>
    favorites.includes(char.id)
  );
  const otherCharacters = allCharacters.filter(
    (char: any) => !favorites.includes(char.id)
  );

  const renderCharacterList = (list: any[]) =>
    list.map((character: any, index: number) => (
      <React.Fragment key={character.id}>
        <li className="flex items-center gap-2 p-2">
          <img
            src={character.image}
            alt={character.name}
            className="w-14 h-14 rounded-full"
          />
          <div>
            <Link
              to={`/character/${character.id}`}
              className="font-bold text-black hover:underline"
            >
              {character.name}
            </Link>
            <p>{character.species || "Desconocido"}</p>
          </div>
        </li>
        {index < list.length - 1 && (
          <hr className="border-gray-300 max-w-auto my-2" />
        )}
      </React.Fragment>
    ));

  return (
    <aside className="w-1/5 min-w-[20%] h-max bg-gray-100 p-4 px-[50px]">
      <h1 className="text-xl font-bold text-black mb-4">Rick and Morty List</h1>

      <input
        type="text"
        placeholder="Search or filter results"
        className="w-full p-2 rounded-md border border-gray-400 text-black"
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-black mb-2">
          Starred Characters ({starredCharacters.length})
        </h2>
        <ul>{renderCharacterList(starredCharacters)}</ul>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          Characters ({otherCharacters.length})
        </h2>
        <ul>{renderCharacterList(otherCharacters)}</ul>
      </div>
    </aside>
  );
};

export default Sidebar;
