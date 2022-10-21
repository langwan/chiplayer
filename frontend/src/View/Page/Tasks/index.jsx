import { ChihuoTable } from "@chihuo/table";
import { Box, Stack } from "@mui/material";
import { IconFile } from "@tabler/icons";
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
        <IconFile stroke={1} />
        <Box pl={1}>{params.row.name}</Box>
      </Stack>
    ),
  },
  {
    field: "total_bytes",
    headerName: "大小",
    width: 200,

    renderCell: (params) =>
      formatFileSize(params.row.consumed_bytes) +
      "/" +
      formatFileSize(params.row.total_bytes),
  },
  {
    field: "updated_at",
    headerName: "修改时间",
    width: 160,
    renderCell: (params) => <Box>{new Date().toLocaleString()}</Box>,
  },
];

export default () => {
  const [selectionModel, setSelectionModel] = useState([]);
  const [cellModesModel, setCellModesModel] = useState({});

  const tasks = useSelector((state) => state.tasks.tasks);

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
        rows={[...tasks]}
        columns={columns}
        getRowId={(row) => "" + row.id}
        initialState={{ sorting: { field: "updated_at", sort: "desc" } }}
      />
    </Box>
  );
};
