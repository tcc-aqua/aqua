"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";

export default function ListaCondominios() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/condominios");

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta do backend:", data);

     
        setCondominios(data.docs || []);
      } catch (err) {
        console.error("Erro ao buscar condomínios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCondominios();
  }, []);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  if (error) return <p>Erro: {error}</p>;

  return (
    <section>
      {condominios.length === 0 ? (
        <p>Nenhum condomínio encontrado.</p>
      ) : (
        <ul>
          {condominios.map((condominio) => (
            <li key={condominio.id}>
              <strong>{condominio.name}</strong> <br />

                    <small>{condominio.criado_em}</small>
                    <small>{condominio.atualizado_em}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
