import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NavComponent from "./components/UI/NavComponent";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavComponent />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <AppLayout>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;

