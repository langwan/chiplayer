import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { IconFileImport } from "@tabler/icons";
import { backendAxios } from "Common/Request";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoItem from "../../Component/VideoItem/index";

export const Videos = (props) => {
  const [items, setItems] = useState([]);
  let { assetName } = useParams();
  const loader = async () => {
    try {
      const response = await backendAxios.post("/rpc/AssetItemList", {
        assetName,
      });
      console.log("loader response");
      if ("items" in response.data.body) {
        return setItems(response.data.body.items);
      } else {
        return setItems([]);
      }
    } catch (e) {}
  };
  useEffect(() => {
    loader();
  }, []);

  return (
    <Stack direction={"column"} justifyContent="space-between">
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/app">
            资料库
          </Link>
          <Typography color="text.primary">{assetName}</Typography>
        </Breadcrumbs>
        <Button
          onClick={(event) => setAssetNewDialogIsOpen(true)}
          startIcon={<IconFileImport stroke={0.5} />}
        >
          导入
        </Button>
      </Stack>
      <Grid container spacing={1}>
        {items &&
          items.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <VideoItem video={video} />
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
};
