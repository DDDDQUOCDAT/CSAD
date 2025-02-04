import React, { useState, useEffect, useRef } from "react";
import { db,auth } from "../firebase/firebase";
import { ref, get,update  } from "firebase/database";
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
} from "@mui/material";
import { green } from "@mui/material/colors";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

const TabPanel = ({ children, value, index }) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`action-tabpanel-${index}`}
    aria-labelledby={`action-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </Typography>
);

const Chats = () => (
  <List sx={{ color: "white", width: "20%", bgcolor: "gray" }}>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemText primary="friend1" />
      </ListItemButton>
    </ListItem>
  </List>
);

const AddFriend = ({ setAddFriend }) => {
  const [username, setUsername] = useState("");
  const inputRef = useRef(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearchFriend = async () => {
    if (!username.trim()) {
      toast.error("Enter a valid username!");
      inputRef.current.focus();
      return;
    }
  
    try {
      // ✅ Get the current logged-in user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("You must be logged in!");
        return;
      }
  
      // ✅ Reference to "Users" in the database
      const usernameRef = ref(db, "Users/");
      const snapshot = await get(usernameRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
  
        // ✅ Check if the entered username exists
        const friendFound = Object.values(data).some((element) => element.username === username);
  
        if (friendFound) {
          toast.success("Friend Found!", { position: "top-center" });
  
          // ✅ Reference to the current user's chat friend list
          const userChatRef = ref(db, `Chat/${currentUser.uid}/friends`);
  
          // ✅ Append the new friend instead of replacing the list
          update(userChatRef, { [username]: true })
            .then(() => {
              toast.success(`${username} added as a friend!`);
            })
            .catch((error) => {
              toast.error(`Error adding friend: ${error.message}`);
            });
  
        } else {
          toast.error("User not found!", { position: "top-center" });
          inputRef.current.focus();
        }
      } else {
        toast.error("No users in the database!");
        inputRef.current.focus();
      }
    } catch (error) {
      toast.error(error.message);
      inputRef.current.focus();
    }
  };
  return (
    <div
      style={{
        zIndex: 100,
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        pointerEvents: "none",
      }}
    >
      <div className="form-container" style={{ pointerEvents: "all" }}>
        <p className="title">Add Friend</p>
        <form className="form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              ref={inputRef}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [addFriend, setAddFriend] = useState(false);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Box
      sx={{
        bgcolor: "#1c2633",
        width: "100%",
        position: "relative",
        height: "100%",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }}
    >
      {addFriend && <AddFriend setAddFriend={setAddFriend} />}

      <AppBar position="static" sx={{ backgroundColor: "#2a3b4d" }}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          sx={{ backgroundColor: "#1c2633" }}
        >
          <Tab label="Chats" sx={{ color: value === 0 ? "#4ade80" : "white" }} />
          <Tab label="Community" sx={{ color: value === 1 ? "#facc15" : "white" }} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Chats />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Community
      </TabPanel>

      <Zoom in timeout={transitionDuration} unmountOnExit>
        <Fab
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            color: "white",
            bgcolor: green[500],
            "&:hover": { bgcolor: green[600] },
          }}
          aria-label="Add Friend"
          onClick={() => setAddFriend((prev) => !prev)}
        >
          <PersonAddAlt1Icon />
        </Fab>
      </Zoom>
    </Box>
  );
}
