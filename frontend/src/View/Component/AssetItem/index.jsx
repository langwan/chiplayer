import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
export default function AssetItem(props) {
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
          props.cover
            ? `${props.cover}#t=5,20`
            : process.env.PUBLIC_URL + "/res/cover.mov"
        }
        component="video"
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
