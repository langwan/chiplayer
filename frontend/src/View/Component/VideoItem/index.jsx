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
          backgroundColor: "#F5F5F5",
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
          <Typography variant="h5" component="div">
            {props.video.name}
          </Typography>
          <IconButton
            onClick={async (event) => {
              backendAxios.post("/rpc/OpenDataFile", {
                path: props.video.path,
              });
            }}
          >
            <IconSearch stroke={1} width={16} height={16} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
