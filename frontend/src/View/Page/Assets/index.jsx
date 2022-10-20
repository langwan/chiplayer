import { Button, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { IconPlus } from "@tabler/icons";
import { backendAxios } from "Common/Request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssetNewDialog from "View/Dialog/AssetNew";
import AssetItem from "../../Component/AssetItem/index";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Assets() {
  const [assetNewDialogIsOpen, setAssetNewDialogIsOpen] = useState(false);
  const onSubmitAssetNewDialog = async (event) => {
    setAssetNewDialogIsOpen(false);
    load();
  };
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const load = async () => {
    try {
      const response = await backendAxios.post("/rpc/AssetList", {});
      console.log(response);
      if ("assets" in response.data.body) {
        setAssets(response.data.body.assets);
      } else {
        setAssets([]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <Stack direction={"column"} justifyContent="space-between">
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>资料库</Typography>
        <Button
          onClick={(event) => setAssetNewDialogIsOpen(true)}
          startIcon={<IconPlus stroke={0.5} />}
        >
          新建
        </Button>
      </Stack>
      <Grid container spacing={1}>
        {assets &&
          assets.map((asset) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AssetItem
                onClick={(event) => {
                  navigate(`/videos/${asset.name}`);
                }}
                cover={"test/1.jpg"}
                title={asset.name}
              />
            </Grid>
          ))}
      </Grid>
      <AssetNewDialog
        open={assetNewDialogIsOpen}
        maxWidth={"xs"}
        onClose={(event) => setAssetNewDialogIsOpen(false)}
        onSubmit={onSubmitAssetNewDialog}
      />
    </Stack>
  );
}
