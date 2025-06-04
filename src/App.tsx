import { Dev } from "./modules/dev";
import { AlertDialog } from "./modules/dialog/AlertDialog";
import { Notifications } from "./modules/notifications";
import { CircularProgress } from "./modules/progress/CircularProgress";
import { Progress } from "./modules/progress/Progress";
import { SkillCheck } from "./modules/skillcheck";
import { TextUI } from "./modules/textui/TextUI";
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
      <TextUI />
      <Progress />
      <CircularProgress />
      <SkillCheck />
      <Notifications />
      {isEnvBroswer() && <Dev />}
    </div>
  );
}

export default App;
