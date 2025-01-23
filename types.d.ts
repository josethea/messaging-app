interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

interface WorkspaceProps {
  data: Workspace[];
  success: boolean;
}

interface Workspace {
  id: string;
  name: string;
  joinCode: string;
}
