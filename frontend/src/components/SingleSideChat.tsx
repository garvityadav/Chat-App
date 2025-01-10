const SingleSideChat = (
  { username }: { username: string },
  { recentChat }: { recentChat: string },
  { contactId }: { contactId: string },
  { unreadMessagesCount }: { unreadMessagesCount: number }
) => {
  return (
    <div>
      <p>{username}</p>
      <p>{recentChat}</p>
      <p>unread message count:{unreadMessagesCount}</p>
    </div>
  );
};

export default SingleSideChat;
