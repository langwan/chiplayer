import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
export default function AssetItem(props) {
  return (
    <Card
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
        component="img"
        height="140"
        image={props.cover}
        alt="green iguana"
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
