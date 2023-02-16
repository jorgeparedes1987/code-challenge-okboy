import routes from "./Routes";
import { useRoutes } from "raviger";
import 'bootstrap/dist/css/bootstrap.min.css';
import Index from "./pages/Index";

export default function App() {
  const RouteComponents = useRoutes(routes);

  return (
    <Index />
  );
}
