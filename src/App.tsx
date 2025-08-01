import { useNuiEvent } from "./hooks/useNuiEvent";
import { Dev } from "./modules/dev";
import { AlertDialog } from "./modules/dialog/AlertDialog";
// import { InputDialog } from "./modules/dialog/InputDialog";
import { ContextMenu } from "./modules/menu/context";
import { ListMenu } from "./modules/menu/list";
import { RadialMenuController } from "./modules/menu/radial/Controller";
import { Notifications } from "./modules/notifications";
import { CircularProgress } from "./modules/progress/CircularProgress";
import { Progress } from "./modules/progress/Progress";
import { SkillCheck } from "./modules/skillcheck";
import { TextUI } from "./modules/textui/TextUI";
import { isEnvBroswer, setClipboard } from "./utils";
import { fetchNui } from "./utils/fetchNui";

function App() {
  useNuiEvent("setClipboard", (data: string) => {
    setClipboard(data);
  });

  fetchNui("init");

  return (
    <div
      className={`w-full h-screen grid place-items-center ${
        isEnvBroswer()
          ? "bg-[url(https://i.imgur.com/3pzRj9n.png)] bg-cover bg-no-repeat bg-center"
          : ""
      }`}
    >
      <AlertDialog />
      <TextUI />
      <Progress />
      <CircularProgress />
      <SkillCheck />
      <Notifications />
      {/* <InputDialog /> */}
      <RadialMenuController />
      <ListMenu />
      <ContextMenu />
      {isEnvBroswer() && <Dev />}
    </div>
  );
}

export default App;
