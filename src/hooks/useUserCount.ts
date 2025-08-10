import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { updateUserCount } from "../store/userCountReducer";

export const useUserCount = () => {
  const dispatch = useDispatch();
  const userCount = useSelector(
    (state: RootState) => state.userCount.userCount
  );

  const setUserCount = (count: number) => {
    dispatch(updateUserCount(count));
  };

  return {
    userCount,
    setUserCount,
  };
};
