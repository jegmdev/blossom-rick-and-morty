import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CHARACTER } from "../graphql/queries";

const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CHARACTER, { variables: { id } });

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem(`comments-${id}`) || "[]");
    setComments(storedComments);
  }, [id]);

  const handleAddComment = () => {
    if (comment.trim() === "") return;
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    setComment("");
  };

  if (loading) return <p className="text-black">Cargando...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  if (!data || !data.character) {
    return <p className="text-red-500">No se encontró el personaje.</p>;
  }

  const character = data.character;

  return (
    <div className="bg-white text-black p-6 min-h-screen">
      <h2 className="text-3xl font-bold">{character?.name || "Desconocido"}</h2>
      <img
        src={character?.image || ""}
        alt={character?.name || "Desconocido"}
        className="w-40 h-40 rounded-full mx-auto my-4"
      />
      <p className="text-gray-500">Status: {character?.status || "Desconocido"}</p>
      <p className="text-gray-500">Species: {character?.species || "Desconocido"}</p>
      <p className="text-gray-500">Origin: {character?.origin?.name || "Desconocido"}</p>

      {/* Sección de comentarios */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-black mb-2">Comentarios</h3>
        <div className="mb-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-2 bg-gray-200 text-black rounded w-full"
            placeholder="Escribe un comentario..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-1 bg-blue-500 rounded hover:bg-blue-600 text-white"
          >
            Agregar Comentario
          </button>
        </div>

        <ul className="mt-2 space-y-2">
          {comments.length > 0 ? (
            comments.map((cmt, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded text-black">
                {cmt}
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
