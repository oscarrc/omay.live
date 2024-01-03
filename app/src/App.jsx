import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ChatProvider } from "./hooks/useChat";
import Landing from "./routes/landing";
import Layout from "./components/layout";
import { lazy } from "react";

const App = () => {  
  const Chat = lazy(() => import('./routes/chat'));
  const Error = lazy(() => import('./routes/error'));
  const NotFound = lazy(() => import('./routes/error/404'));
  const Policies = lazy(() => import('./routes/policies'));
  
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {   
          id: "landing",
          path: "/",
          element: <Landing />
        },
        {   
          id: "video",
          path: "/video",
          element: <Chat />,
        },
        {   
          id: "unmoderated",
          path: "/unmoderated",
          element: <Chat />,
        },
        {   
          id: "text",
          path: "/text",
          element: <Chat />,
        },
        {   
          id: "policies",
          path: "/policies/:id",
          element: <Policies />
        },        
        {   
          id: "404",
          path: "*",
          element: <NotFound />
        }
      ]
    }
  ])

  return (
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  );
}

export default App;