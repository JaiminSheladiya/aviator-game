
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Aviator from './components/aviator';
import SVGs from './components/svgs'
import AviatorProvider from './store/aviator'
import SocketProvider from "./providers/SocketProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <SVGs />
      <SnackbarProvider
        maxSnack={3}
        // Components={{
        //   cashout: CashoutSnackBar,
        // }}
      >
        <SocketProvider>
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
      </SnackbarProvider>
    </>
  );
}

export default App;
