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

import { sioPushUnRegister } from "App";
import { useCallback, useEffect, useState } from "react";
import { sioPushRegister } from "../../../App";
export default function FirstTimeDialog({ open, maxWidth, onClose, onSubmit }) {
  const [assetName, setAssetName] = useState("");
  const [values, setValues] = useState({});
  const onSelectDataPath = async (event) => {
    await backendAxios.post("/rpc/SetFirstTimeSelectDataDir", {});
  };
  const onPushMessage = useCallback((message) => {
    console.log("values", values);
    setValues({ ...values, ["data_path"]: message });
  }, []);
  useEffect(() => {
    sioPushRegister("selectDataDir", onPushMessage);
    return () => {
      sioPushUnRegister("selectDataDir", onPushMessage);
    };
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
              value={values.data_path || ""}
              className={"Preferences-Input"}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              onClick={onSelectDataPath}
              className={"Preferences-Button"}
            >
              选择路径...
            </Button>
          </Stack>
          <Typography className={"Preferences-Title"}>
            是否移除导入的视频
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) => {
                  console.log({ ...values, ["is_move"]: event.target.checked });
                  setValues({ ...values, ["is_move"]: event.target.checked });
                }}
                checked={values.is_move || false}
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
