import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";

import { ChatProvider } from "./hooks/useChat";
import Landing from "./routes/landing";
import Layout from "./components/layout";
import { lazy } from "react";
import useDetectAdblock from "./hooks/useDetectAdblock";

const App = () => {  
  const AdBlock = lazy(() => import('./routes/error/AdBlock'));
  const Chat = lazy(() => import('./routes/chat'));
  const Error = lazy(() => import('./routes/error'));
  const NotFound = lazy(() => import('./routes/error/404'));
  const Policies = lazy(() => import('./routes/policies'));
  const adBlockDetected = useDetectAdblock();
  const getCount = async () => {
      let res = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat`, { method: "GET"})
      let count = (await res.json()).count

      return count
  }
  
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Error />,
      loader: getCount,
      shouldRevalidate: () => true,
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
          loader: () => adBlockDetected && redirect("/adblock")
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
          id: "adblock",
          path: "/adblock",
          element: <AdBlock />,          
          loader: () => !adBlockDetected && redirect("/")
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