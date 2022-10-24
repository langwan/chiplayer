import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Tooltip,
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
      <Tooltip title={props.title} placement={"top"}>
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
              sx={{ color: props.checked ? "white" : "" }}
            >
              {props.title}
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
      </Tooltip>
    </Card>
  );
}
