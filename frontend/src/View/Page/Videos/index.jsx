import { ChihuoSelection } from "@chihuo/selection";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { IconFileImport, IconPolaroid, IconTrash } from "@tabler/icons";
import { sioPushRegister, sioPushUnRegister } from "App";
import { backendAxios } from "Common/Request";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import VideoItem from "View/Component/VideoItem";
import YesNoDialog from "View/Dialog/YesNoDialog";
export const Videos = (props) => {
  const [currentEditText, setCurrentEditText] = useState(null);
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const gridRef = useRef();
  let { assetName } = useParams();
  const [IsOpenYesNoDialog, setIsOpenYesNoDialog] = useState(false);
  const loader = async () => {
    try {
      const response = await backendAxios.post("/rpc/AssetItemList", {
        asset_name: assetName,
      });
      if ("items" in response.data.body) {
        return setItems(response.data.body.items);
      } else {
        return setItems([]);
      }
    } catch (e) {}
  };
  useEffect(() => {
    loader();
    sioPushRegister("videos", loader);
    return () => {
      sioPushUnRegister("videos", loader);
    };
  }, []);

  const onSelectionModelChange = (models) => {
    setSelectionModel([...models]);
  };

  const onDelete = async () => {
    let its = [];
    for (let key of selectionModel) {
      let arr = items.filter((item) => item.name == key);
      its.push(arr[0].name);
    }
    backendAxios.post("/rpc/RemoveFile", { asset_name: assetName, uris: its });
  };

  return (
    <Stack
      direction={"column"}
      sx={{ height: "100%" }}
      mt={-1}
      justifyContent="flex-start"
    >
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
          <Typography color="text.primary">{assetName}</Typography>
        </Breadcrumbs>
        <Box>
          {selectionModel.length == 1 && (
            <Button
              onClick={async (event) => {
                let result = items.filter(
                  (item) => item.name == selectionModel
                );
                backendAxios.post("/rpc/AssetSetCover", {
                  asset_name: assetName,
                  cover: result[0].name,
                });
              }}
              startIcon={<IconPolaroid stroke={0.5} />}
            >
              设为封面
            </Button>
          )}
          {selectionModel.length > 0 && (
            <Button
              onClick={(event) => {
                setIsOpenYesNoDialog(true);
              }}
              startIcon={<IconTrash stroke={0.5} />}
            >
              {selectionModel.length == items.length && "全部"}删除
            </Button>
          )}
          <Button
            onClick={(event) => {
              backendAxios.post("/rpc/FileAdd", { asset_name: assetName });
            }}
            startIcon={<IconFileImport stroke={0.5} />}
          >
            导入
          </Button>
        </Box>
      </Stack>
      <Box sx={{ flexGrow: 1 }}>
        {console.log("editing", IsOpenYesNoDialog || currentEditText != null)}
        <ChihuoSelection
          disableEvent={IsOpenYesNoDialog || currentEditText != null}
          selectionModel={selectionModel}
          onSelectionModelChange={onSelectionModelChange}
          itemsRef={gridRef}
        >
          <Grid container spacing={2} ref={gridRef}>
            {items &&
              items.map((video) => (
                <Grid
                  key={video.name}
                  data-key={video.name}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <VideoItem
                    checked={selectionModel.includes(video.name)}
                    video={video}
                    setEditing={setEditing}
                    setCurrentEditText={(value) => {
                      if (value != null) {
                        setSelectionModel([]);
                      }
                      setCurrentEditText(value);
                    }}
                    currentEditText={currentEditText}
                  />
                </Grid>
              ))}
          </Grid>
        </ChihuoSelection>
      </Box>
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
};
