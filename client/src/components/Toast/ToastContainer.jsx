import { useSelector, useDispatch } from "react-redux";
import Toast from "./Toast";
import { removeToast } from "../../redux/features/toastSlice";

const ToastContainer = () => {
  const toasts   = useSelector((state) => state.toast.toasts);
  const dispatch = useDispatch();

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position:       "fixed",
        top:            "76px",   /* clears the navbar */
        left:           "50%",
        transform:      "translateX(-50%)",
        zIndex:         9999,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            "8px",
        pointerEvents:  "none",
        width:          "max-content",
        maxWidth:       "calc(100vw - 32px)",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto", width: "100%" }}>
          <Toast
            message={t.message}
            type={t.type}
            onRemove={() => dispatch(removeToast(t.id))}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;