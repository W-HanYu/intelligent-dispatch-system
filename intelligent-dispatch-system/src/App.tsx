import { Navigate } from "react-router-dom";
import SchedulerSystem from "./Home";
function App() {
  const isLogin = sessionStorage.getItem("access_token");
  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="App">
      <SchedulerSystem />
    </div>
  );
}

export default App;
