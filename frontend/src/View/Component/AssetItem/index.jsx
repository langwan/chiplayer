import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { IconSearch } from "@tabler/icons";
import { backendAxios } from "Common/Request";
import { ChihuoEditText } from "View/ChihuoEditText";
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
          margin: props.checked ? "0" : "4px",
        },
        "& .MuiCardContent-root:last-child": {
          padding: 1,
        },
      }}
    >
      <CardMedia
        onClick={props.onClick}
        sx={{ height: "auto", objectFit: "cover" }}
        src={
          props.cover
            ? `${props.cover}#t=5,20`
            : process.env.PUBLIC_URL + "/res/cover.mov"
        }
        component="video"
      />
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
              onStop={(name, value) => {
                props.setCurrentEditText(null);
              }}
              onSave={(name, value) => {
                props.setCurrentEditText(null);
                console.log("edit stop", name, value);
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
