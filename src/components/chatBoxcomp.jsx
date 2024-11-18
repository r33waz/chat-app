import PropTypes from "prop-types";

function Chatbox({ selectedUser }) {
  return (
    <div className="h-80 w-full flex flex-col border">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-100">
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          {selectedUser?.avatar ? (
            <img
              src={
                selectedUser?.avatar ||
                selectedUser.name?.charAt(0).toUpperCase()
              }
              alt="User Avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <h3 className="text-xl bg-gray-400 rounded-full text-white h-8 w-8  text-center place-self-center">
              {selectedUser.name ? selectedUser.name[0] : ""}
            </h3>
          )}

          <div className="text-lg font-medium">{selectedUser.name}</div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Placeholder text for message area */}
        <div className="text-center text-gray-500">
          Start a conversation with {selectedUser.name}!
        </div>
      </div>

      {/* Input Area */}
      <div className=" border-t bg-white">
        <div className="flex items-center gap-2">
          {/* Input field */}
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder="Type a message..."
          />
          {/* Send Button (optional, does nothing) */}
          <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

Chatbox.propTypes = {
  selectedUser: PropTypes.object.isRequired,
};

export default Chatbox;
