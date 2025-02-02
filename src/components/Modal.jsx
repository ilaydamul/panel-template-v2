import { Dialog } from "primereact/dialog";
import React from "react";

export default function Modal({
  state,
  setState,
  title,
  big,
  small,
  children,
}) {
  return (
    <>
      <Dialog
        header={title}
        draggable={false}
        visible={state}
        style={
          big
            ? { maxWidth: "95rem", width: "100%", margin: "1rem" }
            : small
            ? { maxWidth: "30rem", width: "100%", margin: "1rem" }
            : { maxWidth: "45rem", width: "100%", margin: "1rem" }
        }
        onHide={() => {
          if (!state) return;
          setState(false);
        }}
      >
        {children}
      </Dialog>
    </>
  );
}