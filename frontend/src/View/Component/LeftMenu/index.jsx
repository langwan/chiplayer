import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconHelp, IconMovie, IconNotes } from "@tabler/icons";
import { useLocation, useNavigate } from "react-router-dom";
export default function LeftMenu(props) {
  let navigate = useNavigate();
  const location = useLocation();

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
  ];

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
            key={menu.name}
            sx={{
              backgroundColor: location.pathname == menu.name ? "#fff" : "",
            }}
            onClick={(event) => {
              navigate(menu.name);
            }}
          >
            <ListItemIcon>{menu.icon}</ListItemIcon>
            <ListItemText>{menu.displayName}</ListItemText>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
