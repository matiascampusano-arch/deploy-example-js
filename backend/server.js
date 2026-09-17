// API de autenticación de práctica — Sprint 15, Webinar 1
//
// Implementa exactamente el flujo de tres peticiones que se explica en el webinar:
//   1) POST /signup  -> crea la cuenta (sin token todavía)
//   2) POST /signin  -> valida credenciales y devuelve un token (JWT)
//   3) GET  /users/me -> devuelve el usuario dueño del token (va en el header Authorization)
//
// Es intencionalmente simple (usuarios en memoria, sin base de datos) para que el foco
// de la actividad esté en el front end. Al reiniciar el servidor se pierden las cuentas creadas.

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
// En un proyecto real esto vive en una variable de entorno (.env), nunca en el código.
const JWT_SECRET =
  process.env.JWT_SECRET || "clave-de-practica-no-usar-en-produccion";

const app = express();
app.use(express.json());

// --- CORS ---------------------------------------------------------------
// Igual que en el webinar: el servidor declara explícitamente en qué origen confía.
// Si conectás el front end desde otro puerto, cambiá FRONTEND_ORIGIN al arrancar el server.
app.use(cors({ origin: FRONTEND_ORIGIN }));

// --- "Base de datos" en memoria ------------------------------------------
/** @type {{ _id: string, email: string, passwordHash: string }[]} */
const users = [];
let nextId = 1;

function findUserByEmail(email) {
  return users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase(),
  );
}

function toPublicUser(user) {
  return { _id: user._id, email: user.email };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message:
        "Falta el token de autorización (Authorization: Bearer <token>).",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o vencido." });
  }
}

// --- 1) Registro ----------------------------------------------------------
app.post("/signup", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email y password son obligatorios." });
  }
  if (findUserByEmail(email)) {
    return res
      .status(409)
      .json({ message: "Ya existe una cuenta con ese email." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  console.log({
    email,
    password,
    passwordHash,
  });
  const user = { _id: String(nextId++), email, passwordHash };
  users.push(user);

  // Ojo: acá NO se devuelve token — recién se creó la cuenta.
  return res.status(201).json({ user: toPublicUser(user) });
});

// --- 2) Inicio de sesión ----------------------------------------------------
app.post("/signin", async (req, res) => {
  const { email, password } = req.body || {};
  const user = findUserByEmail(email || "");

  if (!user) {
    return res.status(401).json({ message: "Email o contraseña incorrectos." });
  }
  const passwordMatches = await bcrypt.compare(
    password || "",
    user.passwordHash,
  );

  if (!passwordMatches) {
    return res.status(401).json({ message: "Email o contraseña incorrectos." });
  }

  const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: "7d" });
  console.log({
    token,
  });
  return res.status(200).json({ token });
});

// --- 3) ¿Quién soy? ---------------------------------------------------------
app.get("/users/me", authMiddleware, (req, res) => {
  const user = users.find((u) => u._id === req.userId);
  if (!user) {
    return res
      .status(404)
      .json({ message: "El usuario dueño de este token ya no existe." });
  }
  return res.status(200).json(toPublicUser(user));
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "API de autenticación de práctica — Sprint 15",
  });
});

app.listen(PORT, () => {
  console.log(
    `API de autenticación de práctica escuchando en http://localhost:${PORT}`,
  );
  console.log(`CORS habilitado para: ${FRONTEND_ORIGIN}`);
});
