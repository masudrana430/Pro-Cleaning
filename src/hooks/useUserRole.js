import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const API = "https://b12-a10-copy-server.vercel.app";

export default function useUserRole() {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        if (!user) {
          if (alive) {
            setRole("user");
            setLoading(false);
          }
          return;
        }

        const token = user.getIdToken
          ? await user.getIdToken()
          : user.accessToken || user?.stsTokenManager?.accessToken;

        // If you don’t have this endpoint, just keep role="user"
        const res = await fetch(`${API}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token ?? ""}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const serverRole = data?.role || data?.result?.role;
          if (alive && serverRole) setRole(serverRole);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user]);

  return { role, loading };
}
