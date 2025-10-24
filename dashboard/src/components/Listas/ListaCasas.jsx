"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";


export default function ListaCasas(){
   const [casas, setCasas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

 useEffect(() => {
    const fetchCasas = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/casas");

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta do backend:", data);

     
        setCasas(data.docs || []);
      } catch (err) {
        console.error("Erro ao buscar condomínios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCasas();
  }, []);

  if (loading) return <div>
    <Loading></Loading>
</div>
  if (error) return <p>Erro: {error}</p>;


    return(
          <section>
      {casas.length === 0 ? (
        <p>Nenhuma casa encontrado.</p>
      ) : (
        <ul>
          {casas.map((casa) => (
            <li key={casa.id}>
              {casa.logradouro} 
            </li>
          ))}
        </ul>
      )}
    </section>

    )
}
