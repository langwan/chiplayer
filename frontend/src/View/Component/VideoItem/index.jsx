import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
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
        sx={{ height: 260, objectFit: "cover" }}
        src={
          props.video.playerUri
            ? props.video.playerUri
            : process.env.PUBLIC_URL + "/res/cover.mov"
        }
        component="video"
        controls
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {props.video.name}
        </Typography>
      </CardContent>
    </Card>
  );
}
