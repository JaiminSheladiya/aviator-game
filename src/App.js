import "./App.css";
import Aviator from "./components/aviator";
import SVGs from "./components/svgs";
import AviatorProvider from "./store/aviator";
import SocketProvider from "./providers/SocketProvider";
import { ReduxProvider } from "./providers/ReduxProvider";
import SocketReduxConnector from "./components/SocketReduxConnector";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <SVGs />
      <ReduxProvider>
        <SocketProvider>
          <SocketReduxConnector />
          <AviatorProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/">
                  <Route index element={<Aviator />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AviatorProvider>
        </SocketProvider>
      </ReduxProvider>
    </>
  );
}

export default App;
