import { Box, Checkbox, Stack, TextField, Typography } from "@mui/material";

import { styled } from "@mui/system";
import { IconArrowDown, IconArrowUp } from "@tabler/icons";
import { useCallback, useEffect, useRef, useState } from "react";
const name = "ChihuoTable";

const GridCellModes = {
  Edit: "edit",
  View: "view",
};
export { GridCellModes };
const Root = styled("div", {
  name: name,
  slot: "Root",
  overridesResolver: (props, styles) => [styles.root],
})(({ theme }) => ({
  fontSize: 14,
}));

const Header = styled(Stack, {
  name: "ChihuoTableHeader",
  overridesResolver: (props, styles) => [styles.root],
})(({ theme }) => ({
  fontSize: 14,
  ":hover": {
    backgroundColor: "#F4F4F4",
  },
}));

const Row = styled(Stack, {
  name: "ChihuoTableRow",
  overridesResolver: (props, styles) => [styles.root],
})(({ theme }) => ({
  fontSize: 14,
  ":hover": {
    backgroundColor: "#F4F4F4",
  },
}));

export const ChihuoTable = ({
  columns,
  rowHeight,
  headerHeight,
  getRowId,
  onSelectionModelChange,
  selectionModel,
  onRowClick,
  onRowContextMenu,
  cellModesModel,
  onLoadMore,
  onCellEditStart,
  onCellEditStop,
  onSortModelChange,
  initialState,
  rows,
}) => {
  const [columnMap, setColumnMap] = useState({});
  const [editValue, setEditValue] = useState("");
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState(null);
  const editRef = useRef(null);
  const [functionKeyIsDown, setFunctionKeyIsDown] = useState(false);
  const [latestCheckboxId, setLatestCheckboxId] = useState(0);

  const onGlobalKeyDown = useCallback((event) => {
    if (event.key === "Shift") {
      setFunctionKeyIsDown(true);
    }
  }, []);

  const onGlobalKeyUp = useCallback((event) => {
    if (event.key === "Shift") {
      setFunctionKeyIsDown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onGlobalKeyDown);
    document.addEventListener("keyup", onGlobalKeyUp);
    return () => {
      document.removeEventListener("keydown", onGlobalKeyDown);
      document.removeEventListener("keyup", onGlobalKeyUp);
    };
  }, []);

  useEffect(() => {
    if (columns && columns.length > 0) {
      var result = columns.reduce(function (map, obj) {
        map[obj.field] = obj;
        return map;
      }, {});
      setColumnMap({ ...result });
    }
    return () => {};
  }, [columns]);

  useEffect(() => {
    if (initialState && initialState.sorting && !sorting) {
      setSorting(initialState.sorting);
    }

    return () => {};
  }, [initialState]);

  useEffect(() => {
    if (sorting && rows.length > 0) {
      let result = rows;
      let col = columnMap[sorting.field];
      let type = col.type ? col.type : "string";
      console.log("sorting", col, type, sorting);
      result.sort((a, b) => {
        switch (type) {
          case "number":
            return sorting.sort == "asc"
              ? a[sorting.field] - b[sorting.field]
              : b[sorting.field] - a[sorting.field];
            break;
          case "dataTime":
            return sorting.sort == "asc"
              ? new Date(a[sorting.field]) - new Date(b[sorting.field])
              : new Date(b[sorting.field]) - new Date(a[sorting.field]);
            break;
          default:
            return sorting.sort == "asc"
              ? a[sorting.field].localeCompare(b[sorting.field])
              : b[sorting.field].localeCompare(a[sorting.field]);
        }
      });
      console.log("setItems", result);
      setItems([...result]);
    }

    return () => {};
  }, [rows, sorting]);

  useEffect(() => {
    const obj = items.filter((row) => getRowId(row) == cellModesModel.id);
    if (obj.length > 0) {
      setEditValue(obj[0][cellModesModel.field]);
    }

    return () => {};
  }, [cellModesModel]);

  const MakeParams = (row) => {
    return { row: row };
  };

  const onChangeCheckbox = (event) => {
    const id = event.target.value;

    var result = selectionModel;

    if (result.includes(id)) {
      if (functionKeyIsDown) {
        const currentIndex = GetRowIndex(id);

        if (currentIndex - latestCheckboxId > 0) {
          for (
            var i = parseInt(latestCheckboxId);
            i < parseInt(currentIndex);
            i++
          ) {
            if (result.includes(getRowId(items[i]))) {
              var index = result.indexOf(getRowId(items[i]));
              if (index !== -1) {
                result.splice(index, 1);
              }
            }
          }
        } else {
          for (
            var i = parseInt(currentIndex) + 1;
            i <= parseInt(latestCheckboxId);
            i++
          ) {
            if (result.includes(getRowId(items[i]))) {
              var index = result.indexOf(getRowId(items[i]));

              if (index !== -1) {
                result.splice(index, 1);
              }
            }
          }
        }
        setLatestCheckboxId(GetRowIndex(id));
      } else {
        var index = result.indexOf(id);
        if (index !== -1) {
          result.splice(index, 1);
        }
      }
    } else {
      if (functionKeyIsDown) {
        const currentIndex = GetRowIndex(id);

        if (currentIndex - latestCheckboxId > 0) {
          for (
            var i = parseInt(latestCheckboxId);
            i <= parseInt(currentIndex);
            i++
          ) {
            if (!result.includes(getRowId(items[i]))) {
              result.push(getRowId(items[i]));
            }
          }
        } else {
          for (
            var i = parseInt(currentIndex);
            i <= parseInt(latestCheckboxId);
            i++
          ) {
            if (!result.includes(getRowId(items[i]))) {
              result.push(getRowId(items[i]));
            }
          }
        }
      } else {
        result.push(id);
      }
      setLatestCheckboxId(GetRowIndex(id));
    }
    onSelectionModelChange(result);
  };

  const GetRowIndex = (id) => {
    for (var i in items) {
      if (getRowId(items[i]) == id) {
        return i;
      }
    }
  };
  return (
    <Root>
      <Stack>
        <Header
          direction="row"
          justifyContent={"flex-start"}
          alignItems="center"
        >
          <Checkbox
            onChange={(event) => {
              if (event.target.checked) {
                const result = items.map((row) => getRowId(row));
                onSelectionModelChange(result);
              } else {
                onSelectionModelChange([]);
              }
            }}
            indeterminate={
              selectionModel.length > 0 && selectionModel.length != items.length
            }
            checked={
              selectionModel.length != 0 &&
              selectionModel.length == items.length
            }
            sx={{
              width: 40,
              height: rowHeight,
              lineHeight: rowHeight + "px",
            }}
          />
          {columns &&
            columns.map((col) => (
              <Stack
                onClick={(event) => {
                  if (sorting) {
                    setSorting({
                      field: col.field,
                      sort: sorting.sort == "asc" ? "desc" : "asc",
                    });
                  } else {
                    setSorting({ filed: col.field, sort: "asc" });
                  }
                }}
                direction={"row"}
                justifyContent="flex-start"
                alignItems={"center"}
                key={col.field}
                sx={{
                  cursor: "pointer",
                  width: col.width ? col.width : "auto",
                  flexGrow: col.width ? 0 : 1,
                  lineHeight: rowHeight + "px",
                  height: headerHeight,
                }}
              >
                <Box>{col.headerName}</Box>
                {sorting && sorting.field == col.field ? (
                  sorting.sort == "asc" ? (
                    <IconArrowUp stroke={1} width={16} />
                  ) : (
                    <IconArrowDown stroke={1} width={16} />
                  )
                ) : null}
              </Stack>
            ))}
        </Header>
        {items &&
          items.length > 0 &&
          items.map((row) => (
            <Row
              sx={{
                cursor: "pointer",
                backgroundColor:
                  cellModesModel && cellModesModel.id == getRowId(row)
                    ? "#F4F4F4"
                    : null,
              }}
              onContextMenu={(event) => onRowContextMenu(row, event)}
              key={getRowId && getRowId(row)}
              direction="row"
              justifyContent={"flex-start"}
              alignItems="center"
              onClick={(event) => {
                onRowClick(row, event);
              }}
            >
              <Box onKeyDown={(event) => {}}>
                <Checkbox
                  checked={
                    selectionModel
                      ? selectionModel.includes(getRowId(row))
                      : false
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onChange={onChangeCheckbox}
                  value={getRowId && getRowId(row)}
                  sx={{
                    width: 40,
                    height: rowHeight,
                  }}
                />
              </Box>
              {Object.keys(columnMap).map((key, index) => {
                if (row[key]) {
                  return (
                    <Stack
                      direction={"row"}
                      alignItems="center"
                      justifyContent={"flex-start"}
                      key={"col_" + key}
                      sx={{
                        display: "block",
                        width: columnMap[key].width
                          ? columnMap[key].width
                          : "auto",
                        flexGrow: columnMap[key].width ? 0 : 1,
                      }}
                    >
                      {cellModesModel &&
                      cellModesModel.id == getRowId(row) &&
                      cellModesModel.field == key ? (
                        <TextField
                          onBlur={(event) => {
                            setEditValue(null);
                            onCellEditStop(getRowId(row), key, editValue);
                          }}
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" ||
                              event.key === "Escape"
                            ) {
                              setEditValue(null);
                              onCellEditStop(getRowId(row), key, editValue);
                            }
                          }}
                          inputRef={(el) => {
                            if (!editValue && el) {
                              el.select();
                              el.focus();
                              setEditValue(row[key]);
                            }
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 0,
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: 0,
                              pl: 1,
                            },
                          }}
                          onChange={(event) => {
                            setEditValue(event.target.value);
                          }}
                          value={editValue || row[key]}
                        />
                      ) : columnMap[key].renderCell ? (
                        columnMap[key].renderCell(MakeParams(row))
                      ) : (
                        <Typography noWrap>{row[key]}</Typography>
                      )}
                    </Stack>
                  );
                } else {
                  return (
                    <Box
                      key={"col_" + key}
                      sx={{
                        display: "block",
                        width: columnMap[key].width
                          ? columnMap[key].width
                          : "auto",
                        flexGrow: columnMap[key].width ? 0 : 1,
                      }}
                    >
                      {columnMap[key].renderCell &&
                        columnMap[key].renderCell(MakeParams(row))}
                    </Box>
                  );
                }
              })}
            </Row>
          ))}
        {onLoadMore && (
          <Stack
            onClick={onLoadMore}
            direction={"row"}
            alignItems="center"
            justifyContent="center"
          >
            点击加载更多
          </Stack>
        )}
      </Stack>
    </Root>
  );
};
ChihuoTable.defaultProps = {
  columns: [],
  rowHeight: 40,
  headerHeight: 40,
  getRowId: () => {},
  onSelectionModelChange: () => {},
  selectionModel: [],
  onRowClick: () => {},
  onRowContextMenu: () => {},
  cellModesModel: [],
  onLoadMore: null,
  onCellEditStart: () => {},
  onCellEditStop: () => {},
  onSortModelChange: () => {},
  initialState: null,
  rows: [],
};
