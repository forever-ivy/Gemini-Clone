import React, { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "react-use";
import VirtualListDynamic from "../lib/virtuallist2";
import renderChatMessage from "../lib/chatmessage";
import type { ChatMessage } from "../lib/chatmessage";
import { promptStore } from "../store/prompt";
import { ResponseStore } from "../store/response";
import { LoadingStore } from "../store/loading";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatList: React.FC = () => {
  const initialMessages: ChatMessage[] = [
    // {
    //   id: `ai-welcome-${Date.now()}`,
    //   content: (
    //     <Markdown remarkPlugins={[remarkGfm]}>
    //       {`**欢迎！** 我可以帮你解释知识点、写代码、生成内容等。\n\n- 直接输入你的问题即可开始\n- 支持 Markdown 展示（代码块、列表、表格等）`}
    //     </Markdown>
    //   ),
    //   sender: "ai" as const,
    // },
    // {
    //   id: `user-example-${Date.now()}`,
    //   content: "为什么在冬天能看见自己的呼吸？",
    //   sender: "user" as const,
    // },
    // {
    //   id: `ai-example-${Date.now()}`,
    //   content: (
    //     <Markdown remarkPlugins={[remarkGfm]}>
    //       {`当然可以！当外界温度较低时，呼出的**湿热空气**遇冷会迅速降温，水汽无法继续以气体形式存在，便会**凝结成微小水滴**，看起来像一团"白雾"。\n\n**要点总结：**\n- 冷空气含水能力弱\n- 湿热空气降温后水汽凝结\n- 形成可见的微小水滴（雾）`}
    //     </Markdown>
    //   ),
    //   sender: "ai" as const,
    // },
  ];

  // 使用 useLocalStorage 管理聊天消息
  const [storedMessages, setStoredMessages] = useLocalStorage<any[]>(
    "chatMessages",
    []
  );

  // 初始化消息状态
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (storedMessages && storedMessages.length > 0) {
      // 从存储中恢复消息，重新渲染 Markdown
      return storedMessages.map((msg: any) => ({
        ...msg,
        content:
          msg.sender === "ai" && typeof msg.content === "string" ? (
            <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
          ) : (
            msg.content
          ),
      }));
    }
    return initialMessages;
  });

  const { contextprompt } = promptStore();
  const { answerResponse, setAnswerResponse } = ResponseStore();
  const { isLoading, setIsLoading } = LoadingStore();
  const waitingForResponseRef = useRef<boolean>(false);

  // 保存消息到 localStorage 的辅助函数
  const saveMessages = (msgs: ChatMessage[]) => {
    const serializedMessages = msgs.map((msg) => ({
      ...msg,
      content:
        typeof msg.content === "string"
          ? msg.content
          : msg.sender === "ai" && React.isValidElement(msg.content)
          ? // 如果是React元素，提取其中的文本内容
            msg.content.props?.children
          : msg.content,
    }));
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
    <VirtualListDynamic
      containerHeight={540}
      estimatedHeight={120}
      data={messages}
      renderItem={renderChatMessage}
      overscan={3}
    />
  );
};

export default ChatList;
