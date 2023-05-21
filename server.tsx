import { serve } from "https://deno.land/x/servest/mod.ts";
import React from "https://cdn.skypack.dev/react?min";
import ReactDOMServer from "https://cdn.skypack.dev/react-dom/server?min";

const app = serve({ port: 8080 });

const colors = [];

const server = async () => {
  for await (const request of app) {
    if (request.method === "GET" && request.url === "/") {
      // Renderizar el formulario
      const html = ReactDOMServer.renderToString(
        <html>
          <head>
            <style>{`body { background-color: black; }`}</style>
          </head>
          <body>
            <h1>Agregar un color</h1>
            <form method="POST">
              <input type="text" name="color" placeholder="Ingrese un color en inglés" />
              <button type="submit">Agregar</button>
            </form>
            <h2>Lista de colores:</h2>
            <ul>
              {colors.map((color, index) => (
                <li key={index} style={{ color }}>{color}</li>
              ))}
            </ul>
          </body>
        </html>
      );

      request.respond({
        status: 200,
        body: html,
        headers: new Headers({ "Content-Type": "text/html" }),
      });
    } else if (request.method === "POST" && request.url === "/") {
      // Procesar el formulario y agregar el color al array
      const formData = await request.formData();
      const color = formData.get("color");
      if (color) {
        colors.push(color);
      }

      // Redirigir a la ruta raíz después de procesar el formulario
      request.respond({
        status: 303,
        headers: new Headers({ "Location": "/" }),
      });
    }
  }
};

console.log("Servidor escuchando en http://localhost:8080/");
await server();