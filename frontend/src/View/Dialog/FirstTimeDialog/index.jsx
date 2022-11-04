import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { backendAxios } from "Common/Request";

import { useEffect, useState } from "react";
export default function FirstTimeDialog({ open, maxWidth, onClose, onSubmit }) {
  const [values, setValues] = useState({});
  const onSelectDataPath = async (event) => {
    let response = await backendAxios.post(
      "/rpc/SetFirstTimeSelectDataDir",
      {}
    );

    setValues({ ...values, ["data_path"]: response.data.body.path });
  };

  const loader = async () => {
    let response = await backendAxios.post("/rpc/GetPreferences", {});
    setValues({
      data_path: getStringValue(response.data.body, "data_path"),
      is_move: getBooleanValue(response.data.body, "is_move"),
    });
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
  useEffect(() => {
    loader();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={true}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const response = await backendAxios.post("/rpc/SetFirstTime", {
              ...values,
            });
            onClose();
          } catch (e) {}
        }}
      >
        <DialogTitle>首次启动</DialogTitle>
        <DialogContent>
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
              value={values.data_path}
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
                  setValues({ ...values, ["is_move"]: event.target.checked });
                }}
                checked={values.is_move}
              />
            }
            label="控制导入视频后是否删除原文件（删除后无法还原）"
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">保存</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
