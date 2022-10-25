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
export default () => {
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

      <Typography className={"Preferences-Title"}>数据路径</Typography>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <InputBase className={"Preferences-Input"} sx={{ flex: 1 }} />
        <Button variant="outlined" className={"Preferences-Button"}>
          选择新路径...
        </Button>
      </Stack>
      <Typography className={"Preferences-Title"}>
        是否移除导入的视频
      </Typography>
      <FormControlLabel
        control={<Checkbox defaultChecked />}
        label="控制导入视频后是否删除原文件"
      />
    </Stack>
  );
};
