import { message } from "antd";

// Custom wrapper function with default configurations
const flashMessage = (
  content: string,
  type: "info" | "success" | "error" | "warning" = "info",
  duration: number = 1.5
): void => {
  message.destroy(); // Clear old messages
  message[type]({ content, duration }); // Show new message with default configurations
};

export default flashMessage;
