import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CHARACTER } from "../graphql/queries";
import { FaHeart, FaTrash } from "react-icons/fa";

const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: { id },
  });

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const storedComments = JSON.parse(
      localStorage.getItem(`comments-${id}`) || "[]"
    );
    setComments(storedComments);

    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setIsStarred(storedFavorites.includes(id));
  }, [id]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "favorites") {
        const updatedFavorites = JSON.parse(e.newValue || "[]");
        setIsStarred(updatedFavorites.includes(id));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [id]);

  const toggleStarred = () => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    let updatedFavorites;

    if (storedFavorites.includes(id)) {
      updatedFavorites = storedFavorites.filter(
        (favId: string) => favId !== id
      );
    } else {
      updatedFavorites = [...storedFavorites, id];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsStarred(updatedFavorites.includes(id));
    window.location.reload();
  };

  const handleAddComment = () => {
    if (comment.trim() === "") return;
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    setComment("");
  };

  const handleDeleteComment = (indexToDelete: number) => {
    const updatedComments = comments.filter((_, index) => index !== indexToDelete);
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
  };

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data || !data.character)
    return <p className="text-red-500">No se encontró el personaje.</p>;

  const character = data.character;

  return (
    <div className="bg-white text-black p-6 px-[200px] rounded-lg max-w-auto mx-auto">
      <div className="flex flex-col relative">
        <img
          src={character.image}
          alt={character.name}
          className="w-20 h-20 rounded-full"
        />
        <h2 className="text-2xl font-bold mt-3">
          {character.name || "Desconocido"}
        </h2>
        <button
          onClick={toggleStarred}
          className="bg-white rounded-full p-2 absolute left-12 bottom-10 shadow-md transition-transform active:scale-90"
        >
          <FaHeart
            className={`text-lg ${
              isStarred ? "text-green-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="mt-6 w-full">
        <div className="py-2">
          <p className="font-bold">Specie:</p>
          <p>{character.species || "Desconocido"}</p>
        </div>
        <hr className="border-gray-300" />
        <div className="py-2">
          <p className="font-bold">Status:</p>
          <p>{character.status || "Desconocido"}</p>
        </div>
        <hr className="border-gray-300" />
        <div className="py-2">
          <p className="font-bold">Gender:</p>
          <p>{character.gender || "Desconocido"}</p>
        </div>
      </div>

      <div className="mt-6 w-[50%]">
        <h3 className="text-xl font-semibold">Comentarios</h3>
        <div className="mb-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-2 bg-gray-200 rounded w-full"
            placeholder="Escribe un comentario..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-1 bg-[#8054c7] text-white rounded hover:bg-[#5a3696] w-full"
          >
            Agregar Comentario
          </button>
        </div>

        <ul className="mt-2 space-y-2">
          {comments.length > 0 ? (
            comments.map((cmt, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded flex justify-between items-center"
              >
                <span>{cmt}</span>
                <button
                  onClick={() => handleDeleteComment(index)}
                  className="text-red-500 hover:text-red-700 ml-4"
                  title="Eliminar comentario"
                >
                  <FaTrash />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">Aún no hay comentarios.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CharacterDetail;
