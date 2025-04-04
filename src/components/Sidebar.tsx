import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <aside className="w-64 h-screen bg-indigo-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Rick and Morty List</h1>
      <input
        type="text"
        placeholder="Search or filter results"
        className="w-full p-2 rounded-md text-black"
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Characters</h2>
        <ul>
          {data.characters.results.map((character: any) => (
            <li key={character.id} className="flex items-center gap-2 p-2">
              <img
                src={character.image}
                alt={character.name}
                className="w-10 h-10 rounded-full"
              />
              <Link to={`/character/${character.id}`} className="hover:underline">
                {character.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
