import MainLayout from "Layout/MainLayout";
import { createBrowserRouter } from "react-router-dom";
import AssetList from "View/Page/Assets";
import Document from "View/Page/Document";
import Preferences from "View/Page/Preferences";
import Tasks from "View/Page/Tasks";
import { Videos } from "View/Page/Videos";
export default createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <div>error 404.</div>,
      children: [
        {
          path: "/",
          element: <AssetList />,
        },
        {
          path: "videos/:assetName",
          element: <Videos />,
        },
        {
          path: "tasks",
          element: <Tasks />,
        },

        {
          path: "document",
          element: <Document />,
        },
        {
          path: "preferences",
          element: <Preferences />,
        },
      ],
    },
  ],
  {
    basename: "/app",
  }
);
