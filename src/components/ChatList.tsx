import React, { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "react-use";
import VirtualListDynamic from "./virtuallistDynamic";
import ChatMessageComponent from "./ChatMessageComponent";
import type { ChatMessage } from "../types/chat";
import { promptStore } from "../store/prompt";
import { ResponseStore } from "../store/response";
import { LoadingStore } from "../store/loading";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatList: React.FC = () => {
  const initialMessages: ChatMessage[] = [];

  //use localstorage to store chat messages ,avoid refresh to let the message disappear
  const [storedMessages, setStoredMessages] = useLocalStorage<ChatMessage[]>(
    "chatMessages",
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (storedMessages && storedMessages.length > 0) {
      // if there is message in localstorage ,return the message with markdown
      return storedMessages.map((msg: ChatMessage) => ({
        ...msg,
        content:
          msg.sender === "ai" && typeof msg.content === "string" ? (
            <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
          ) : (
            msg.content
          ),
      }));
    }

    //if not , return empty ,to fit Ts's requirements,return the type of <ChatMessage>
    return initialMessages;
  });

  //use zustand
  const { contextprompt } = promptStore();
  const { answerResponse, setAnswerResponse } = ResponseStore();
  const { isLoading, setIsLoading } = LoadingStore();

  const waitingForResponseRef = useRef<boolean>(false);

  // 保存消息到 localStorage 的辅助函数
  const saveMessages = (msgs: ChatMessage[]) => {
    const serializedMessages = msgs.map((msg) => {
      const { content, sender } = msg;
      let finalContent = content;

      // 检查是否是AI消息，并且内容是一个包含 children prop 的React组件
      if (
        sender === "ai" &&
        React.isValidElement<{ children: React.ReactNode }>(content)
      ) {
        // 如果是，就从组件的props中提取原始的文本内容
        finalContent = content.props.children;
      }

      // 对于其他情况（如用户消息或AI的加载占位符），content本身就是字符串，无需处理

      return {
        ...msg,
        content: finalContent,
      };
    });
    setStoredMessages(serializedMessages);
  };

  // 处理用户输入
  useEffect(() => {
    if (contextprompt) {
      waitingForResponseRef.current = true;

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage?.content === contextprompt &&
          lastMessage?.sender === "user"
        ) {
          return prev;
        }

        const newMessages = [
          ...prev,
          {
            id: `user-${Date.now()}-${Math.random()}`,
            content: contextprompt,
            sender: "user" as const,
          },
          {
            id: `ai-loading-${Date.now()}-${Math.random()}`,
            content: "",
            sender: "ai" as const,
          },
        ];

        saveMessages(newMessages);
        return newMessages;
      });

      setAnswerResponse("");
      setTimeout(() => setIsLoading(true), 0);
    }
  }, [contextprompt, setAnswerResponse, setIsLoading]);

  // 处理 AI 回复
  useEffect(() => {
    if (answerResponse && waitingForResponseRef.current && isLoading) {
      setMessages((prev) => {
        const newMessages = [...prev];
        let lastAiPlaceholderIndex = -1;
        for (let i = newMessages.length - 1; i >= 0; i--) {
          if (newMessages[i].sender === "ai" && newMessages[i].content === "") {
            lastAiPlaceholderIndex = i;
            break;
          }
        }

        if (lastAiPlaceholderIndex !== -1) {
          newMessages[lastAiPlaceholderIndex] = {
            id: `ai-${Date.now()}-${Math.random()}`,
            content: (
              <Markdown remarkPlugins={[remarkGfm]}>{answerResponse}</Markdown>
            ),
            sender: "ai" as const,
          };
        }

        saveMessages(newMessages);
        return newMessages;
      });

      waitingForResponseRef.current = false;
      setTimeout(() => setIsLoading(false), 0);
    }
  }, [answerResponse, isLoading, setIsLoading]);

  return (
    <div className="flex flex-col h-full">
      <VirtualListDynamic
        data={messages}
        estimatedHeight={120}
        containerHeight={600}
        renderItem={(item) => <ChatMessageComponent item={item} />}
      />
    </div>
  );
};

export default ChatList;
