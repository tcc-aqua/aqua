"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";


export default function ListaSensors(){
   const [sensores, setSensores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/sensores");

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta do backend:", data);

     
        setSensores(data.docs || []);
      } catch (err) {
        console.error("Erro ao buscar condomínios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSensores();
  }, []);
  if (loading) return <div>
    <Loading></Loading>
</div>
  if (error) return <p>Erro: {error}</p>;


    return(
 <section>
      {sensores.length === 0 ? (
        <p>Nenhum sensor encontrado.</p>
      ) : (
        <ul>
          {sensores.map((sensor) => (
            <li key={sensor.id}>
              <strong>{sensor.codigo}</strong> <br />
              <small>{sensor.status}</small>
            </li>
          ))}
        </ul>
      )}
    </section>

    )
}
