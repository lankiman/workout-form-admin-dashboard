import { useEffect, useState } from "react";
import { Iusers } from "../interface";
import { formatDistanceToNow } from "date-fns";
import { Route, Routes, Link } from "react-router-dom";
import UserDetails from "./UserDetails";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any | []>(null);
  const [loading, setLoading] = useState(true);
  const [wloading, setWloading] = useState(true);
  const { user } = useAuthContext();
  const { workouts, dispatch } = useWorkoutsContext();
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.adminTk}`
          } as HeadersInit
        });

        const data = await response.json();
        if (response.status === 200) {
          if (data) {
            setUsers(data.filter((users: Iusers) => users.email != user.email));
            setLoading(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.log(error, "unable to fetch data");
      }
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, role: string) => {
    try {
      const response = await fetch("/api/admin/users/" + id, {
        method: "DELETE",
        body: JSON.stringify({ role }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.adminTk}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers((prevUsers: []) =>
          prevUsers.filter((user: Iusers) => user._id !== data._id)
        );
      }
      if (response.status == 401) {
        alert("Super user Authorization need to Delete Admin user");
      }
    } catch (error) {
      console.log({ error: error });
    }
  };
  const handleDetails = async (id: string) => {
    setWloading(true);
    try {
      const response = await fetch("/api/workouts/" + id, {
        headers: {
          Authorization: `Bearer ${user.token}`
        } as HeadersInit
      });

      const data = await response.json();
      if (response.ok) {
        dispatch({
          type: "SET_WORKOUTS",
          payload: data
        });
        setWloading(false);
      }
    } catch (error) {
      console.log({ error: error });
    }
  };

  return (
    <div className="h-screen">
      {loading && (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <p className="w-8 h-8 border-t-4 border-black rounded-full animate-spin"></p>
          <p className="text-2xl font-bold text-black animate-pulse">
            Please Wait....
          </p>
        </div>
      )}
      {!loading && !users && (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <p className="text-2xl font-bold text-black animate-pulse">
            Unable to Fetch Data, Refresh the Page to Try again
          </p>
        </div>
      )}
      {!loading && users && users.length == 0 && (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <p className="text-2xl font-bold text-black animate-pulse">
            No Available Users
          </p>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            users &&
            users.map((user: Iusers) => (
              <div key={user._id} className="workout-details">
                <h4>{user.email}</h4>
                <p>
                  <strong>USER ID: </strong>
                  {user._id}
                </p>
                <p>
                  <strong>ROLE: </strong>
                  {user.role}
                </p>
                <p>
                  <strong>Registered: </strong>
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true
                  })}
                </p>
                {user.role == "Basic" ? (
                  <button
                    className="del"
                    onClick={() => handleDelete(user._id, user.role)}
                  >
                    DELETE USER
                  </button>
                ) : (
                  ""
                )}
                {user.role == "Basic" ? (
                  <Link to="/details">
                    <button
                      onClick={() => {
                        handleDetails(user._id);
                      }}
                    >
                      USER DETAILS
                    </button>
                  </Link>
                ) : (
                  ""
                )}
              </div>
            ))
          }
        />
        <Route
          path="/details"
          element={<UserDetails wloading={wloading} workouts={workouts} />}
        />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
