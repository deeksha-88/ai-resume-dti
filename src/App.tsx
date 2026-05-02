import React from "react";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

function App() {
  const router = getRouter();
  return <RouterProvider router={router} />;
}

export default App;