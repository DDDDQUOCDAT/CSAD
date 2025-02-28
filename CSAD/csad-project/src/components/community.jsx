import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase/firebase";
import { ref, get, update, onValue, remove } from "firebase/database";
import { useTheme } from "@mui/material/styles";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Zoom,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  IconButton
} from "@mui/material";
import { green } from "@mui/material/colors";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import { serverTimestamp, push } from "firebase/database";
import "simplebar/dist/simplebar.min.css";
import "./chat.css";
import SendIcon from "@mui/icons-material/send";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import PersonIcon from "@mui/icons-material/Person";
const Request = ({ setFriends }) => {
  const [requests, setRequests] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const requestRef = ref(db, `Users/${currentUser.uid}/friendRequests`);
    get(requestRef).then((snapshot) => {
      if (snapshot.exists()) {
        setRequests(Object.keys(snapshot.val()));
      } else {
        setRequests([]);
      }
    });
  }, [currentUser]);

  const acceptRequest = async (username) => {
    if (!currentUser) return;

    try {
      const usersRef = ref(db, "Users");
      const usersSnapshot = await get(usersRef);
      if (!usersSnapshot.exists()) return toast.error("User not found!");

      const usersData = usersSnapshot.val();
      const friendEntry = Object.entries(usersData).find(
        ([uid, userData]) => userData.username === username
      );

      if (!friendEntry) return toast.error("User no longer exists!");
      const friendUid = friendEntry[0];

      const currentUserFriendsRef = ref(db, `Chats/${currentUser.uid}/friends`);
      const friendFriendsRef = ref(db, `Chats/${friendUid}/friends`);

      await update(currentUserFriendsRef, { [username]: true });
      await update(friendFriendsRef, { [currentUser.displayName]: true });

      const requestRef = ref(db, `Users/${currentUser.uid}/friendRequests/${username}`);
      await remove(requestRef);

      setRequests((prev) => prev.filter((req) => req !== username));
      setFriends((prev) => [...new Set([...prev, username])]);

      toast.success(`${username} added to your friends list!`);
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.");
    }
  };

  const declineRequest = async (username) => {
    if (!currentUser) return;

    try {
      const requestRef = ref(db, `Users/${currentUser.uid}/friendRequests/${username}`);
      await remove(requestRef);

      setRequests((prev) => prev.filter((req) => req !== username));

      toast.info(`You declined ${username}'s friend request.`);
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast.error("Failed to decline friend request.");
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography sx={{ color: "white", textAlign: "center", p: 2, fontSize: "18px" }}>
        Friend Requests
      </Typography>
      <Divider sx={{ bgcolor: "white" }} />

      <List sx={{ color: "white", width: "100%", height: "100%", overflowY: "auto" }}>
        {requests.length > 0 ? (
          requests.map((username) => (
            <div key={username}>
              <ListItem
                disablePadding
                sx={{
                  alignItems: "center",
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <ListItemButton>
                  <PersonIcon sx={{ color: "white", marginRight: 2 }} />
                  <ListItemText primary={username} />
                </ListItemButton>

                <IconButton
                  onClick={() => acceptRequest(username)}
                  sx={{ color: "green", marginRight: 1 }}
                >
                  <DoneIcon />
                </IconButton>

                {/* Decline Request */}
                <IconButton
                  onClick={() => declineRequest(username)}
                  sx={{ color: "red", marginRight: 2 }}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>
              <Divider sx={{ bgcolor: "white" }} />
            </div>
          ))
        ) : (
          <Typography sx={{ color: "white", textAlign: "center", p: 2 }}>
            No pending requests
          </Typography>
        )}
      </List>
    </Box>
  );
};


const ChatComponent = ({ selectedFriend }) => {
  const [friendUid, setFriendUid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatThreadRef = useRef(null);
  const currentUser = auth.currentUser;

  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const todayDate = `date_${dd}-${mm}-${yyyy}`;

  useEffect(() => {
    if (!currentUser || !selectedFriend) return;

    const usersRef = ref(db, `Users`);
    
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const foundUser = Object.entries(usersData).find(
          ([uid, userData]) => userData.username === selectedFriend
        );

        if (foundUser) {
          setFriendUid(foundUser[0]); 
        } else {
          console.warn("Friend UID not found.");
          setFriendUid(null);
        }
      }
    });
  }, [selectedFriend, currentUser]);

  useEffect(() => {
    if (!currentUser || !friendUid) return;

    const chatId =
      currentUser.uid < friendUid
        ? `${currentUser.uid}_${friendUid}`
        : `${friendUid}_${currentUser.uid}`;

    const chatRef = ref(db, `Chats/${chatId}/messages/${todayDate}`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesArray = Object.entries(snapshot.val()).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }

      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [currentUser, friendUid]);

  const scrollToBottom = () => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTo({
        top: chatThreadRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim() || !currentUser || !friendUid) return;

    const chatId =
      currentUser.uid < friendUid
        ? `${currentUser.uid}_${friendUid}`
        : `${friendUid}_${currentUser.uid}`;

    const chatRef = ref(db, `Chats/${chatId}/messages/${todayDate}`);

    const newMessage = {
      sender: currentUser.uid,
      text: message,
      timestamp: Date.now(),
    };

    await push(chatRef, newMessage);

    setMessage("");
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="w-full h-full mx-auto p-5 flex flex-col bg-[#0a192f] rounded-lg shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-bold text-white">{selectedFriend}</h1>
      </div>

      <SimpleBar className="h-[500px] p-3 overflow-y-auto custom-scrollbar" autoHide={false} scrollableNodeProps={{ ref: chatThreadRef }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end mb-3 ${msg.sender === currentUser.uid ? "justify-end" : "justify-start"}`}>
            {msg.sender !== currentUser.uid }
            <div className={`relative max-w-[60%] px-4 py-2 text-lg text-white rounded-lg break-words ${msg.sender === currentUser.uid ? "bg-blue-500 text-right rounded-br-none" : "bg-green-500 text-left rounded-bl-none"}`}>
              {msg.text}
            </div>
            {msg.sender === currentUser.uid }
          </div>
        ))}
      </SimpleBar>

      <form className="relative mt-3 w-full flex items-end">
        <textarea
          className="w-full h-[60px] text-lg text-white border border-[#1a3b5d] rounded-md outline-none p-3 pr-16 bg-[#0a2233] resize-none"
          autoComplete="off"
          autoFocus
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
        />
        <button type="submit" className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50" disabled={!message.trim()} onClick={sendMessage}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
};
const TabPanel = ({ children, value, index }) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={'action-tabpanel-${index}'}
    aria-labelledby={'action-tab-${index}'}
    sx={{ height: "95%" }}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </Typography>
);

const FriendsList = ({ friends, setFriends, onSelectFriend }) => {
  const [friendNames, setFriendNames] = useState({});
  const [friendUids, setFriendUids] = useState({});
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const userChatRef = ref(db, `Chats/${currentUser.uid}/friends`);

    const fetchFriends = async () => {
      try {
        const snapshot = await get(userChatRef);
        if (snapshot.exists()) {
          const friendDisplayNames = Object.keys(snapshot.val());

          const uids = {};
          await Promise.all(
            friendDisplayNames.map(async (displayName) => {
              try {
                const usersRef = ref(db, `Users`);
                const usersSnapshot = await get(usersRef);
                if (usersSnapshot.exists()) {
                  const usersData = usersSnapshot.val();
                  const foundUser = Object.entries(usersData).find(
                    ([uid, userData]) => userData.username === displayName
                  );
                  if (foundUser) {
                    uids[displayName] = foundUser[0];
                  }
                }
              } catch (error) {
                console.error(`Error fetching UID for ${displayName}:`, error);
              }
            })
          );

          setFriendUids(uids); 
          setFriends(friendDisplayNames);
          setFriendNames(friendDisplayNames.reduce((acc, name) => ({ ...acc, [name]: name }), {}));
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [currentUser, setFriends]);

  const removeFriend = async (displayName) => {
    if (!currentUser || !friendUids[displayName]) {
      toast.error("Error: Unable to find user.", {position: "top-center"});
      return;
    }
  
    const friendUid = friendUids[displayName]; 
  
    const userFriendsRef = ref(db, `Chats/${currentUser.uid}/friends/${displayName}`);
    const friendFriendsRef = ref(db, `Chats/${friendUid}/friends/${currentUser.displayName}`);
  
    const chatId =
      currentUser.uid < friendUid
        ? `${currentUser.uid}_${friendUid}`
        : `${friendUid}_${currentUser.uid}`;
    const chatRef = ref(db, `Chats/${chatId}`);
  
    try {
      await remove(userFriendsRef);
  
      await remove(friendFriendsRef).catch((err) =>
        console.warn("Friend already removed:", err)
      );
  
      await remove(chatRef).catch((err) =>
        console.warn("No chat history to remove:", err)
      );
  
      setFriends((prev) => prev.filter((name) => name !== displayName));
  
      toast.success(`${displayName} has been removed.`, {position: "top-center"});
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend.", {position: "top-center"});
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex" }}>
      <List
        sx={{
          color: "white",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {friends.length > 0 ? (
          friends.map((displayName) => (
            <div key={displayName}>
              <ListItem disablePadding sx={{ alignItems: "flex-start", flexShrink: 0 }}>
                <ListItemButton onClick={() => onSelectFriend(displayName)}>
                  <ListItemText primary={displayName} />
                </ListItemButton>

                {/* ✅ CloseIcon to Remove Friend */}
                <IconButton
                  edge="end"
                  onClick={() => removeFriend(displayName)}
                  sx={{ color: "red", marginRight: "10px" }}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>
              <Divider sx={{ bgcolor: "white" }} />
            </div>
          ))
        ) : (
          <Typography sx={{ color: "white", textAlign: "center", p: 2 }}>
            No friends added yet
          </Typography>
        )}
      </List>
    </Box>
  );
};


const AddFriend = ({ setAddFriend, setFriends, friends }) => {
  const [username, setUsername] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearchFriend = async () => {
    if (!username.trim()) {
      toast.error("Enter a valid username!", { position: "top-center" });
      inputRef.current.focus();
      return;
    }
  
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("You must be logged in!", { position: "top-center" });
        return;
      }
      if (currentUser.displayName === username) {
        toast.error("You cannot add yourself as a friend!", { position: "top-center" });
        return;
      }
  
      const usersRef = ref(db, "Users");
      const snapshot = await get(usersRef);
      if (!snapshot.exists()) {
        toast.error("No users found in the database!", { position: "top-center" });
        return;
      }
  
      const usersData = snapshot.val();
      const friendEntry = Object.entries(usersData).find(
        ([uid, userData]) => userData.username === username
      );
  
      if (!friendEntry) {
        toast.error("User does not exist in the database!", { position: "top-center" });
        return;
      }
  
      const friendUid = friendEntry[0];
  
      const friendRequestsRef = ref(db, `Users/${friendUid}/friendRequests`);
      const requestSnapshot = await get(friendRequestsRef);
  
      if (requestSnapshot.exists() && requestSnapshot.val()[currentUser.displayName]) {
        toast.error("Friend request already sent!", { position: "top-center" });
        return;
      }
  
      await update(friendRequestsRef, { [currentUser.displayName]: true });
  
      toast.success(`Friend request sent to ${username}!`, { position: "top-center" });
      setUsername("");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(`Error: ${error.message}`, { position: "top-center" });
    }
  };
  

  return (
    <div style={{
      zIndex: 100, position: "absolute",
      width: "100%", height: "100%",
      display: "flex", justifyContent: "center",
      alignItems: "center", color: "white",
      pointerEvents: "none",
    }}>
      <div className="form-container" style={{ pointerEvents: "all" }}>
        <p className="title">Add Friend</p>
        <form className="form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input ref={inputRef} type="text" id="username" value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <button className="sign" type="button" onClick={handleSearchFriend} style={{ marginTop: "10px" }}>
              Search
            </button>
            <button className="sign" onClick={() => setAddFriend(false)} style={{ marginTop: "10px" }}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Community() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [addFriend, setAddFriend] = useState(false);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userChatRef = ref(db, `Chats/${currentUser.uid}/friends`);

    get(userChatRef).then((snapshot) => {
      if (snapshot.exists()) {
        const uniqueFriends = [...new Set(Object.keys(snapshot.val()))];
        setFriends(uniqueFriends);
      } else {
        setFriends([]);
      }
    }).catch((error) => {
      console.error("Error fetching friends:", error);
    });
  }, []);

  return (
    <Box sx={{
      bgcolor: "#1c2633",
      width: "100%",
      position: "relative",
      height: "100%",
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    }}>
      {addFriend && <AddFriend setAddFriend={setAddFriend} setFriends={setFriends} friends={friends} />}

      <AppBar position="static" sx={{ backgroundColor: "#1c2633" }}>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}
          indicatorColor="secondary" textColor="inherit"
          variant="fullWidth" sx={{ backgroundColor: "#1c2633" }}>
          <Tab label="Chats" sx={{ color: value === 0 ? "#4ade80" : "white" }} />
          <Tab label="Requests" sx={{ color: value === 1 ? "#facc15" : "white" }} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <div className="flex w-full h-full">
          <div className="w-[25%] border-r border-gray-600">
            <FriendsList friends={friends} setFriends={setFriends} onSelectFriend={setSelectedFriend} />
          </div>
          <div className="flex-grow">
            <ChatComponent selectedFriend={selectedFriend} />
          </div>
        </div>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Request setFriends={setFriends}/>
      </TabPanel>

      <Zoom in timeout={{ enter: theme.transitions.duration.enteringScreen, exit: theme.transitions.duration.leavingScreen }} unmountOnExit>
        <Fab sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          color: "white",
          bgcolor: green[500],
          "&:hover": { bgcolor: green[600] },
        }} aria-label="Add Friend"
          onClick={() => setAddFriend((prev) => !prev)}>
          <PersonAddAlt1Icon />
        </Fab>
      </Zoom>
    </Box>
  );
}