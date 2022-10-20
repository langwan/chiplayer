import { ChihuoTable } from "@chihuo/table";
import { Box, Stack } from "@mui/material";
import { IconFile } from "@tabler/icons";
import { backendAxios } from "Common/Request/index";
import { useEffect, useState } from "react";
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
    field: "Name",
    headerName: "文件名",
    renderCell: (params) => (
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent="flex-start"
      >
        <IconFile stroke={1} />
        <Box pl={1}>{params.row.Name}</Box>
      </Stack>
    ),
  },
  {
    field: "TotalBytes",
    headerName: "大小",
    width: 140,
    renderCell: (params) => formatFileSize(params.row.TotalBytes),
  },
  {
    field: "UpdatedAt",
    headerName: "修改时间",
    width: 160,
    renderCell: (params) => <Box>{new Date().toLocaleString()}</Box>,
  },
];

export default () => {
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [cellModesModel, setCellModesModel] = useState({});
  const load = async () => {
    try {
      let response = await backendAxios.post("/rpc/TaskList", {});
      let result = response.data.body;

      setRows(result);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const onSelectionModelChange = (newSelection) => {
    console.log("onSelectionModelChange", newSelection);
    setSelectionModel([...newSelection]);
  };
  return (
    <Box>
      <ChihuoTable
        onSelectionModelChange={onSelectionModelChange}
        selectionModel={selectionModel}
        cellModesModel={cellModesModel}
        rowHeight={40}
        headerHeight={40}
        rows={rows}
        columns={columns}
        getRowId={(row) => "" + row.ID}
        initialState={{ sorting: { field: "UpdatedAt", sort: "desc" } }}
      />
    </Box>
  );
};
