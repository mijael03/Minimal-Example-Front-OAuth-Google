import React from "react";
import {
  GoogleLogin,
  CredentialResponse,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";

const App: React.FC = () => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/auth/google/",
          {
            access_token: tokenResponse.access_token, // El ID Token de Google
          }
        );

        console.log("Usuario autenticado:", response.data);
      } catch (error) {
        console.error("Error en el login:", error);
      }
    },
    onError: () => {
      console.error("Error al iniciar sesión con Google");
    },
  });
  // Manejar respuesta exitosa del login con Google
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const idToken = credentialResponse.credential; // ID Token de Google
    if (!idToken) {
      console.error("No se recibió ningún ID Token.");
      return;
    }

    console.log("ID Token:", idToken);

    try {
      // Enviar el ID Token al backend
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/google/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: idToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);

        // Almacenar tokens en localStorage
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);
      } else {
        console.error(
          "Error en el inicio de sesión con Google:",
          await response.json()
        );
      }
    } catch (error) {
      console.error("Error al enviar el ID Token al backend:", error);
    }
  };

  // Manejar errores en el login con Google
  const handleGoogleFailure = () => {
    console.error("Error al iniciar sesión con Google:");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Inicia sesión con Google</h1>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
      />
      <button
        onClick={() => handleGoogleLogin()}
        style={{
          backgroundColor: "#4285F4", // Color de Google
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#357AE8")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#4285F4")
        }
      >
        <img
          src="https://img.icons8.com/?size=512&id=17949&format=png"
          alt="Google logo"
          style={{ width: "20px", marginRight: "10px" }}
        />
        Inicia sesión con Google
      </button>
    </div>
  );
};

export default App;
