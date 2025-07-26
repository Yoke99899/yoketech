export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.innerText = message;

  const colors = {
    success: "#10b981", // green
    error: "#ef4444",   // red
    info: "#3b82f6",    // blue
  };

  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: colors[type] || "#333",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: 9999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    opacity: 1,
    transition: "all 0.3s ease",
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = "translateX(-50%) translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
