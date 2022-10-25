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
import { useEffect, useState } from "react";
import { backendAxios } from "../../../Common/Request/index";
export default () => {
  const [preferences, setPreferences] = useState([]);

  const loader = async () => {
    let response = await backendAxios.post("/rpc/GetPreferences", {});
    setPreferences(response.data.body);
  };

  useEffect(() => {
    loader();
  }, []);

  const getStringValue = (key) => {
    if (preferences.length == 0) {
      return "";
    } else {
      let p = preferences.filter((p) => p.key == key);
      console.log(p);
      if (p.length == 0) {
        return "";
      } else {
        return p[0].value;
      }
    }
  };

  const getBooleanValue = (key) => {
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
          value={getStringValue("data_path")}
          className={"Preferences-Input"}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" className={"Preferences-Button"}>
          选择新路径...
        </Button>
      </Stack>
      <Typography className={"Preferences-Title"}>
        是否移除导入的视频
      </Typography>
      <FormControlLabel
        control={<Checkbox checked={getBooleanValue("is_move")} />}
        label="控制导入视频后是否删除原文件"
      />
    </Stack>
  );
};
