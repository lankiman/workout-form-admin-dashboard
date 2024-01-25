import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import handleKeyDown from "../utils/keyboardUtils";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const [tittle, setTittle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState<any | null>(null);
  const { dispatch } = useWorkoutsContext();
  const [emptyFields, setEmtpyFields] = useState<string[]>([]);
  const { user } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError("You Must be Logged in");
      return;
    }
    const workout = { tittle, load, reps };

    if (!tittle) {
      emptyFields.push("tittle");
    }
    if (!load) {
      emptyFields.push("load");
    }
    if (!reps) {
      emptyFields.push("reps");
    }

    if (emptyFields.length > 0 && (!reps || !tittle || !load)) {
      setEmtpyFields(emptyFields);
      setError("Please Fill in all the Fields");
      return;
    } else if (tittle && reps && load && emptyFields.length > 0) {
      setEmtpyFields([]);
      setError(null);
    }

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      } as HeadersInit,
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      setEmtpyFields(data.emptyFields);
    }
    if (response.ok) {
      setTittle("");
      setLoad("");
      setReps("");
      setError(null);
      setEmtpyFields([]);
      dispatch({ type: "CREATE_WORKOUT", payload: data });
    }
  };

  return (
    <form className="create" action="" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>
      <label> Exercise Tittle:</label>
      <input
        type="text"
        name="tittle"
        value={tittle}
        onChange={(e) => {
          setTittle(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={emptyFields.includes("tittle") ? "error" : ""}
      />

      <label>Load (in Kg): </label>
      <input
        type="number"
        value={load}
        name="load"
        onChange={(e) => {
          setLoad(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={emptyFields.includes("load") ? "error" : ""}
      />
      <label>Reps : </label>
      <input
        type="number"
        value={reps}
        name="reps"
        onChange={(e) => {
          setReps(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={emptyFields.includes("reps") ? "error" : ""}
      />
      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
