import React from "react";

// 聊天消息数据类型
export interface ChatMessage {
  id: string;
  content: string | React.ReactNode;
  sender: "user" | "ai";
}
