import { Dev } from "./modules/dev";
import { AlertDialog } from "./modules/dialog/AlertDialog";
import { isEnvBroswer } from "./utils";

function App() {
  return (
    <div
      className={`w-full h-screen grid place-items-center ${
        isEnvBroswer()
          ? "bg-[url(https://i.imgur.com/3pzRj9n.png)] bg-cover bg-no-repeat bg-center"
          : ""
      }`}
    >
      <AlertDialog />
      {isEnvBroswer() && <Dev />}
    </div>
  );
}

export default App;
