import React from "react";
import { Button } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";

function SelectDisplayType({ setMainBodyDisplay }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: "larger",
        alignItems: "center",
        padding: "6px",
      }}
    >
      הצג לפי:
      <div style={{ padding: "5px" }} dir="ltr">
        <ButtonGroup aria-label="Basic example">
          <Button
            onClick={() => {
              setMainBodyDisplay("map");
            }}
            variant="primary"
          >
            מפה
          </Button>
          <Button
            onClick={() => {
              setMainBodyDisplay("locations");
            }}
            variant="primary"
          >
            רשימת כתובות
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default SelectDisplayType;
