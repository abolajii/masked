import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const UserValidationApp = () => {
  const [users, setUsers] = useState([
    { id: "1", name: "User 1", status: "pending" },
    { id: "2", name: "User 2", status: "pending" },
    { id: "3", name: "User 3", status: "pending" },
    { id: "4", name: "User 4", status: "pending" },
    { id: "5", name: "User 5", status: "pending" },
    { id: "6", name: "User 6", status: "pending" },
    { id: "7", name: "User 7", status: "pending" },
    { id: "8", name: "User 8", status: "pending" },
    { id: "9", name: "User 9", status: "pending" },
    { id: "10", name: "User 10", status: "pending" },
  ]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("userValidated", (result) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === result.id
            ? { ...user, status: result.isValid ? "valid" : "invalid" }
            : user
        )
      );
    });

    return () => newSocket.close();
  }, []);

  const startValidation = () => {
    if (socket) {
      socket.emit("validateUsers", users);

      setUsers((prevUsers) =>
        prevUsers.map((user) => ({ ...user, status: "validating" }))
      );
    }
  };

  return (
    <div>
      <h1>User Validation</h1>
      <button
        onClick={startValidation}
        disabled={users.some((u) => u.status === "validating")}
      >
        Validate Users
      </button>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            {user.name} - Status: {user.status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserValidationApp;
