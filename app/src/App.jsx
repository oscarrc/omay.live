import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, useEffect } from "react";

import { AdblockDetectionProvider } from "./hooks/useAdblockDetection";
import { ChatProvider } from "./hooks/useChat";
import { CookieConsentProvider } from "./hooks/useCookieConsent";
import { DeviceProvider } from "./hooks/useDevice";
import Landing from "./routes/landing";
import Layout from "./components/layout";

const App = () => {  
  const Chat = lazy(() => import('./routes/chat'));
  const Error = lazy(() => import('./routes/error'));
  const NotFound = lazy(() => import('./routes/error/404'));
  const Policies = lazy(() => import('./routes/policies'));
  const queryClient = new QueryClient();
    
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
          element: <Chat />
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

  useEffect(() => {
    document.body.classList.remove('noscript');
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        <AdblockDetectionProvider>
          <DeviceProvider>
            <ChatProvider>
              <RouterProvider router={router} />
            </ChatProvider>
          </DeviceProvider>
        </AdblockDetectionProvider>
      </CookieConsentProvider>
    </QueryClientProvider>
  );
}

export default App;