import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";

import Grid from "./Grid";
import Module from "./Module";
import { GUTTER_SIZE } from "../constants";

const Page = () => {
  const [modules, setModules] = useState([
    { id: 1, coord: { x: 1, y: 80, w: 2, h: 200 } },
    { id: 2, coord: { x: 5, y: 0, w: 3, h: 100 } },
    { id: 3, coord: { x: 4, y: 310, w: 3, h: 200 } },
  ]);

  const minGridHeight = 500;
  const containerRef = useRef<HTMLDivElement>();
  const [containerHeight, setContainerHeight] = useState<number | undefined>();

  useEffect(() => {
    if (containerRef.current) {
      const newHeight = Math.max(
        minGridHeight,
        Math.max(...modules.map(({ coord: { y, h } }) => y + h)) +
          GUTTER_SIZE * 2
      );
      setContainerHeight(newHeight);
    }
  }, [modules]);

  const handleModuleMove = (moduleId: number, newX: number, newY: number) => {
    const newHeight = Math.max(
      minGridHeight,
      Math.max(...modules.map(({ coord: { y, h } }) => y + h)) + GUTTER_SIZE * 2
    );
    setContainerHeight(newHeight);
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module.id === moduleId) {
          return { ...module, coord: { ...module.coord, x: newX, y: newY } };
        }
        return module;
      })
    );
    return modules;
  };

  const [, drop] = useDrop({ accept: "module" });
  drop(containerRef);

  return (
    <Box
      ref={containerRef}
      position="relative"
      width={1024}
      height={containerHeight ?? "auto"} // Set the height of the container
      margin="auto"
      sx={{
        overflow: "hidden",
        outline: "1px dashed #ccc",
      }}
    >
      <Grid height={containerHeight ?? 0} />{" "}
      {/* Ensure Grid receives the correct height */}
      {modules.map((module) => (
        <Module
          key={module.id}
          data={module}
          onMove={handleModuleMove}
          allModules={modules}
        />
      ))}
    </Box>
  );
};

export default React.memo(Page);
