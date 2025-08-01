import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { aviatorStateType } from "../@types";

const getLocalStorageBoolean = (
  key: string,
  defaultValue: boolean
): boolean => {
  const stored = localStorage.getItem(key);
  return stored !== null ? stored === "true" : defaultValue;
};

const initValue: aviatorStateType = {
  token: "",
  socket: null,
  game_anim_status: "WAITING",
  dimension: {
    width: 1920,
    height: 630,
  },
  auth: true,
  balance: 0,
  autoPlayParams: [
    {
      nOfRounds: 0,
      stopIfarr: [0, 0, 0],
    },
    {
      nOfRounds: 0,
      stopIfarr: [0, 0, 0],
    },
  ],
  RemainedAutoPlayCount: [0, 0],
  musicChecked: getLocalStorageBoolean("musicChecked", true),
  fxChecked: getLocalStorageBoolean("fxChecked", true),
  vol: 50,
};

const AviatorContext = createContext<{
  aviatorState: aviatorStateType;
  setAviatorState: Dispatch<SetStateAction<aviatorStateType>>;
}>({
  aviatorState: initValue,
  setAviatorState: () => {},
});

const AviatorProvider = ({ children }: { children: React.ReactNode }) => {
  const [aviatorState, setAviatorState] = useState<aviatorStateType>(initValue);

  useEffect(() => {
    localStorage.setItem("musicChecked", String(aviatorState.musicChecked));
  }, [aviatorState.musicChecked]);

  useEffect(() => {
    localStorage.setItem("fxChecked", String(aviatorState.fxChecked));
  }, [aviatorState.fxChecked]);

  return (
    <AviatorContext.Provider value={{ aviatorState, setAviatorState }}>
      {children}
    </AviatorContext.Provider>
  );
};

const useAviator = () => useContext(AviatorContext);

export default AviatorProvider;
export { useAviator };
