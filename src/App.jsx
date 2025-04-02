import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import NotificationPoller from "./components/notifications/NotificationPoller";
import { RouterProvider } from "react-router"; 
import router from "./routes/router"; 

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationPoller />
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;