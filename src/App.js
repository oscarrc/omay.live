import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Chat from "./routes/chat";
import Error from "./components/error";
import Landing from "./routes/landing";
import Layout from "./components/layout";

const App = () => {

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {   
          id: "landing",
          path: "/",
          element: <Landing />,
        },
        {   
          id: "video",
          path: "/video",
          element: <Chat />,
        },
        {   
          id: "text",
          path: "/text",
          element: <Chat textOnly={true} />,
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;