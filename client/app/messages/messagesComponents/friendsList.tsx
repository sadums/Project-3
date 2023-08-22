"use client";

import FriendListItem from "@/app/components/friendListItem";
import Auth from "@/app/(utils)/auth";
import { GET_USER_CHATS } from "@/app/GraphQL/queries";
import { useQuery } from "@apollo/client";

export default function FriendsList() {
  const profile = Auth.getProfile();
  const userId = profile?.data?._id;

  if (!userId) {
    return <div>Error: No user ID found</div>;
  }

  const { error, loading, data } = useQuery(GET_USER_CHATS, {
    variables: {
      userId: userId,
    },
  });
  console.log(GET_USER_CHATS);
  console.log(data);
  console.log(error);

  const chats: any[] = [];

  try {
    for (const chat in data.getUserChats.chats) {
      for (const member in data.getUserChats.chats[chat].members) {
        const currentMember = data.getUserChats.chats[chat].members[member];
        if (!(Auth.getProfile().data._id === currentMember._id)) {
          chats.push({
            username: currentMember.username,
            firstname: currentMember.firstName,
            lastname: currentMember.lastName,
            id: currentMember._id,
            pfp: currentMember.pfp,
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <div>
      {chats.map((friend, index) => (
        <FriendListItem
          username={friend.username}
          firstname={friend.firstname}
          lastname={friend.lastname}
          pfp={friend.pfp}
          key={index}
        />
      ))}
    </div>
  );
}
