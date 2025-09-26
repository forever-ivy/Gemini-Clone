import GradientText from "../lib/GradientText";
import { useEffect, useState, useRef } from "react";
import { useLocalStorage } from "react-use";
import { promptStore } from "../store/prompt";
import { ResponseStore } from "../store/response";
import { useGeminiAPI } from "../config/gemini_2.5pro";
import ChatList from "../components/ChatList";

const ChatPage = () => {
  // 使用 useLocalStorage 管理聊天状态
  const [hasStartedChat, setHasStartedChat] = useLocalStorage(
    "hasStartedChat",
    false
  );
  const [firstsend, setFirstSend] = useState(!hasStartedChat);
  const [isDark, setIsDark] = useState(false);
  const [isAnswer, setIsAnswer] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const { setPrompt } = promptStore();
  const { callAPI } = useGeminiAPI();
  const { answerResponse, thoughtResponse } = ResponseStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (thoughtResponse) {
      console.log("thoughtResponse:", thoughtResponse);
    }
  }, [thoughtResponse]);

  useEffect(() => {
    if (answerResponse) {
      console.log("answerResponse:", answerResponse);
    }
  }, [answerResponse]);

  const handleClick = async (promptArg: string) => {
    if (!promptArg.trim()) {
      return;
    }

    // 更新聊天状态
    if (firstsend) {
      setFirstSend(false);
      setHasStartedChat(true);
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsAnswer(false);
      setInputValue("");
      console.log("API调用成功");
      await callAPI(promptArg, controller.signal);
      console.log("Api end");
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Request aborted") {
        console.log("API 请求已被中止");
      } else {
        console.error("调用失败:", error);
      }
    } finally {
      setIsAnswer(true);
      abortControllerRef.current = null;
    }
  };

  // 停止函数
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("正在停止生成...");
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 页面加载时读取保存的主题
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDark(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="flex-1 h-full w-auto flex flex-col bg-base-100 ">
      <div className="navbar bg-base-100 shadow-sm ">
        <div className="flex-1 ml-4">
          <p className="text-2xl text-base-content font-apple">Gemini</p>
        </div>
        <div className=" inline-flex justify-center items-center ">
          <div className="mr-4">
            <label className="flex cursor-pointer gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-base-content"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isDark}
                onChange={toggleTheme}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-base-content"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </label>
          </div>
          <div className="flex gap-2 ">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar mr-4"
              >
                <div className="w-10 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 p-0.5 ">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col items-center justify-center mb-[150px]">
        {firstsend ? (
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={5}
            showBorder={false}
            className="custom-class text-[150px] z-0 pointer-events-none select-none"
          >
            Helo , Ziggy !
          </GradientText>
        ) : (
          <ChatList />
        )}
      </div>

      <div
        className={
          firstsend
            ? "fixed bottom-[65px] left-[var(--sidebar-width)] right-0 flex items-center justify-center bg-transparent pointer-events-none z-10"
            : "fixed bottom-[65px] left-[var(--sidebar-width)] right-0 flex items-center justify-center bg-transparent pointer-events-none z-10"
        }
      >
        <div className="relative pointer-events-auto">
          <div className="w-[800px] bg-base-100 border border-base-300 rounded-2xl shadow-sm px-4 pt-4 pb-16 relative">
            <textarea
              placeholder="Ask Gemini"
              className="w-full bg-transparent outline-none resize-none overflow-y-auto text-base-content placeholder-base-content/50 text-lg leading-6 max-h-[180px] min-h-[60px] px-2 pb-2"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 240) + "px";
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // 先更新 prompt，再调用 API（传入当前输入）
                  setPrompt(inputValue);
                  handleClick(inputValue);
                }
              }}
            />

            {/* 工具栏 + 发送/停止 按钮 - 固定在底部 */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              {/* 左侧：+ 与功能标签 */}
              <div className="flex items-center gap-2">
                {/* + 图标 */}
                <button
                  type="button"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-base-200 hover:bg-base-300 text-base-content transition"
                  aria-label="Add"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 6v12M6 12h12" />
                  </svg>
                </button>

                {/* 标签按钮（示意，点击行为可后续接入） */}
                <button className="px-3 py-1 rounded-full bg-base-200 hover:bg-base-300 text-sm text-base-content/80 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-brain-cog-icon lucide-brain-cog size-5 inline-flex mr-2"
                  >
                    <path d="m10.852 14.772-.383.923" />
                    <path d="m10.852 9.228-.383-.923" />
                    <path d="m13.148 14.772.382.924" />
                    <path d="m13.531 8.305-.383.923" />
                    <path d="m14.772 10.852.923-.383" />
                    <path d="m14.772 13.148.923.383" />
                    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771" />
                    <path d="M17.998 5.125a4 4 0 0 1 2.525 5.771" />
                    <path d="M19.505 10.294a4 4 0 0 1-1.5 7.706" />
                    <path d="M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516" />
                    <path d="M4.5 10.291A4 4 0 0 0 6 18" />
                    <path d="M6.002 5.125a3 3 0 0 0 .4 1.375" />
                    <path d="m9.228 10.852-.923-.383" />
                    <path d="m9.228 13.148-.923.383" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Deep Research
                </button>
                <button className="px-3 py-1 rounded-full bg-base-200 hover:bg-base-300 text-sm text-base-content/80 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-brain-cog-icon lucide-brain-cog size-5 inline-flex mr-2"
                  >
                    <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
                    <path d="m6.2 5.3 3.1 3.9" />
                    <path d="m12.4 3.4 3.1 4" />
                    <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                  </svg>
                  Video
                </button>
                <button className="px-3 py-1 rounded-full bg-base-200 hover:bg-base-300 text-sm text-base-content/80 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-images-icon lucide-images inline-flex mr-2 size-5"
                  >
                    <path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" />
                    <path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
                    <circle cx="13" cy="7" r="1" fill="currentColor" />
                    <rect x="8" y="2" width="14" height="14" rx="2" />
                  </svg>
                  Photo
                </button>
              </div>

              {/* 右侧：发送/停止按钮 */}
              <div className="flex items-center">
                {isAnswer ? (
                  <button
                    type="button"
                    onClick={() => handleClick()}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-primary text-primary-content hover:opacity-90 transition shadow-sm mr-4"
                    aria-label="Send"
                    title="Send (Enter)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-sm mr-4"
                    aria-label="Stop"
                    title="Stop generating"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
