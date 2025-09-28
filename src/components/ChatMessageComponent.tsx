import Lottie from "lottie-react";
import geminiAnimation from "../assets/7128590d/gemini-logo.json";
import React from "react";
import { LoadingStore } from "../store/loading";
import type { ChatMessage } from "../types/chat";

const ChatMessageComponent: React.FC<{ item: ChatMessage }> = ({ item }) => {
  const { isLoading } = LoadingStore();

  // 判断是否是加载消息（AI消息且内容为空且正在加载）
  const isLoadingMessage = item.sender === "ai" && !item.content && isLoading;

  return (
    <div className="flex gap-3 p-4  justify-start ">
      {item.sender === "ai" && (
        <div className="relative w-8 h-8 flex-shrink-0 mt-[20px] mr-[6px]">
          {isLoadingMessage ? (
            //loading animation (true)
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 shadow-md w-[42px] h-[42px] ml-[2.5px] mt-[2.5px]" />
              <Lottie
                animationData={geminiAnimation}
                loop={true}
                autoplay={true}
                speed={4}
                style={{ width: 48, height: 48 }}
              />
            </>
          ) : (
            //static gemini logo (false)
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 shadow-md w-[42px] h-[42px] ml-[2.5px] mt-[2.5px]" />
              <Lottie
                animationData={geminiAnimation}
                loop={false}
                autoplay={false}
                speed={2}
                style={{ width: 48, height: 48 }}
              />
            </>
          )}
        </div>
      )}

      <div
        className={`p-3 break-words   ${
          item.sender === "user"
            ? "bg-blue-500 text-white ml-auto rounded-bl-2xl rounded-tl-2xl rounded-br-2xl"
            : "text-base-content rounded-br-2xl rounded-tl-2xl rounded-tr-2xl"
        }`}
      >
        {isLoadingMessage ? (
          <div className="flex items-center font-apple text-[20px] gap-2 mt-[16px] ">
            <span>Gemini Thinking</span>
            <div className="flex gap-1 mt-[1.5px]">
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce ml-[2px]" />
              <div
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce ml-[2px]"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce ml-[2px]"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        ) : (
          <div className="">
            {item.sender === "ai" && (
              <>
                <div className="collapse bg-base-100 ml-0">
                  <input type="checkbox" />
                  <div className="collapse-title font-apple text-[20px] text-left pl-0 flex items-center  ">
                    Explain the logic
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-down transition-transform duration-200 ml-2 size-5"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                  <div className="collapse-content font-mono text-sm text-left pl-0">
                    Click the "Sign Up" button in the top right corner and
                    follow the registration process.
                  </div>
                </div>
              </>
            )}
            <div
              className={`font-apple text-lg leading-loose ${
                item.sender === "user" ? "" : "pt-[20px]"
              }`}
            >
              {item.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageComponent;
