import React, { useState, useEffect } from "react";

const Home = () => {
  const [tareas, setTareas] = useState([]); // Estado para las tareas
  const [valorInput, setValorInput] = useState(""); // Estado para el valor del input

  // Obtener lista de tareas del servidor
  const getListaTareas = () => {
    fetch("https://playground.4geeks.com/todo/users/Brenes93", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => {
        if (response.status === 404) {
          console.warn("Usuario no encontrado. Creando usuario...");
          return crearUsuario(); // Crear usuario si no existe
        }
        if (!response.ok) {
          throw new Error(`Error al obtener tareas: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        if (Array.isArray(result.todos)) {
          setTareas(result.todos); // Actualiza el estado con las tareas obtenidas
        } else {
          setTareas([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener las tareas:", error);
      });
  };

  // Crear usuario si no existe
  const crearUsuario = () => {
    fetch("https://playground.4geeks.com/todo/users/Brenes93", {
      method: "POST",
      redirect: "follow",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Usuario creado con éxito.");
          getListaTareas(); // Obtener tareas después de crear el usuario
        } else {
          console.error("Error al crear el usuario:", response.statusText);
        }
      })
      .catch((error) => console.error("Error al crear el usuario:", error));
  };

  // Ejecutar cuando el componente se monta
  useEffect(() => {
    getListaTareas();
  }, []);

  // Agregar una nueva tarea
  const agregarTarea = (e) => {
    if (e.key === "Enter" && valorInput.trim() !== "") {
      const nuevaTarea = {
        label: valorInput,
        is_done: false,
      };
  
      fetch("https://playground.4geeks.com/todo/todos/Brenes93", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaTarea),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al agregar la tarea.");
          }
          return response.json(); // Obtén la tarea creada desde el servidor
        })
        .then((result) => {
          console.log("Tarea agregada:", result);
          setTareas([...tareas, result]); // Usa la tarea con el ID generado por el servidor
          setValorInput(""); // Limpia el input
        })
        .catch((error) => {
          console.error("Error al agregar la tarea:", error);
        });
    }
  };

  // Eliminar una tarea
  const eliminarTarea = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
      redirect: "follow",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar la tarea.");
        }
        return response.text(); // Devuelve el texto de la respuesta
      })
      .then((result) => {
        console.log("Resultado del servidor:", result);
        // Actualiza el estado eliminando la tarea localmente
        setTareas(tareas.filter((tarea) => tarea.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar la tarea:", error);
      });
  };

  return (
    <div className="text-center">
      <h2>Tareas</h2>
      <input
        type="text"
        className="entrada-tarea"
        placeholder="¿Qué necesitas hacer?"
        value={valorInput}
        onChange={(e) => setValorInput(e.target.value)}
        onKeyDown={agregarTarea}
      />
      <ul className="lista-tareas">
        {tareas.length === 0 ? (
          <li className="sin-tareas">No hay tareas, añade una</li>
        ) : (
          tareas.map((tarea) => (
            <li key={tarea.id}>
              {tarea.label}
              <button
                className="boton-eliminar"
                onClick={() => eliminarTarea(tarea.id)}
              >
                x
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="contador-tareas">
        {tareas.length} tarea{tareas.length !== 1 ? "s" : ""} restante
        {tareas.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default Home;
