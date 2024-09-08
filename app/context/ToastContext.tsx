"use client";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={false} toastOptions={{
        style: {
          right: "5px"
        }
      }}/>
    </div>
  );
};

export default ToasterContext;
