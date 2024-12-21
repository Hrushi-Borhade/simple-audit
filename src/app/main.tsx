import ReactDOM from "react-dom/client";

import "@/index.css";
// import { router } from "./router";
// import { store } from "./store";
import {Component} from "@/pages/index"
const root = document.getElementById("application") as HTMLDivElement;

root.classList.add("flex", "flex-col", "h-[100vh]", "bg-background-primary");

// const FallbackElement: FC = () => {
//   return <p>loading....</p>;
// };

ReactDOM.createRoot(root).render(
  <>
    <Component/>
  </>
);
