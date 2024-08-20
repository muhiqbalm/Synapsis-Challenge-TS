import React, { useState } from "react";
import Droppable from "@/components/droppable";
import Draggable from "@/components/draggable";
import { DndContext } from "@dnd-kit/core";
import styles from "./index.module.css";
import { Checkbox, Col, Input, Row } from "antd";

const DragAndDropExample: React.FC = () => {
  const containers = ["A", "B", "C"];
  const items = [
    { id: "item-1", label: "Drag me 1", color: "#007bff" },
    { id: "item-2", label: "Drag me 2", color: "#28a745" },
    { id: "item-3", label: "Drag me 3", color: "#dc3545" },
  ];

  const [parentMap, setParentMap] = useState<{ [key: string]: string | null }>({
    "item-1": null,
    "item-2": null,
    "item-3": null,
  });

  const [input, setInput] = useState<string>("");
  const [checkedList, setCheckedList] = useState<string[]>([]);

  return (
    <Row gutter={[20, 20]} align="middle" justify="center" className="!m-0">
      <Col span={24}>
        <DndContext onDragEnd={handleDragEnd}>
          <div className={styles["container"]}>
            {items.map((item) =>
              parentMap[item.id] === null ? (
                <Draggable key={item.id} id={item.id}>
                  <div
                    className={styles["draggable"]}
                    style={{ backgroundColor: item.color }}
                  >
                    {item.label}
                  </div>
                </Draggable>
              ) : null
            )}

            {containers.map((id) => (
              <Droppable key={id} id={id}>
                <div className={styles["droppable"]}>
                  {getDraggableItemForContainer(id) || "Drop here"}
                </div>
              </Droppable>
            ))}
          </div>
        </DndContext>
      </Col>

      <Col span={12}>
        <Input
          placeholder="Type something here . . ."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </Col>

      <Col>
        <Checkbox.Group
          value={checkedList}
          options={["Apple", "Pear", "Orange"]}
          onChange={(list) => setCheckedList(list)}
        />
      </Col>
    </Row>
  );

  function handleDragEnd(event: { active: any; over: any }) {
    const { active, over } = event;

    setParentMap((prev) => {
      const currentActiveParent = prev[active.id];
      const currentOverParent = over
        ? Object.keys(prev).find((key) => prev[key] === over.id)
        : null;

      if (over) {
        // Tukar posisi jika ada item lain di dalam droppable target
        if (currentOverParent) {
          return {
            ...prev,
            [active.id]: over.id,
            [currentOverParent]: currentActiveParent,
          };
        }

        // Jika tidak ada item lain di dalam droppable target, pindahkan active ke droppable tersebut
        return { ...prev, [active.id]: over.id };
      }

      // Jika di-drop di luar droppable, item tidak memiliki parent
      return { ...prev, [active.id]: null };
    });
  }

  function getDraggableItemForContainer(containerId: string) {
    const itemId = Object.keys(parentMap).find(
      (key) => parentMap[key] === containerId
    );
    const item = items.find((i) => i.id === itemId);

    if (item) {
      return (
        <Draggable key={item.id} id={item.id}>
          <div
            className={styles["draggable"]}
            style={{ backgroundColor: item.color }}
          >
            {item.label}
          </div>
        </Draggable>
      );
    }
    return null;
  }
};

export default DragAndDropExample;
