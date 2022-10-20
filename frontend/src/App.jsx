import { Box } from "@mui/material";
import MainLayout from "Layout/MainLayout";
import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
const Demo1 = lazy(() => import("View/Page/Demo1"));
const Demo2 = lazy(() => import("View/Page/Demo2"));
const AssetList = lazy(() => import("View/Page/Assets"));
const VideoList = lazy(() => import("View/Page/Videos"));
export default function App() {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Loadable lazy={<AssetList />} />,
        },
        {
          path: "/video/:assetId",
          element: <Loadable lazy={<VideoList />} />,
        },
        {
          path: "demo2",
          element: <Loadable lazy={<Demo2 />} />,
        },
      ],
    },
  ]);
}

const Loadable = (props) => (
  <Suspense fallback={<Box>Loading...</Box>}>{props.lazy}</Suspense>
);
