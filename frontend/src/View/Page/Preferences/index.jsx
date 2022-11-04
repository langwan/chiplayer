import {
  Breadcrumbs,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { backendAxios } from "Common/Request/index";
import { useEffect, useState } from "react";
export default () => {
  const [values, setValues] = useState({});
  const [submit, setSubmit] = useState(null);
  const loader = async () => {
    let response = await backendAxios.post("/rpc/GetPreferences", {});
    setValues({
      data_path: getStringValue(response.data.body, "data_path"),
      is_move: getBooleanValue(response.data.body, "is_move"),
    });
  };

  const onSelectDataPath = async (event) => {
    let response = await backendAxios.post(
      "/rpc/SetFirstTimeSelectDataDir",
      {}
    );
    let vals = { ...values, ["data_path"]: response.data.body.path };
    setValues(vals);
    onSubmit(vals);
  };

  useEffect(() => {
    loader();
  }, []);

  const onSubmit = async (vals) => {
    try {
      const response = await backendAxios.post("/rpc/SetPreferences", vals);
    } catch (e) {}
  };

  const getStringValue = (preferences, key) => {
    if (preferences.length == 0) {
      return "";
    } else {
      let p = preferences.filter((p) => p.key == key);

      if (p.length == 0) {
        return "";
      } else {
        return p[0].value;
      }
    }
  };
  const getBooleanValue = (preferences, key) => {
    if (preferences.length == 0) {
      return false;
    } else {
      let p = preferences.filter((p) => p.key == key);

      if (p.length == 0) {
        return false;
      } else {
        if (p[0].value == "true") {
          return true;
        } else {
          return false;
        }
      }
    }
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
            首选项
          </Link>
        </Breadcrumbs>
      </Stack>

      <Typography className={"Preferences-Title"}>
        文件根目录 存放所有资料库和文件
      </Typography>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <InputBase
          onChange={(event) => {
            console.log("onchange inputbase");
          }}
          value={values.data_path || ""}
          className={"Preferences-Input"}
          sx={{ flex: 1, color: "#677684", fontSize: "0.8rem" }}
        />
        <Button
          variant="outlined"
          onClick={onSelectDataPath}
          className={"Preferences-Button"}
        >
          选择新路径...
        </Button>
      </Stack>
      <Typography className={"Preferences-Title"}>
        是否移除导入的视频
      </Typography>
      <FormControlLabel
        sx={{
          "& .MuiCheckbox-root": {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
        control={
          <Checkbox
            onChange={(event) => {
              let vals = { ...values, ["is_move"]: event.target.checked };
              setValues(vals);
              onSubmit(vals);
            }}
            checked={values.is_move || false}
          />
        }
        label="控制导入视频后是否删除原文件"
      />
    </Stack>
  );
};
