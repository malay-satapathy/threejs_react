import React from "react";
import Badge from "./components/Badge";
import Box3D from "./components/Box3D";
import LuciferMorningstar from "./components/LuciferMorningstar";

/*
1. Enable <Box3D> display 3D Box created using mesh, geometry and material
2. Enable <LuciferMorningstar> to display Lucifer Morningstar Model created using .GLB
 */
function App() {
  return (
    <div>
      <Badge />
      <LuciferMorningstar />
    </div>
  );
}

export default App;
