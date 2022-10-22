import { IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IconSearch } from "@tabler/icons";
import { backendAxios } from "Common/Request";
export default function VideoItem(props) {
  return (
    <Card
      {...props}
      sx={{
        "&.MuiCard-root": {
          boxShadow: "none",
          borderRadius: 0,
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
        sx={{ height: "auto", objectFit: "cover" }}
        src={
          props.video.playerUri
            ? props.video.playerUri
            : process.env.PUBLIC_URL + "/res/cover.mov"
        }
        component="video"
        controls
      />
      <CardContent>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography
            variant="h5"
            component="div"
            sx={{ color: props.checked ? "white" : "" }}
          >
            {props.video.name}
          </Typography>
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
    </Card>
  );
}
