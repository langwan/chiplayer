import { ChihuoEditText } from "@chihuo/edittext";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { IconSearch } from "@tabler/icons";
import { backendAxios } from "Common/Request";
export default function AssetItem(props) {
  return (
    <Card
      sx={{
        "&.MuiCard-root": {
          boxShadow: "none",
          backgroundColor: "#F5F5F5",
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
      <Box
        sx={{
          width: "100%",
          paddingTop: "56.25%",
          height: 0,
          position: "relative",
        }}
      >
        <CardMedia
          onClick={props.onClick}
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#F5F5F5",
          }}
          src={
            props.cover
              ? `${props.cover}#t=5,20`
              : process.env.PUBLIC_URL + "/res/cover.mov"
          }
          component="video"
        />
      </Box>
      <CardContent>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography
            noWrap={true}
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, color: props.checked ? "white" : "" }}
          >
            <ChihuoEditText
              TextProps={{ sx: { color: props.checked ? "white" : "" } }}
              name={props.title}
              isEdit={props.currentEditText == props.title}
              content={props.title}
              onStart={(name) => {
                props.setCurrentEditText(name);
              }}
              onStop={(name, value) => {
                props.setCurrentEditText(null);
              }}
              onSave={async (name, value) => {
                props.setCurrentEditText(null);
                await backendAxios.post("/rpc/AssetRename", {
                  name: props.title,
                  new_name: value,
                });
              }}
            ></ChihuoEditText>
          </Typography>

          <IconButton
            onClick={async (event) => {
              backendAxios.post("/rpc/OpenDataFile", {
                path: props.path,
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
    </Card>
  );
}
