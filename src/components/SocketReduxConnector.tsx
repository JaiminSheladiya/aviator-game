import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../providers/SocketProvider";
import { updateUserCount } from "../store/userCountReducer";

const SocketReduxConnector: React.FC = () => {
  const dispatch = useDispatch();
  const { subscribe } = useSocket();

  // useEffect(() => {
  //   // Subscribe to all socket messages to catch user_count updates
  //   const unsubscribe = subscribe("market_update", (data: any) => {
  //     if (data && data.user_count !== undefined) {
  //       dispatch(updateUserCount(data.user_count));
  //     }
  //   });

  //   return unsubscribe;
  // }, [dispatch, subscribe]);

  // Listen for custom socket user_count update events
  useEffect(() => {
    const handleUserCountUpdate = (event: CustomEvent) => {
      const { userCount } = event.detail;
      dispatch(updateUserCount(userCount));
    };

    window.addEventListener(
      "socketUserCountUpdate",
      handleUserCountUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "socketUserCountUpdate",
        handleUserCountUpdate as EventListener
      );
    };
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default SocketReduxConnector;
