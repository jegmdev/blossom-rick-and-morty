import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CHARACTERS);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && data) {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const allCharacters = data.characters.results;

      // Buscar el primer personaje favorito
      const firstFavorite = allCharacters.find((char: any) =>
        storedFavorites.includes(char.id)
      );

      if (firstFavorite) {
        navigate(`/character/${firstFavorite.id}`);
      } else {
        // Si no hay favoritos, usar el personaje con id "1" como fallback
        const fallbackCharacter = allCharacters.find((char: any) => char.id === "1");
        if (fallbackCharacter) {
          navigate(`/character/1`);
        }
      }
    }
  }, [loading, data, navigate]);

  if (loading) return <p className="text-black">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return null; // No mostramos nada, redirige automáticamente
};

export default Home;
