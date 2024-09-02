import { useState } from 'react';
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachment } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { useTranslation } from 'react-i18next';
import { Input, Spinner } from '@/components';
import ChatService from '@/services/api/chat';
import { IUser } from '@/interfaces/user';
import { IMessage } from '@/interfaces/message';

import EmojiPicker, { EmojiStyle, Categories } from 'emoji-picker-react';

interface IProps {
  selectedUser: IUser;
  users: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setLastMessageSent: React.Dispatch<React.SetStateAction<IMessage|null>>;
}

export default function Prompt({ 
  selectedUser,
  users,
  setUsers,
  setMessages,
  setLastMessageSent
}: IProps) {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const { t } = useTranslation();
 
  async function handleSubmit() {
    if(!value) return;

    if(!isSending) {
      setIsSending(true);
      setIsEmojiPickerOpen(false);
      try {
        const response = await ChatService.sendMessage({ receiver_id: selectedUser.id, content: value });
        const message = response.data.data;

        // add new message to the list
        setLastMessageSent(message);
        setMessages(prev => [...prev, message]);
        setValue('');

        const updatedSelectedUser = { ...selectedUser, last_message: message };

        if (users.find(user => user.id === selectedUser.id)) {
          // Update the last_message of the selected user and move them to the top of the list
          setUsers(prev => {
            const updatedUsers = prev.map(user =>
              user.id === selectedUser.id ? updatedSelectedUser : user
            );
            return [updatedSelectedUser, ...updatedUsers.filter(user => user.id !== selectedUser.id)];
          });
        }
      } catch (error) {
        console.log("An error occurred while sending message", error);
      } finally {
        setIsSending(false);
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-4 mt-4 relative">
      <div className='w-full flex items-center'>
        {/* <button className="w-10 h-10 min-w-10 min-h-10 rounded-full flex items-center justify-center transition hover:bg-gray-100">
          <MdOutlineAttachment size={26} />
        </button> */}

        <button 
          className={`w-10 h-10 min-w-10 min-h-10 rounded-full flex items-center justify-center transition hover:bg-gray-100 ${isEmojiPickerOpen ? '!bg-gray-100' : ''}`}
          onClick={() => setIsEmojiPickerOpen(prev => !prev)}
        >
          <BsEmojiSmile size={22} />
        </button>

        {isEmojiPickerOpen && (
          <div className='absolute top-[-330px] left-[14px]'>
            <EmojiPicker
              height={300}
              onEmojiClick={(_) => setValue(prev => prev + _.emoji)}
              emojiStyle={EmojiStyle.NATIVE}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
              searchDisabled
              searchPlaceHolder={t("components.chat.prompt.emojiSearchPlaceholder")}
              categories={[
                { category: Categories.SUGGESTED, name: t("components.chat.prompt.categories.suggested") },
                { category: Categories.SMILEYS_PEOPLE, name: t("components.chat.prompt.categories.smileysPeople") },
                { category: Categories.ANIMALS_NATURE, name: t("components.chat.prompt.categories.animalsNature") },
                { category: Categories.FOOD_DRINK, name: t("components.chat.prompt.categories.foodDrink") },
                { category: Categories.TRAVEL_PLACES, name: t("components.chat.prompt.categories.travelPlaces") },
                { category: Categories.ACTIVITIES, name: t("components.chat.prompt.categories.activities") },
                { category: Categories.OBJECTS, name: t("components.chat.prompt.categories.objects") },
                { category: Categories.SYMBOLS, name: t("components.chat.prompt.categories.symbols") },
                { category: Categories.FLAGS, name: t("components.chat.prompt.categories.flags") }
              ]}
            />
          </div>
        )}

        <Input
          name="message"
          id="message"
          type="text"
          placeholder={t("components.chat.prompt.placeholder")}
          className="shadow-none text-sm ml-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button className="button-icon w-10 h-10 min-w-10 min-h-10 rounded-full button-primary" onClick={handleSubmit}>
        {isSending ? <Spinner /> : <IoSend size={16} />}
      </button>
    </div>
  )
}
