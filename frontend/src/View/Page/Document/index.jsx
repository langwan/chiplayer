import { Stack } from "@mui/material";
import ReactMarkdown from "react-markdown";
import "./Markdown.css";
const markdown = `

## 手册

ChiPlayer 是一款本地视频的管理和播放软件。作者 langwan <langwanluo@126.com>

### 首次启动

首次启动 需要设置如下首选项：

存储路径 - 存储资料夹和视频的根目录，尽量选择空间较大的磁盘

移除原文件 - 选择 是 原文件导入后会被删除，否 不会

### 资料夹

新增资料夹 - 新增一个资料夹

资料夹封面 - 资料夹导入第一个视频的时候会被当做默认的封面，也可以在视频列表中选择视频重新设置

删除 - 删除资料夹，所有视频也全部被清除，慎用

改名 - 双击资料夹名称改名

### 视频

导入 - 向资料夹导入视频

删除 - 删除选中视频

设置封面 - 选中单个视频可以设置成资料夹封面

播放 - 点视频封面可以播放视频

改名 - 双击视频名称改名

### 任务

导入视频 - 会出现在任务列表当中，清除任务不会删除视频

删除 - 删除当前视频（无法找回）

### 框选

框选 - 资料夹列表、视频列表可以使用鼠标框选文件

单击标题 - 单击标题会单选当前文件

shift - 按住shift 会新增或移除当前选择

### 定制开发

如需要定制或二次开发，可通过下面的方式联系作者：

邮箱 <langwanluo@126.com>

github [https://github.com/langwan](https://github.com/langwan)

B站 [https://space.bilibili.com/401571418](https://space.bilibili.com/401571418)

`;

export default () => {
  return (
    <Stack direction={"column"} justifyContent="space-between">
      <ReactMarkdown className={"markdown"} children={markdown} />
    </Stack>
  );
};
