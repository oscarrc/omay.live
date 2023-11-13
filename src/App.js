import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Chat from "./routes/chat";
import { ChatProvider } from "./hooks/useChat";
import Error from "./routes/error";
import Landing from "./routes/landing";
import Layout from "./components/layout";
import Policies from "./routes/policies";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Layout><Error /></Layout>,
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
          id: "text",
          path: "/text",
          element: <Chat textOnly={true} />,
        },
        {   
          id: "policies",
          path: "/policies/:id",
          element: <Policies />,
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