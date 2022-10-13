import { Button, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import AssetNewDialog from "View/Dialog/AssetNew";
import AssetItem from "../../Component/AssetItem/index";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function AssetList() {
  const [assetNewDialogIsOpen, setAssetNewDialogIsOpen] = useState(false);
  const onSubmitAssetNewDialog = (event) => {};
  return (
    <Stack direction={"column"} justifyContent="space-between" spacing={1}>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>资料夹</Typography>
        <Button
          onClick={(event) => setAssetNewDialogIsOpen(true)}
          startIcon={<IconPlus stroke={0.5} />}
        >
          新建
        </Button>
      </Stack>
      <Grid container spacing={1}>
        <Grid xs={3}>
          <AssetItem cover={"test/1.jpg"} title="摄影" />
        </Grid>
        <Grid xs={3}>
          <AssetItem cover={"test/2.jpg"} title="收藏" />
        </Grid>
        <Grid xs={3}>
          <AssetItem cover={"test/3.jpg"} title="学习" />
        </Grid>
        <Grid xs={3}>
          <AssetItem cover={"test/4.jpg"} title="生活" />
        </Grid>
      </Grid>
      <AssetNewDialog
        open={assetNewDialogIsOpen}
        maxWidth={"xs"}
        onSubmit={onSubmitAssetNewDialog}
      />
    </Stack>
  );
}
