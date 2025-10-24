"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";


export default function ListaSensors(){
   const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
useEffect(() =>{

    fetch("http://localhost:3333/api/sensor")
    .then((response) =>{
        if (!response.ok) throw new Error("Erro na requisição")
            return response.json()
    })
        .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>
    <Loading></Loading>
</div>
  if (error) return <p>Erro: {error}</p>;


    return(
          <section>
      {users.length === 0 ? (
        <p>Nenhum Sensor encontrado.</p>
      ) : (
        <ul>
          {sensor.map((sensor) => (
            <li key={sensor.id}>
              {sensor} 
            </li>
          ))}
        </ul>
      )}
    </section>

    )
}
