import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchUser } from "./rtk/user-rtk/user-thunk";
import Chatbox from "./components/chatBoxcomp";
import {
  addChat,
  closeChat,
  toggleMinimizeChat,
} from "./rtk/chat-rtk/chat-slice";

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dispatch = useDispatch();
  const { users, meta } = useSelector((state) => state.user);
  const { activeChats } = useSelector((state) => state.chat);
  const observerRef = useRef(null);
  const userListRef = useRef(null);

  // Load selected chat users from localStorage
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("activeChats"));
    if (savedChats) {
      savedChats.forEach((chat) => {
        dispatch(addChat(chat.user));
      });
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUser("v1/users?page=1"));
  }, [dispatch]);

  const fetchMoreUsers = () => {
    if (meta?.pagination.links.next) {
      const nextPageUrl = meta.pagination.links.next.replace(
        "https://gorest.co.in/public/",
        ""
      );
      dispatch(fetchUser(nextPageUrl));
    }
  };

  const handleUserClick = (user) => {
    dispatch(addChat(user)); // Dispatch action to add a new chat

    // Store active chats in localStorage
    const updatedChats = [...activeChats, { user }];
    localStorage.setItem("activeChats", JSON.stringify(updatedChats));
  };

  const toggleMinimizeChatHandler = (id) => {
    dispatch(toggleMinimizeChat(id)); // Dispatch action to toggle minimize

    // Store updated chats in localStorage
    const updatedChats = activeChats.map((chat) =>
      chat.user.id === id ? { ...chat, minimized: !chat.minimized } : chat
    );
    localStorage.setItem("activeChats", JSON.stringify(updatedChats));
  };

  const closeChatHandler = (id) => {
    dispatch(closeChat(id)); // Dispatch action to close the chat

    // Remove the chat from localStorage
    const updatedChats = activeChats.filter((chat) => chat.user.id !== id);
    localStorage.setItem("activeChats", JSON.stringify(updatedChats));
  };

  const handleObserver = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      fetchMoreUsers();
    }
  };

  const handleScroll = () => {
    if (userListRef.current.scrollTop > 200) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "100px",
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver, users]);

  useEffect(() => {
    const userList = userListRef.current;
    if (userList) {
      userList.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (userList) {
        userList.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (userListRef.current) {
      userListRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex max-h-screen relative">
      {/* Sidebar */}
      <div
        ref={userListRef}
        className={`border pt-12 bg-gray-100 overflow-y-auto custom-scrollbar z-50 transition-width duration-500 
          ${isOpen ? "w-80" : "w-22"}
          ${isOpen ? "sm:relative sm:w-80 fixed  top-0 left-0" : "sm:w-22"}`}
      >
        {users.map((user, index) => (
          <div
            key={index}
            onClick={() => handleUserClick(user)}
            className="flex items-center gap-4 hover:bg-gray-300 cursor-pointer border p-4"
          >
            <h3 className="text-xl bg-gray-400 rounded-full text-white h-8 w-8 text-center place-self-center">
              {user.name ? user.name[0] : ""}
            </h3>
            <h4 className={`text-base ${isOpen ? "block" : "hidden"}`}>
              {user.name}
            </h4>
          </div>
        ))}
        <div ref={observerRef}></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-0 left-0 p-2 text-black"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="m4.3 2.9l12.8 12.8l-1.4 1.4L2.9 4.3z"
              />
              <path
                fill="currentColor"
                d="M17.1 4.3L4.3 17.1l-1.4-1.4L15.7 2.9z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M220 128a4 4 0 0 1-4 4H40a4 4 0 0 1 0-8h176a4 4 0 0 1 4 4M40 68h176a4 4 0 0 0 0-8H40a4 4 0 0 0 0 8m176 120H40a4 4 0 0 0 0 8h176a4 4 0 0 0 0-8"
              />
            </svg>
          )}
        </button>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-2 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 w-12 h-12"
        >
          ↑
        </button>
      )}

      {/* Chatboxes */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="flex fixed bottom-4 right-4 space-x-4">
          {activeChats.map((chat) => (
            <div
              key={chat.user.id}
              className="w-72 bg-white shadow-lg border rounded-md"
            >
              <div
                className={`${
                  chat.minimized ? "h-14" : "h-96 w-72"
                } flex flex-col border bg-gray-200`}
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between bg-gray-300 p-2 cursor-pointer">
                  <span className="text-lg font-bold">{chat.user.name}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleMinimizeChatHandler(chat.user.id)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      _
                    </button>
                    <button
                      onClick={() => closeChatHandler(chat.user.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Chat Content */}
                {!chat.minimized && (
                  <div className="flex-1 p-2 overflow-y-auto">
                    <Chatbox selectedUser={chat.user} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
