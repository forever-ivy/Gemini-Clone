import { useState, useEffect } from "react";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      expanded ? "200px" : "72px"
    );
  }, [expanded]);

  return (
    <div
      className={`sidebar flex flex-col justify-between bg-base-200 h-full py-6 px-4 overflow-hidden transition-[width] duration-300 ease-in-out ${
        expanded ? "w-[200px]" : "w-[72px]"
      }`}
    >
      <div className="top space-y-3 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 ml-1"
          onClick={() => setExpanded(!expanded)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>

        <div
          className={`new-chat inline-flex items-center mt-2${
            expanded ? "gap-4 px-4" : "gap-0 px-2 justify-center"
          } py-2 bg-base-300 rounded-full text-sm text-base-content cursor-pointer transition-all duration-300 hover:bg-primary hover:text-primary-content`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          {expanded && (
            <span className="font-apple ml-3 text-[20px] ">New Chat</span>
          )}
        </div>

        <div className="recent flex flex-col">
          {expanded && (
            <p className="recent-title mt-6 mb-3 px-2 text-xs font-medium font-apple text-base-content/70">
              Recent
            </p>
          )}
          <div
            className={`recent-entry flex items-center ${
              expanded ? "gap-3 px-3" : "gap-0 px-2 justify-center"
            } py-2 rounded-full text-base-content cursor-pointer hover:bg-base-300 transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>

            {expanded && (
              <span className="font-apple whitespace-nowrap overflow-hidden text-ellipsis">
                What is react..
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bottom mt-auto flex flex-col gap-2">
        <div
          className={`bottom-item recent-entry flex items-center ${
            expanded ? "gap-3 px-4" : "gap-0 px-2 justify-center"
          } py-2 rounded-full text-base-content cursor-pointer hover:bg-base-300 transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>

          {expanded && <span className="font-apple">Help</span>}
        </div>

        <div
          className={`bottom-item recent-entry flex items-center ${
            expanded ? "gap-3 px-4" : "gap-0 px-2 justify-center"
          } py-2 rounded-full text-base-content cursor-pointer hover:bg-base-300 transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          {expanded && <span className="font-apple">Activity</span>}
        </div>

        <div
          className={`bottom-item recent-entry flex items-center ${
            expanded ? "gap-3 px-4" : "gap-0 px-2 justify-center"
          } py-2 rounded-full text-base-content cursor-pointer hover:bg-base-300 transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          {expanded && <span className="font-apple">Settings</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
