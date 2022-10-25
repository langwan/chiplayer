import { ChihuoEditText } from "@chihuo/edittext";
import { IconButton, Stack, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { IconSearch } from "@tabler/icons";
import { backendAxios } from "Common/Request";
export default function VideoItem(props) {
  return (
    <Card
      sx={{
        "&.MuiCard-root": {
          boxShadow: "none",
          border: props.checked ? "4px solid #24A7F2" : "none",
          backgroundColor: props.checked ? "#24A7F2" : "#F5F5F5",
          color: props.checked ? "#fff" : "",
          margin: props.checked ? "-4px" : "0",
        },

        "& .MuiCardContent-root:last-child": {
          padding: 1,
        },
      }}
    >
      <CardMedia
        sx={{ height: "auto", objectFit: "cover" }}
        src={
          props.video.player_uri
            ? props.video.player_uri
            : process.env.PUBLIC_URL + "/res/cover.mov"
        }
        component="video"
        controls
      />
      <Tooltip title={props.video.name} placement={"top"}>
        <CardContent>
          <Stack
            width={"100%"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <ChihuoEditText
              TextProps={{
                noWrap: true,
                width: "100%",
                sx: { color: props.checked ? "white" : "" },
              }}
              name={props.video.name}
              isEdit={props.currentEditText == props.video.name}
              content={props.video.name}
              onStop={(name, value) => {
                props.setCurrentEditText(null);
                props.setEditing(false);
              }}
              onStart={(name) => {
                console.log("onstart");
                props.setCurrentEditText(name);
                props.setEditing(true);
              }}
              onSave={async (name, value) => {
                props.setCurrentEditText(null);
                props.setEditing(false);
                await backendAxios.post("/rpc/FileRename", {
                  asset_name: props.video.asset_name,
                  name: props.video.name,
                  new_name: value,
                });
              }}
            ></ChihuoEditText>

            <IconButton
              onClick={async (event) => {
                backendAxios.post("/rpc/OpenDataFile", {
                  path: props.video.path,
                });
              }}
            >
              <IconSearch
                color={props.checked ? "white" : "#677684"}
                stroke={1.4}
                width={16}
                height={16}
              />
            </IconButton>
          </Stack>
        </CardContent>
      </Tooltip>
    </Card>
  );
}
