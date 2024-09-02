import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';
import { IoSearchOutline } from "react-icons/io5";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import EchoService from '@/services/echo';
import ChatService from "@/services/api/chat";
import UserService from "@/services/api/user";
import useAuth from "@/hooks/useAuth";
import { Card, Messages, Prompt, ConversationList, Spinner, Input } from "@/components";
import { IMessage } from "@/interfaces/message";
import { IUser } from "@/interfaces/user";

interface IMessageReceived {
  message: IMessage;
}

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectingUser, setIsSelectingUser] = useState(false);
  const [isGettingMoreMessages, setIsGettingMoreMessages] = useState(false);
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [isShowingSearchInput, setIsShowingSearchInput] = useState(false);
  const [lastMessageReceived, setLastMessageReceived] = useState<IMessage|null>(null);
  const [lastMessageSent, setLastMessageSent] = useState<IMessage|null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const [searchMessagesValue, setSearchMessagesValue] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchMessagesValue);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesRef = useRef<IMessage[]>([]);

  const [selectedUser, setSelectedUser] = useState<IUser|null>(null);
  const selectedUserRef = useRef<IUser|null>(null);

  const { t } = useTranslation();
  const titlePage = t("pages.chat.title");
  const router = useRouter();
  const { user: authenticatedUser } = useAuth(); 

  useEffect(() => {
    async function loadChat() {
      addMessageReceivedListener();

      try {
        // Get users for conversation
        const responseUsers = await ChatService.getUsersForConversation();
        setUsers(responseUsers.data.data);

        // Get selected parameter
        const { selected } = router.query;

        if(selected) {
          const responseSelected = await UserService.getUser(selected as string);
          const user = responseSelected.data.data;
          setSelectedUser(user);
          selectedUserRef.current = user;

          // Get first messages
          const response = await ChatService.getMessages({ user_id: selected as string });
          const messages = response.data.data;
          setMessages(messages);
          messagesRef.current = messages
        }
      } catch (error) {
        console.log("An error occurred while fetching users", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadChat();

    return () => {
      EchoService.getInstance().leaveChannel(`users.${authenticatedUser.id}`);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchMessagesValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchMessagesValue]);

  useEffect(() => {
    async function searchMessages() {
      try {
        setIsSearchingMessages(true);
        setMessages([]);
        messagesRef.current = [];
        await getMessages(1);
      } catch (error) {
        console.log("An error occurred while searching messages", error);
      } finally {
        setIsSearchingMessages(false);
      }
    }

    if(!isSelectingUser && selectedUser) {
      searchMessages();
    }
  }, [debouncedSearchTerm]);

  function addMessageReceivedListener() {
    EchoService.getInstance()
      .private(`users.${authenticatedUser.id}`)
      .listen(".message.received", (e: IMessageReceived) => {
        const { message } = e;

        updateLastMessageByUserId(message.sender_id, message);
        
        // Check if message is from selected user
        if(selectedUserRef.current && message.sender_id == selectedUserRef.current.id) {
          // Check if message is not already in the list
          if(!messagesRef.current.find(m => m.id == message.id)) {
            setMessages(prev => [...prev, e.message]);
            setLastMessageReceived(message);
            ChatService.setMessagesAsRead({ user_id: selectedUserRef.current?.id });
          }
        } else {
          incrementUnreadMessagesCount(message.sender_id);
        }
      });
  }

  async function getMessages(page = 1, userId = selectedUser?.id) {
    if(userId) {
      if(page != 1) {
        setIsGettingMoreMessages(true);
      }

      try {
        const response = await ChatService.getMessages({ user_id: userId, page: page, search: searchMessagesValue || undefined });
        const newMessages = response.data.data;
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
        messagesRef.current = [...newMessages, ...messagesRef.current];

        setPagination(prev => ({ 
          ...prev, 
          current_page: response.data.meta.current_page, 
          last_page: response.data.meta.last_page, 
        }));
      } catch (error) {
        console.log("An error occurred while fetching messages", error);
      } finally {
        setIsGettingMoreMessages(false);
      }
    } 
  }

  async function handleSelectUser(user: IUser) {
    if(!isSelectingUser) {
      if(user.id != selectedUser?.id) {
        try {
          // Change states.
          setIsSelectingUser(true);
          setIsShowingSearchInput(false);
          setSearchMessagesValue('');
          setMessages([]);
          messagesRef.current = [];

          // Get first page of messages.
          await getMessages(1, user.id);

          // Set messages as read.
          await ChatService.setMessagesAsRead({ user_id: user.id });
          setUsers(prev => prev.map(u => {
            if(u.id == user.id) {
              return {
                ...u,
                unread_messages_count: 0
              }
            }
            return u;
          }));

          selectedUserRef.current = user;
          setSelectedUser(user);
        } catch (error) {
          console.log("An error occurred while fetching messages", error);
        } finally {
          setIsSelectingUser(false);
        }
      } else {
        setSelectedUser(null);
        selectedUserRef.current = null
  
        setMessages([]);
        messagesRef.current = [];
      }
    }
  }

  async function getMoreMessage() {
    if(pagination.current_page < pagination.last_page) {
      const messages = document.getElementById('messages');

      if(messages) {
        const scrollHeight = messages.scrollHeight;
        const nextPage = pagination.current_page + 1;
        await getMessages(nextPage);

        // Keep scroll position.
        setTimeout(() => {
          messages.scrollTop = messages.scrollHeight - scrollHeight;
        }, 0);
      } 
    }
  }

  function incrementUnreadMessagesCount(userId: string|number) {
    setUsers(prev => prev.map(u => {
      if(u.id === userId) {
        return {
          ...u,
          unread_messages_count: (u.unread_messages_count || 0) + 1
        }
      }
      return u;
    }));

    // Move user to the top of the list
    setUsers(prev => [prev.find(u => u.id === userId)!, ...prev.filter(u => u.id !== userId)]);
  }

  function updateLastMessageByUserId(userId: string|number, message: IMessage) {
    setUsers(prev => prev.map(u => {
      if(u.id === userId) {
        return {
          ...u,
          last_message: message
        }
      }
      return u;
    }))
  }

  return (
    <PrivateLayout title={titlePage}>
      <audio src={`/sound_chat.mp3`}></audio>
      <Card className="md:h-[calc(100vh-231.5px)]">
        <Card.Body className="flex flex-col md:flex-row p-4">
          {!isLoading ? (
            <Fragment>
              <ConversationList 
                users={users}
                selectedUser={selectedUser}
                handleSelectUser={handleSelectUser}
              />

              {!isSelectingUser ? (
                <Fragment>
                  {selectedUser ? (
                    <div className="flex flex-col flex-grow md:pl-4">
                      <header className="flex items-center justify-between px-4 py-2 mb-4 border-b border-gray-200 dark:border-zinc-700">
                        <h1 className={`text font-medium ${isShowingSearchInput ? 'hidden md:block' : ''}`}>{selectedUser.name}</h1>
                        <div className="flex items-center">
                          {isShowingSearchInput && (
                            <Input
                              name="searchMessages"
                              type="text" 
                              className="w-64 mr-2 input-sm shadow-none"
                              placeholder={t("pages.chat.searchMessages")} 
                              value={searchMessagesValue} 
                              onChange={e => setSearchMessagesValue(e.target.value)}
                            />
                          )}
                          <button 
                            className={`
                              w-10 h-10 min-w-10 min-h-10 rounded-full flex items-center justify-center transition focus:outline-none hover:bg-gray-100 dark:hover:bg-white/5
                              ${isShowingSearchInput ? '!bg-gray-100 dark:!bg-white/5' : ''}
                            `}
                            onClick={() => {
                              setIsShowingSearchInput(!isShowingSearchInput)
                            }}
                          >
                            <IoSearchOutline size={18} />
                          </button>
                        </div>
                      </header>
                      {!isSearchingMessages ? (
                        <>
                          <Messages 
                            className="h-[calc(100vh-391px)]" 
                            messages={messages}
                            onReachTop={() => getMoreMessage()}
                            lastMessageReceived={lastMessageReceived}
                            lastMessageSent={lastMessageSent}
                            selectedUser={selectedUser}
                            isGettingMoreMessages={isGettingMoreMessages}
                          />
                          <Prompt
                            selectedUser={selectedUser}
                            users={users}
                            setUsers={setUsers}
                            setMessages={setMessages}
                            setLastMessageSent={setLastMessageSent}
                          />
                        </>
                      ) : (
                        <div className={`flex flex-grow justify-center items-center p-6`}>
                          <Spinner className="h-5 w-5" />  
                        </div>  
                      )}
                    </div>
                  ) : (
                    <div className="flex-grow flex justify-center items-center p-6 md:pl-4">
                      {t("pages.chat.notSelected")}
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className={`flex flex-grow justify-center items-center p-6`}>
                  <Spinner className="h-5 w-5" />  
                </div>  
              )}  
            </Fragment>
          ) : (
            <div className={`flex w-full justify-center items-center p-6`}>
              <Spinner className="h-5 w-5" />  
            </div>  
          )}
        </Card.Body>
      </Card>
    </PrivateLayout>
  )
}
