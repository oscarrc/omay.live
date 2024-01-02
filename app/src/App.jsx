import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

import { ChatProvider } from "./hooks/useChat";
import Landing from "./routes/landing";
import Layout from "./components/layout";

const App = () => {  
  const Chat = lazy(() => import('./routes/chat'));
  const Error = lazy(() => import('./routes/error'));
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
        }
      ]
    }
  ])

  return (
    <ChatProvider>      
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </ChatProvider>
  );
}

export default App;