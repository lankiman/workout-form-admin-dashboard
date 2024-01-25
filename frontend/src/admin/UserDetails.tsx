import { Iworkouts } from "../interface";
import { WorkoutDetails } from "../components/WorkoutDetails";
import { Link } from "react-router-dom";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";

interface Props {
  workouts: [];
  wloading: boolean;
}

const UserDetails = ({ workouts, wloading }: Props) => {
  const { dispatch } = useWorkoutsContext();
  const handleBack = () => {
    dispatch({
      type: "SET_WORKOUTS",
      payload: null
    });
  };
  return (
    <div className="h-full">
      <Link to="/dashboard">
        <button onClick={handleBack} className="">
          Go Back
        </button>
      </Link>
      {wloading && (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <p className="w-8 h-8 border-t-4 border-black rounded-full animate-spin"></p>
          <p className="text-2xl font-bold text-black animate-pulse">
            Please Wait....
          </p>
        </div>
      )}
      {!wloading && !workouts && (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <p className="text-2xl font-bold text-black animate-pulse">
            Unable to Fetch Data, Refresh the Page to Try again
          </p>
        </div>
      )}
      {!wloading && workouts && workouts.length == 0 && (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <p className="text-2xl font-bold text-black animate-pulse">
            No Available Workouts for this User
          </p>
        </div>
      )}

      {!wloading &&
        workouts &&
        workouts.map((workout: Iworkouts) => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))}
    </div>
  );
};

export default UserDetails;
