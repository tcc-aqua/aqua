"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";

export default function ListaUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/users");

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta do backend:", data);

     
        setUsers(data.docs || []);
      } catch (err) {
        console.error("Erro ao buscar condomínios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>
    <Loading></Loading>
</div>
  if (error) return <p>Erro: {error}</p>;

  return (
    <section>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
