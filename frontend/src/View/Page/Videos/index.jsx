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
import { IconFileImport, IconTrash } from "@tabler/icons";
import { sioPushRegister, sioPushUnRegister } from "App";
import { backendAxios } from "Common/Request";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import VideoItem from "../../Component/VideoItem/index";
export const Videos = (props) => {
  const [items, setItems] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectionRect, setSelectionRect] = useState(null);
  const gridRef = useRef();
  let { assetName } = useParams();

  const loader = async () => {
    try {
      const response = await backendAxios.post("/rpc/AssetItemList", {
        assetName,
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

  useEffect(() => {
    //if (selectionRect == null) return;
    let sels = [];
    if (gridRef.current && gridRef.current.children) {
      for (const child of gridRef.current.children) {
        const result = itemInBox(selectionRect, child);
        if (result) {
          const key = child.getAttribute("data-key");
          sels.push(key);
        }
      }
    }
    setSelectionModel(sels);
  }, [selectionRect]);
  const onSelectionModelChange = (models) => {
    setSelectionModel([...models]);
  };

  return (
    <Stack
      direction={"column"}
      sx={{ height: "100%" }}
      justifyContent="flex-start"
    >
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
        <Box>
          {selectionModel.length > 0 && (
            <Button
              onClick={(event) => {
                backendAxios.post("/rpc/FileAdd", { assetName });
              }}
              startIcon={<IconTrash stroke={0.5} />}
            >
              {selectionModel.length == items.length && "全部"}删除
            </Button>
          )}
          <Button
            onClick={(event) => {
              backendAxios.post("/rpc/FileAdd", { assetName });
            }}
            startIcon={<IconFileImport stroke={0.5} />}
          >
            导入
          </Button>
        </Box>
      </Stack>
      <Box sx={{ flexGrow: 1 }}>
        <ChihuoSelection
          selectionModel={selectionModel}
          onSelectionModelChange={onSelectionModelChange}
          itemsRef={gridRef}
        >
          <Grid container spacing={4} ref={gridRef}>
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
                  />
                </Grid>
              ))}
          </Grid>
        </ChihuoSelection>
      </Box>
    </Stack>
  );
};
