import React, { useState, useEffect } from "react";
import verilogIcon from "../icons/verilog.png";
import systemVerilogIcon from "../icons/svicon2.png";
import fileIconNew from "../icons/fileIconNew.png";

interface Props {
  items: any[];
  setEditorFromFile: (item: any) => void;
}

const Sidebar: React.FC<Props> = ({ items, setEditorFromFile }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  const renderFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "v":
        return (
          <img
            src={verilogIcon}
            alt="Verilog"
            style={{
              paddingTop: "8px",
              width: "24px",
              height: "24px",
              objectFit: "contain",
              paddingLeft: "4px",
            }}
          />
        );
      case "sv":
        return (
          <img
            src={systemVerilogIcon}
            alt="SystemVerilog"
            style={{
              paddingTop: "8px",
              paddingLeft: "4px",
              height: "24px",
              width: "24px",
              objectFit: "cover",
            }}
          />
        );
      default:
        return (
          <img
            src={fileIconNew}
            alt="File"
            style={{ paddingTop: "12px", height: "24px", width: "24px" }}
          />
        );
    }
  };

  if (items.length === 0) {
    return <div>No items to display</div>;
  }

  return (
    <div>
      {items.map((item: any, index: number) => (
        <div
          key={index}
          style={{ padding: "2px", fontSize: "14px" }}
          onClick={() => setEditorFromFile(item)}
        >
          <li
            style={{
              listStyleType: "none",
              display: "flex",
              alignItems: "center",
              backgroundColor: "transparent",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              {renderFileIcon(item.name)}
              <p>{item.name.replace("Name: ", "")}</p>
            </div>
          </li>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
