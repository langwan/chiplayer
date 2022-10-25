import { ChihuoSelection } from "@chihuo/selection";
import { Breadcrumbs, Button, Link, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { IconPlus, IconTrash } from "@tabler/icons";
import { sioPushRegister, sioPushUnRegister } from "App";
import { backendAxios } from "Common/Request";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssetNewDialog from "View/Dialog/AssetNewDialog";
import YesNoDialog from "View/Dialog/YesNoDialog";
import AssetItem from "../../Component/AssetItem/index";

export default function Assets() {
  const [selectionModel, setSelectionModel] = useState([]);
  const gridRef = useRef();
  const [currentEditText, setCurrentEditText] = useState(null);

  const [IsOpenYesNoDialog, setIsOpenYesNoDialog] = useState(false);
  const [assetNewDialogIsOpen, setAssetNewDialogIsOpen] = useState(false);
  const onSubmitAssetNewDialog = async (event) => {
    setAssetNewDialogIsOpen(false);
    load();
  };
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const loader = async () => {
    try {
      const response = await backendAxios.post("/rpc/AssetList", {});

      if ("assets" in response.data.body) {
        setAssets(response.data.body.assets);
      } else {
        setAssets([]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loader();
    sioPushRegister("assets", loader);
    return () => {
      sioPushUnRegister("assets", loader);
    };
  }, []);

  const onSelectionModelChange = (newSelection) => {
    setSelectionModel([...newSelection]);
  };

  const onDelete = async () => {
    let its = [];
    for (let key of selectionModel) {
      let arr = assets.filter((item) => item.name == key);
      its.push(arr[0].name);
    }
    backendAxios.post("/rpc/RemoveAsset", { asset_names: its });
  };

  return (
    <Stack mt={-1} direction={"column"} justifyContent="space-between">
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
        height={42}
        p={1}
        pl={0}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/app">
            资料库
          </Link>
        </Breadcrumbs>
        <Stack direction={"row"} alignItems="center" justifyContent="flex-end">
          {selectionModel.length > 0 && (
            <Button
              onClick={(event) => {
                setIsOpenYesNoDialog(true);
              }}
              startIcon={<IconTrash stroke={0.5} />}
            >
              {selectionModel.length == assets.length && "全部"}删除
            </Button>
          )}

          <Button
            onClick={(event) => setAssetNewDialogIsOpen(true)}
            startIcon={<IconPlus stroke={0.5} />}
          >
            新建
          </Button>
        </Stack>
      </Stack>
      <ChihuoSelection
        selectionModel={selectionModel}
        onSelectionModelChange={onSelectionModelChange}
        itemsRef={gridRef}
        disableEvent={IsOpenYesNoDialog || currentEditText != null}
      >
        <Grid container ref={gridRef} spacing={2}>
          {assets &&
            assets.map((asset) => (
              <Grid
                key={asset.name}
                data-key={asset.name}
                item
                xs={12}
                sm={6}
                md={6}
                lg={3}
              >
                <AssetItem
                  onClick={(event) => {
                    navigate(`/videos/${asset.name}`);
                  }}
                  setCurrentEditText={(value) => {
                    if (value != null) {
                      setSelectionModel([]);
                    }
                    setCurrentEditText(value);
                  }}
                  currentEditText={currentEditText}
                  checked={selectionModel.includes(asset.name)}
                  cover={asset.cover}
                  title={asset.name}
                  path={asset.path}
                />
              </Grid>
            ))}
        </Grid>
      </ChihuoSelection>
      <AssetNewDialog
        open={assetNewDialogIsOpen}
        maxWidth={"xs"}
        onClose={(event) => setAssetNewDialogIsOpen(false)}
        onSubmit={onSubmitAssetNewDialog}
      />
      <YesNoDialog
        title={"删除视频？"}
        content="删除后无法恢复，是否要删除？"
        open={IsOpenYesNoDialog}
        maxWidth={"xs"}
        onClose={(event) => {
          setIsOpenYesNoDialog(false);
        }}
        onCancel={(event) => {
          setSelectionModel([]);
        }}
        onOk={(event) => {
          setIsOpenYesNoDialog(false);
          onDelete();
          setSelectionModel([]);
        }}
      />
    </Stack>
  );
}
