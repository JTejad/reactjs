import { createContext, useState, useContext, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// 1. Crear el contexto
export const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// 2. Proveedor: guarda el usuario (con su rol) y expone las funciones de sesión
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  useEffect(() => {
    // Oyente de Firebase: se dispara al iniciar/cerrar sesión y al recargar la página
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Buscamos el rol en la colección "usuarios" (id del documento = uid)
        let rol = 'user';
        try {
          const userDocSnap = await getDoc(doc(db, 'usuarios', currentUser.uid));
          if (userDocSnap.exists() && userDocSnap.data().rol === 'admin') rol = 'admin';
        } catch (error) {
          console.error('No se pudo leer el rol del usuario:', error);
        }
        setUser({ uid: currentUser.uid, email: currentUser.email, rol });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Limpiamos el oyente al desmontar
    return () => unsubscribe();
  }, []);

  const value = { user, loading, signup, login, logout };

  // No renderizamos la app hasta saber si hay sesión (evita parpadeos y redirecciones falsas)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
