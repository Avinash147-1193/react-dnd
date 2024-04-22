// Module.tsx

import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useDrag, useDragDropManager } from "react-dnd";
import { useRafLoop } from "react-use";

import ModuleInterface from "../types/ModuleInterface";
import { moduleX2LocalX, moduleY2LocalY, moduleW2LocalWidth } from "../helpers";
import { COLUMN_WIDTH, CONTAINER_WIDTH, GUTTER_SIZE } from "../constants";

type ModuleProps = {
  data: ModuleInterface;
  onMove: (moduleId: number, newX: number, newY: number) => ModuleInterface[];
  allModules: ModuleInterface[];
};

const Module = (props: ModuleProps) => {
  const {
    data: {
      id,
      coord: { x, y, w, h },
    },
    onMove,
  } = props;

  const dndManager = useDragDropManager();
  const initialPosition = useRef<{ top: number; left: number }>();

  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: moduleY2LocalY(y),
    left: moduleX2LocalX(x),
  });

  const [modulesArray, setModulesArray] = useState<ModuleInterface[]>();
  //setModulesArray(allModules);
  const [stop, start] = useRafLoop(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();

    if (!initialPosition.current || !movement) {
      return;
    }
    let newX =
      Math.round((initialPosition.current.left + movement.x) / COLUMN_WIDTH) *
        COLUMN_WIDTH +
      GUTTER_SIZE;
    let newY = initialPosition.current.top + movement.y;
    if (newX < 0 || newX + moduleW2LocalWidth(w) > CONTAINER_WIDTH) return;
    if (newY < 0) return;
    const collisionDetected = checkCollision(
      newX,
      newY,
      w,
      h,
      id,
      modulesArray ?? []
    );
    if (!collisionDetected) {
      setPosition({
        top: newY,
        left: newX,
      });
    } else {
      const adjustedPosition = adjustPosition(
        newX,
        newY,
        w,
        h,
        modulesArray ?? []
      );
      setPosition(adjustedPosition);
    }

    onMove(id, position.left, position.top);
  }, false);

  const checkCollision = (
    newX: number,
    newY: number,
    moduleWidth: number,
    moduleHeight: number,
    moduleIdToCheck: number,
    allModules: ModuleInterface[]
  ): boolean => {
    for (const module of allModules) {
      if (module.id === moduleIdToCheck) continue;

      const moduleX = moduleX2LocalX(module.coord.x);
      const moduleY = moduleY2LocalY(module.coord.y);
      const moduleRightX = moduleX + moduleW2LocalWidth(module.coord.w);
      const moduleBottomY = moduleY + module.coord.h;

      const draggedModuleRightX = newX + moduleW2LocalWidth(moduleWidth);
      const draggedModuleBottomY = newY + moduleHeight;

      if (
        newX < moduleRightX &&
        draggedModuleRightX > moduleX &&
        newY < moduleBottomY &&
        draggedModuleBottomY > moduleY
      ) {
        return true;
      }
    }
    return false;
  };

  const adjustPosition = (
    newX: number,
    newY: number,
    moduleWidth: number,
    moduleHeight: number,
    allModules: ModuleInterface[]
  ) => {
    let adjustedX = newX;
    let adjustedY = newY;

    for (const module of allModules) {
      if (module.id === id) continue; // Skip current module

      const moduleX = moduleX2LocalX(module.coord.x);
      const moduleY = moduleY2LocalY(module.coord.y);
      const moduleRightX = moduleX + moduleW2LocalWidth(module.coord.w);
      const moduleBottomY = moduleY + module.coord.h;

      if (
        adjustedX < moduleRightX &&
        adjustedX + moduleWidth > moduleX &&
        adjustedY < moduleBottomY &&
        adjustedY + moduleHeight > moduleY
      ) {
        if (adjustedX < moduleX) {
          adjustedX = moduleX - moduleWidth - GUTTER_SIZE;
        } else {
          adjustedX = moduleRightX + GUTTER_SIZE;
        }
        if (adjustedY < moduleY) {
          adjustedY = moduleY - moduleHeight - GUTTER_SIZE;
        } else {
          adjustedY = moduleBottomY + GUTTER_SIZE;
        }
      }
    }

    return { top: adjustedY, left: adjustedX };
  };

  const [, drag] = useDrag(
    () => ({
      type: "module",
      item: () => {
        initialPosition.current = { ...position };
        const newModulesPositions = onMove(id, position.left, position.top);
        setModulesArray(newModulesPositions);
        start();
        return { id };
      },
      end: () => {
        stop();
        const newX = position.left;
        const newY = position.top;

        const newModulesPositions = onMove(id, newX, newY);
        setModulesArray(newModulesPositions);
      },
    }),
    [position, onMove]
  );

  return (
    <Box
      ref={drag}
      display="flex"
      position="absolute"
      border={1}
      borderColor="grey.500"
      padding="10px"
      bgcolor="rgba(0, 0, 0, 0.5)"
      top={position.top}
      left={position.left}
      width={moduleW2LocalWidth(w)}
      height={h}
      sx={{
        transitionProperty: "top, left",
        transitionDuration: "0.1s",
        "& .resizer": {
          opacity: 0,
        },
        "&:hover .resizer": {
          opacity: 1,
        },
      }}
    >
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={40}
        color="#fff"
        sx={{ cursor: "move" }}
        draggable
      >
        <Box sx={{ userSelect: "none", pointerEvents: "none" }}>{id}</Box>
      </Box>
    </Box>
  );
};

export default React.memo(Module);
