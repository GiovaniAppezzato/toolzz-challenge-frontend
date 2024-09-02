import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { IUser } from "@/interfaces/user";
import { Avatar, Input } from "@/components";

interface IProps {
  users?: IUser[];
  selectedUser: IUser|null;
  handleSelectUser: (user: IUser) => void;
}

export default function ConversationList({ 
  users = [],
  selectedUser,
  handleSelectUser,
}: IProps) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(search.toLowerCase().trim()) || user.email.toLowerCase().includes(search.toLowerCase().trim());
  });

  const { t } = useTranslation();

  function UserForConversation({ user }: { user: IUser }) {
    const hasUnreadMessages = user.unread_messages_count && user.unread_messages_count > 0;

    return (
      <div 
        onClick={() => handleSelectUser(user)} 
        className={`
          flex items-center mb-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5
          ${selectedUser && user.id === selectedUser.id ? '!bg-gray-100 dark:!bg-white/5' : ''}
        `}
      >
        <Avatar src={user.photo ? user.photo.path : undefined} className="mr-2" />
        <div className={`flex-grow ${hasUnreadMessages ? 'max-w-[calc(100%-75px)]' : 'max-w-[calc(100%-48px)]'}`}>
          <h2 className="w-fulltext-sm font-semibold truncate">{user.name}</h2>
          <p className="w-full text-xs truncate">
            {user.last_message ? user.last_message.content : t("components.chat.conversationList.noMessages")}
          </p>
        </div>
        {hasUnreadMessages ? (
          <div className="bg-danger w-5 h-5 rounded-full text-[8px] flex items-center justify-center text-white">
            {user.unread_messages_count}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full md:border-r md:border-gray-200 dark:border-zinc-700 md:w-1/4 md:h-full md:pr-4">
      <header className="py-4 px-2">
        <div className="flex items-center justify-between">
          <h1 className="text font-medium">
            {t("components.chat.conversationList.title")}
          </h1>
          <Link href="/users/create" className="button-icon button-icon-sm button-primary rounded-full">
            <FaPlus />
          </Link>
        </div>
        <Input
          id="search"
          name="search"
          type="text"
          className="input-md mt-4"
          placeholder={t("components.chat.conversationList.search")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </header>
      {filteredUsers.length > 0 ? (
        <div className="max-h-72 md:h-[calc(100vh-381.5px)] md:max-h-full overflow-y-auto">
          {filteredUsers.map((user) => <UserForConversation key={user.id} user={user} />)}
        </div>  
      ) : (
        <p className="text-center text-gray-600">{t("components.chat.conversationList.noResults")}</p>
      )}
    </div>
  )
}
