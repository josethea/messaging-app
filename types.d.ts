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
