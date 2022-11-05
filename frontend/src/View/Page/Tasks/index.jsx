import { ChihuoTable } from "@chihuo/table";
import {
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { IconEraser, IconFile, IconSearch } from "@tabler/icons";
import { backendAxios } from "Common/Request";
import { useState } from "react";
import { useSelector } from "react-redux";
function formatFileSize(size) {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "KB", "MB", "GB", "TB"][i]
  );
}
const columns = [
  {
    field: "name",
    headerName: "文件名",
    renderCell: (params) => (
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent="flex-start"
      >
        <IconFile width={20} stroke={1} />
        <Typography noWrap pl={1}>
          {params.row.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "total_bytes",
    headerName: "大小",
    type: "number",
    width: 200,
    renderCell: (params) => formatFileSize(params.row.total_bytes),
  },
  {
    field: "updated_at",
    headerName: "修改时间",
    type: "dateTime",
    width: 160,
    renderCell: (params) => (
      <Box>{new Date(params.row.updated_at).toLocaleString()}</Box>
    ),
  },
  {
    field: "op",
    headerName: "操作",
    width: 160,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <IconButton
          onClick={async (event) => {
            await backendAxios.post("/rpc/EraserTasks", {
              ids: ["" + params.row.id],
            });
          }}
        >
          <IconEraser width={20} stroke={1} />
        </IconButton>
        <IconButton
          onClick={(event) => {
            backendAxios.post("/rpc/OpenDataFile", {
              path: params.row.dst_path,
            });
          }}
        >
          <IconSearch width={20} stroke={1} />
        </IconButton>
      </Stack>
    ),
  },
];

export default () => {
  const [selectionModel, setSelectionModel] = useState([]);
  const [cellModesModel, setCellModesModel] = useState({});

  const tasks = useSelector((state) => state.tasks.tasks);

  const onSelectionModelChange = (newSelection) => {
    setSelectionModel([...newSelection]);
  };
  return (
    <Stack direction={"column"} justifyContent="space-between">
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Breadcrumbs sx={{ ml: 1 }} aria-label="breadcrumb">
          <Typography>任务</Typography>
        </Breadcrumbs>

        <Button
          sx={{ ml: 1 }}
          onClick={async (event) => {
            if (
              selectionModel.length != 0 &&
              selectionModel.length == tasks.length
            ) {
              await backendAxios.post("/rpc/EraserTaskAll", {});
            } else if (selectionModel.length > 0) {
              await backendAxios.post("/rpc/EraserTasks", {
                ids: selectionModel,
              });
            }
          }}
          startIcon={<IconEraser stroke={1} width={24} />}
        >
          {selectionModel.length != 0 && selectionModel.length == tasks.length
            ? "全部"
            : ""}
          清除
        </Button>
      </Stack>
      <ChihuoTable
        sx={{ ml: -1 }}
        onSelectionModelChange={onSelectionModelChange}
        selectionModel={selectionModel}
        cellModesModel={cellModesModel}
        rowHeight={40}
        headerHeight={40}
        rows={tasks}
        columns={columns}
        getRowId={(row) => "" + row.id}
        initialState={{ sorting: { field: "updated_at", sort: "desc" } }}
      />
    </Stack>
  );
};
