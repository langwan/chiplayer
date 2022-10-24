import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
export default ({
  open,
  onClose,
  onOk,
  maxWidth,
  onCancel,
  title,
  content,
}) => {
  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      fullWidth={true}
      onClose={(event) => {
        onClose();
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onOk();
            onCancel();
          }}
        >
          确定
        </Button>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onClose();
            onCancel();
          }}
        >
          取消
        </Button>
      </DialogActions>
    </Dialog>
  );
};
