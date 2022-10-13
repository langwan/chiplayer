import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconHelp, IconMessages, IconMovie } from "@tabler/icons";
import { useNavigate } from "react-router-dom";

export default function LeftMenu(props) {
  let navigate = useNavigate();
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
        <ListItemButton
          sx={{ backgroundColor: "#fff" }}
          onClick={() => navigate("/")}
        >
          <ListItemIcon>
            <IconMovie stroke={0.5} />
          </ListItemIcon>
          <ListItemText>资料库</ListItemText>
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/demo2")}>
          <ListItemIcon>
            <IconHelp stroke={0.5} />
          </ListItemIcon>
          <ListItemText>使用手册</ListItemText>
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/demo2")}>
          <ListItemIcon>
            <IconMessages stroke={0.5} />
          </ListItemIcon>
          <ListItemText>联系方式</ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
  );
}
