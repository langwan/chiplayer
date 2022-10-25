import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconHelp, IconMovie, IconNotes, IconSettings } from "@tabler/icons";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FirstTimeDialog from "View/Dialog/FirstTimeDialog";
import { sioPushRegister, sioPushUnRegister } from "../../../App";
export default function LeftMenu(props) {
  let navigate = useNavigate();
  const location = useLocation();
  const [isOpenFirstTimeDialog, setIsOpenFirstTimeDialog] = useState(false);
  let menus = [
    {
      name: "/",

      displayName: "资料库",
      icon: <IconMovie stroke={0.5} />,
    },
    {
      name: "/tasks",
      displayName: "任务",
      icon: <IconNotes stroke={0.5} />,
    },
    {
      name: "/document",
      displayName: "手册",
      icon: <IconHelp stroke={0.5} />,
    },
    {
      name: "/preferences",
      displayName: "首选项",
      icon: <IconSettings stroke={0.5} />,
    },
  ];
  const firstTime = useCallback((message) => {
    setIsOpenFirstTimeDialog(true);
  }, []);
  useEffect(() => {
    sioPushRegister("firstTime", firstTime);
    return () => {
      sioPushUnRegister("firstTime", firstTime);
    };
  }, []);

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      sx={{
        width: props.drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          backgroundColor: "#F5F5F5",
          width: props.drawerWidth,
          boxSizing: "border-box",
          top: 40,
          border: "none",
        },
      }}
      open={props.open}
    >
      <List sx={{ paddingTop: 0 }}>
        {menus.map((menu) => (
          <ListItemButton
            className={"Nav-Item-menu"}
            key={menu.name}
            sx={{
              backgroundColor: location.pathname == menu.name ? "#fff" : "",
            }}
            onClick={(event) => {
              navigate(menu.name);
            }}
          >
            <ListItemIcon>{menu.icon}</ListItemIcon>
            <ListItemText
              sx={{
                "& .MuiTypography-root": {
                  fontWeight:
                    location.pathname == menu.name ? "bold" : "normal",
                },
              }}
            >
              {menu.displayName}
            </ListItemText>
          </ListItemButton>
        ))}
      </List>
      <FirstTimeDialog open={isOpenFirstTimeDialog} />
    </Drawer>
  );
}
