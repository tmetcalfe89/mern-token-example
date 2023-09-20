import { useCallback, useEffect, useState } from "react";
import Input from "./components/Input";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenTestData, setTokenTestData] = useState(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const response = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert("Invalid credentials");
      }

      setToken(await response.text());
    },
    [password, username]
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const handleTest = useCallback(async () => {
    const response = await fetch("/api/users", {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      alert("Invalid token");
    }

    setTokenTestData(await response.json());
  }, [token]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input label="Username" value={username} onChange={setUsername} />
        <Input label="Password" value={password} onChange={setPassword} />
        <button>Submit</button>
      </form>
      <div>
        <button onClick={handleTest}>Test Token</button>
        {tokenTestData && <pre>{JSON.stringify(tokenTestData, null, 2)}</pre>}
      </div>
    </>
  );
}

export default App;
