import React, { useEffect } from "react";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import useAuth from "@/hooks/useAuth";
import { IMessage } from "@/interfaces/message";
import { IUser } from "@/interfaces/user";
import { Avatar, Spinner } from "@/components";

interface IProps {
  className?: string;
  isLoading?: boolean;
  messages: IMessage[];
  lastMessageSent: IMessage|null;
  lastMessageReceived: IMessage|null;
  selectedUser: IUser|null;
  onReachTop: () => void;
}

export default function Messages({ 
  className = '',
  isLoading = false,
  messages,
  lastMessageSent,
  lastMessageReceived, 
  selectedUser, 
  onReachTop 
}: IProps) {
  const { user } = useAuth();

  const { t, i18n } = useTranslation();

  // Force scroll to bottom when new messages are added.
  useEffect(() => {
    const element = document.getElementById('messages');
    if(element) element.scrollTo(0, element.scrollHeight);
  }, [
    lastMessageReceived, 
    lastMessageSent, 
    selectedUser
  ]);

  useEffect(() => {
    const element = document.getElementById('messages');

    function handleScroll() {
      if (element && element.scrollTop === 0) {
        onReachTop();
      }
    }

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onReachTop]);

  function Message({ data }: { data: IMessage }) {
    const isMine = user?.id === data.sender_id;

    return (
      <div className={`flex gap-4 ${isMine ? 'flex-row-reverse justify-start' : ''} ${data.id != messages[messages.length - 1].id ? 'mb-4' : ''}`}>
        {!isMine && <Avatar src={selectedUser?.photo?.name} className="!bg-white" />}
        <div className={`max-w-96 bg-white rounded-lg p-3 flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
          <p>{data.content}</p>
          <span className="text-[10px] text-gray-500">{moment(data.created_at).locale(i18n.language).fromNow()}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-body p-4 rounded-md overflow-y-auto ${className}`} id="messages">
      {isLoading && <div className="flex justify-center"><Spinner className="h-5 w-5" /></div>}
      {messages.map(message => <Message key={message.id} data={message} />)}
    </div>
  )
}
