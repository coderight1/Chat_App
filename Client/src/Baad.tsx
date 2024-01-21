import React, { useState, useEffect, useRef } from "react";
import music from "./iphone-sms-tone-original-mp4-5732.mp3";

interface MessageData {
  id: number;
  room: string;
  author: string;
  message: string;
  time: string;
}

interface ChatProps {
  socket: any; // Change the type accordingly
  username: string;
  room: string;
}

const Chat: React.FC<ChatProps> = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);
  const notification = new Audio(music);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: MessageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentMessage,
        time: `${(new Date(Date.now()).getHours() % 12)}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };

      await socket.emit("send_message", messageData);

      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      notification.play();
    }
  };

  useEffect(() => {
    const handleReceivedMsg = (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceivedMsg);

    return () => {
      socket.off("receive_message", handleReceivedMsg);
    };
  }, [socket]);

  const containRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containRef.current) {
      containRef.current.scrollTop = containRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <>
      <div className="chat_container">
        <h1>Welcome {username}</h1>
        <div className="chat_box">
          <div
            className="auto-scrolling-div"
            ref={containRef}
            style={{
              height: "450px",
              overflowY: "auto",
              border: "2px solid yellow",
            }}
          >
            {messageList.map((data) => (
              <div
                key={data.id}
                className="message_content"
                id={username === data.author ? "you" : "other"}
              >
                <div>
                  <div
                    className="msg"
                    id={username === data.author ? "y" : "b"}
                  >
                    <p>{data.message}</p>
                  </div>
                  <div className="msg_detail">
                    <p>{data.author}</p>
                    <p>{data.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat_body">
            <input
              value={currentMessage}
              type="text"
              placeholder="Type your message"
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                e.key === "Enter" && sendMessage();
              }}
            ></input>
            <button onClick={sendMessage}>&#9658;</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
