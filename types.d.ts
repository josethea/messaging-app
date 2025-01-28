interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

interface Workspace {
  id: string;
  name: string;
  joinCode: string;
  userId: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
}

interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  role: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

type MemberPopulate = Member & Omit<User, "id">;

interface Conversation {
  id: string;
  workspaceId: string;
  memberOneId: string;
  memberTwoId: string;
}

interface Message {
  id: string;
  content: string;
  image?: string;
  workspaceId: string;
  memberId: string;
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

type MessagePopulate = Message & {
  member: Member;
  user: User;
};
