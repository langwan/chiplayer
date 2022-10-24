import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { backendAxios } from "Common/Request";

import { useState } from "react";
export default function AssetNewDialog({ open, maxWidth, onClose, onSubmit }) {
  const [assetName, setAssetName] = useState("");
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={true}>
      <DialogTitle>新建资料库</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          onChange={(event) => {
            setAssetName(event.target.value);
          }}
          value={assetName}
        />
      </DialogContent>
      <DialogActions>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const response = await backendAxios.post("/rpc/AssetAdd", {
                asset_name: assetName,
              });
              onSubmit(event);
            } catch (e) {}
          }}
        >
          <Button onClick={onClose}>取消</Button>
          <Button type="submit">保存</Button>
        </form>
      </DialogActions>
    </Dialog>
  );
}
