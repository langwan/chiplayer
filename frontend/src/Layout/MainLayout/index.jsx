import { IconButton, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconMenu2 } from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import LeftMenu from "View/Component/LeftMenu";
export default () => {
  const appInfo = useSelector((state) => state.app.app);
  const drawerWidth = 240;
  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(0),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    })
  );
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  return (
    <Stack
      sx={{ backgroundColor: "#F5F5F5", height: "100%" }}
      direction={"column"}
      justifyContent={"flex-start"}
    >
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems="center"
        sx={{ height: 40 }}
        pl={30}
      >
        CHIPLAYER
        <IconButton
          onClick={() => {
            setIsLeftMenuOpen(!isLeftMenuOpen);
          }}
        >
          <IconMenu2 stroke={0.5} />
        </IconButton>
      </Stack>
      <Stack
        sx={{ flexGrow: 1 }}
        direction={"row"}
        justifyContent="space-between"
      >
        <LeftMenu open={isLeftMenuOpen} drawerWidth={drawerWidth} />
        <Main
          sx={{ backgroundColor: "#fff", padding: 1 }}
          open={isLeftMenuOpen}
        >
          <Outlet />
        </Main>
      </Stack>
    </Stack>
  );
};
