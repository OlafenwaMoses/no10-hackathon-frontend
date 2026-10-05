import styled from "@emotion/styled";
import { useState, type FormEvent } from "react";
import { motion, type Transition } from "motion/react";
import { LockIcon } from "@phosphor-icons/react";
import Button from "./UI/Button";
import Loader from "./UI/Loader";
import TextInput from "./TextInput";
import { P } from "../lib/utilityComponents";
import { ApiError, apiFetch } from "../lib/api";
import { writePassword } from "../lib/password";
import { queryClient } from "../lib/queryClient";
import { SPRING3 } from "../lib/springs";
import useStore from "../hooks/useStore";
import LogoIcon from "../assets/logo.svg?react";

function PasswordGate() {
  const setPasswordRequired = useStore((state) => state.setPasswordRequired);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password || checking) return;
    setChecking(true);
    setError(null);
    writePassword(password);
    try {
      await apiFetch("/stats");
      setPasswordRequired(false);
      void queryClient.invalidateQueries();
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 401
          ? "That password isn't right."
          : "Couldn't reach the server. Try again.",
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <Outer>
      <Card
        initial={{ opacity: 0, transform: "translateY(8px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={SPRING3 as Transition}
        onSubmit={(event) => void submit(event)}
      >
        <Brand>
          <LogoIcon width={22} height={22} />
          Global Talent Radar
        </Brand>
        <IconRing>
          <LockIcon size={20} />
        </IconRing>
        <P bold size="lg" funnel center>
          Restricted access
        </P>
        <P textSecondary center size="sm">
          Enter the Global Talent Taskforce password to continue.
        </P>
        <Fields>
          <TextInput
            type="password"
            autoFocus
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={!!error}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" variant="primary" disabled={!password || checking}>
            {checking && <Loader size={14} color="currentColor" />}
            Continue
          </Button>
        </Fields>
      </Card>
    </Outer>
  );
}

export default PasswordGate;

const Outer = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: 32,
  backgroundColor: theme.surface100,
}));

const Card = styled(motion.form)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  width: "100%",
  maxWidth: 380,
  padding: "32px 28px 28px",
  borderRadius: 8,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00,
  boxShadow: theme.shadowDropdown,
}));

const Brand = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 24,
  fontFamily: theme.fontDisplay,
  fontSize: 15,
  fontWeight: 500,
  color: theme.textPrimary,
}));

const IconRing = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  marginBottom: 10,
  borderRadius: "50%",
  backgroundColor: theme.surface200,
  border: `1px solid ${theme.border100}`,
  color: theme.textTertiary,
}));

const Fields = styled.div({
  display: "flex",
  flexDirection: "column",
  alignSelf: "stretch",
  gap: 10,
  marginTop: 18,
});

const ErrorText = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.danger,
}));
