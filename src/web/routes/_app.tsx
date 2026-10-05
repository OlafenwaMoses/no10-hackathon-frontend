import { createFileRoute, Outlet } from "@tanstack/react-router";
import styled from "@emotion/styled";
import AppNav from "../components/Nav/AppNav";
import TopBar from "../components/Nav/TopBar";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Shell>
      <AppNav />
      <Main>
        <MainColumn>
          <TopBar />
          <Content>
            <Outlet />
          </Content>
        </MainColumn>
      </Main>
    </Shell>
  );
}

const Shell = styled.div(({ theme }) => ({
  display: "flex",
  height: "100%",
  width: "100%",
  overflow: "clip",
  backgroundColor: theme.surface100,
  color: theme.textPrimary,
}));

const Main = styled.div({
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  flex: 1,
  minWidth: 0,
  height: "100%",
});

const MainColumn = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  height: "100%",
});

const Content = styled.div({
  position: "relative",
  flex: 1,
  minHeight: 0,
  overflow: "clip",
});
