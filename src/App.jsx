import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./redux/store";


const App = () => {
  return (
    <Provider store={store}>
    <ThemeProvider>
    <AuthProvider>
      <Router>
        <AppRoutes />
        
      </Router>
    </AuthProvider>
    </ThemeProvider>
    </Provider>
  );
};

export default App;
