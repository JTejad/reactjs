# Clase 12 — Autenticación de usuarios y rutas protegidas

## Objetivos
- Sistema de autenticación completo con **Firebase Authentication**
- **Contexto de autenticación** para manejar la sesión de forma global
- Componentes **Login** y **Registro** con comunicación asincrónica con Firebase
- **Rutas protegidas** para restringir secciones (por sesión y por rol)

## Temas

### Autenticación vs. Autorización
- **Autenticación** — verificar la identidad: *"¿Quién sos?"* (login con email y contraseña)
- **Autorización** — definir permisos de un usuario ya autenticado: *"¿Qué tenés permitido hacer?"* (ej. solo admins gestionan productos)

### Configuración en la consola de Firebase
1. **Compilación → Authentication → Comenzar** → habilitar el proveedor **Correo electrónico/contraseña**
2. Pestaña **Users → Add user** → crear un usuario de prueba (ej. `admin@gmail.com` / `admin1234`)

### Componente Login
```js
import { signInWithEmailAndPassword } from 'firebase/auth';

signInWithEmailAndPassword(auth, email, password)
  .then(userCredential => { /* userCredential.user */ navigate('/'); })
  .catch(error => { /* error.code, error.message */ });
```
- **`getAuth()`** — devuelve la instancia del servicio de autenticación (en el repo se exporta `auth` desde `firebase/config.js`)
- **`signInWithEmailAndPassword(auth, email, password)`** — inicia sesión; devuelve una promesa
- `.then()` si las credenciales son válidas, `.catch()` si no (usuario inexistente, contraseña incorrecta…)

### Autorización: sistema de roles
Firebase Auth solo guarda la identidad. El **rol** se guarda en Firestore:
- Colección **`usuarios`**
- Documento con **ID = UID del usuario** (se ve en la pestaña Authentication)
- Campo **`rol: "admin"`**
- Quien no tenga ese documento se trata como usuario estándar (`rol: 'user'`)

### `AuthContext`: estado de autenticación global
Igual que con el carrito, usamos **Context API**:
```jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const snap = await getDoc(doc(db, 'usuarios', currentUser.uid));
        const rol = snap.exists() && snap.data().rol === 'admin' ? 'admin' : 'user';
        setUser({ ...currentUser, rol });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe(); // limpiamos el oyente al desmontar
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```
- **`onAuthStateChanged`** — el "oyente" de Firebase: avisa cada vez que alguien inicia o cierra sesión (y al recargar, si la sesión seguía abierta)
- **`useAuth`** — el atajo para que cualquier componente acceda a `user`, `login`, `logout`, etc.
- **Flujo:** al cargar, `loading` es `true` → Firebase responde si hay alguien conectado → se guarda `user` (con rol) o `null` → `loading` pasa a `false` y se muestra la app

**Integración** en `main.jsx`:
```jsx
<BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
```
**Header dinámico:** si hay `user` → saludo + "Cerrar sesión" (+ "Gestión" solo si `user.rol === 'admin'`); si no → "Login".

### Registro (`Registro.jsx`)
- **`createUserWithEmailAndPassword(auth, email, password)`** — crea el usuario (y deja la sesión iniciada)
- `try...catch` porque es asincrónico
- Errores con códigos estandarizados: **`auth/email-already-in-use`** → `window.confirm` para ofrecer ir al login
- Ruta `/registro` en `App.jsx` y link desde el Login: `¿No tenés una cuenta? <Link to="/registro">Registrate aquí</Link>`

### Rutas protegidas
Ocultar el link de Gestión **no alcanza**: cualquiera puede escribir la URL a mano, y cualquier usuario logueado entraría.
```jsx
const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user || (rolesPermitidos && !rolesPermitidos.includes(user.rol))) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

<Route path="/gestion" element={
  <ProtectedRoute rolesPermitidos={['admin']}><Gestion /></ProtectedRoute>
} />
```
- Mientras `loading`, espera (si no, al recargar te mandaría al login antes de que Firebase responda)
- Sin usuario o sin el rol permitido → **`<Navigate to="/login" />`**
- Si pasa, renderiza `children`

> **Correcciones al PDF:**
> - En `ProtectedRoute` el PDF usa `rolesPermitidos` pero no lo recibe en las props → daría `ReferenceError`. Va `({ children, rolesPermitidos })`.
> - En el repo el `user` guarda solo `uid`, `email` y `rol` en vez de hacer spread del objeto de Firebase.
> - La ruta del PDF es `/alta`; en este repo el panel sigue en `/gestion`.
> - La protección del front es para la UX: la seguridad real va en las **reglas de Firestore** (que solo un admin pueda escribir en `Productos nacionales`).

## Ejercicio (Talento Lab): Perfil de usuario y cierre de sesión
→ `src/pages/Perfil/Perfil.jsx`
- Ruta **`/perfil`** protegida con `ProtectedRoute` (solo logueados)
- Lee el usuario desde `useAuth()` y muestra "¡Hola de nuevo, usuario@email.com!"
- `logout` en el `AuthContext` con `signOut(auth)` y botón "Cerrar sesión" (también en el Header)
- Bonus: después de cerrar sesión, redirige a `/`

## Archivos de la clase
- `src/firebase/config.js` — suma `export const auth = getAuth(app)`
- `src/context/AuthContext.jsx` — `AuthProvider`, `useAuth`, `signup`, `login`, `logout`, roles
- `src/componentes/Login/Login.jsx` y `Registro.jsx`
- `src/componentes/ProtectedRoute/ProtectedRoute.jsx` — protección por sesión y por rol
- `src/pages/Perfil/Perfil.jsx` — ejercicio
- `src/componentes/layout/Header.jsx` — links según sesión y rol
- `src/App.jsx` — rutas `/login`, `/registro`, `/perfil` y `/gestion` + `/admin/cupones` solo admin
- `src/main.jsx` — `AuthProvider` envolviendo la app

## Preguntas para reflexionar
- **Firebase Auth solo guarda email y contraseña, ¿qué otros datos podemos necesitar y dónde los guardamos?** Nombre, teléfono, dirección, foto, rol, historial de compras… Se guardan en una colección de Firestore (como `usuarios`) usando el **UID como id del documento**, así se vinculan con la cuenta. (Nombre y foto también se pueden poner con `updateProfile`.)
- **¿Cómo mantener el login en el navegador?** Firebase ya persiste la sesión solo (en IndexedDB/localStorage, `browserLocalPersistence` por defecto). Al recargar, `onAuthStateChanged` devuelve el usuario. Se puede cambiar con `setPersistence` (por ejemplo, solo por sesión de pestaña). No hace falta guardar el usuario a mano en `localStorage`.
- **¿Qué técnicas sumarías para errores y notificaciones?** Traducir los `error.code` de Firebase a mensajes claros, mostrar errores en el formulario en vez de `alert`, toasts (ej. **React Toastify**), estados de carga en los botones, y logs/monitoreo de errores (ej. Sentry).

## Próximos pasos
- Diseño y responsividad (React-Bootstrap, styled-components)
- UX con React Icons
- SEO con React Helmet
- Barra de búsqueda en tiempo real
