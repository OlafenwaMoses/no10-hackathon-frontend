import "./App.css";
import styled from "@emotion/styled";
import { Toaster } from "sonner";
import { Outlet } from "@tanstack/react-router";
import ModalManager from "./components/ModalManager";
import PasswordGate from "./components/PasswordGate";
import useStore from "./hooks/useStore";

function App() {
  const passwordRequired = useStore((state) => state.passwordRequired);

  return (
    <Wrapper>
      {passwordRequired ? (
        <PasswordGate />
      ) : (
        <>
          <ModalManager />
          <Outlet />
        </>
      )}
      <Toaster richColors position="top-center" />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.surface100,
  height: "100vh",
  width: "100vw",
  overflow: "clip",
  color: theme.textPrimary,
}));
