import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";

import { ChatProvider } from "./hooks/useChat";
import { CookieConsentProvider } from "./hooks/useCookieConsent";
import Landing from "./routes/landing";
import Layout from "./components/layout";
import { lazy } from "react";

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

  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </CookieConsentProvider>
    </QueryClientProvider>
  );
}

export default App;