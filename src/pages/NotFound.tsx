import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary px-3 sm:px-4">
      <div className="text-center space-y-4 sm:space-y-6">
        <h1 className="text-6xl sm:text-8xl font-bold text-foreground">404</h1>
        <p className="text-lg sm:text-xl text-foreground/80">¡Oops! Página no encontrada</p>
        <a 
          href="/" 
          className="inline-block text-primary hover:text-primary/80 underline text-sm sm:text-base font-medium transition-colors"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
