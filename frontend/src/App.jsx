import { useEffect } from "react";
import api from "./api/axios";

function App() {

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {

      const response = await api.get("/");

      console.log("SERVER RESPONSE:");
      console.log(response.data);

    } catch (error) {

      console.error("CONNECTION ERROR:");
      console.error(error);

    }
  };

  return (
      <div>
        <h1>Gate Manager Frontend</h1>
        <p>Check console</p>
      </div>
  );
}

export default App;