import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
export default function AssetNewDialog(props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(props.open);
    return () => {};
  }, [props.open]);
  return (
    <Dialog
      open={open}
      onClose={(event) => setOpen(false)}
      maxWidth={props.maxWidth}
      fullWidth={true}
    >
      <DialogTitle>新建资料夹</DialogTitle>
      <DialogContent>
        <TextField fullWidth />
      </DialogContent>
      <DialogActions>
        <form onSubmit={props.onSubmit}>
          <Button
            onClick={(event) => {
              setOpen(false);
            }}
          >
            取消
          </Button>
          <Button>保存</Button>
        </form>
      </DialogActions>
    </Dialog>
  );
}
