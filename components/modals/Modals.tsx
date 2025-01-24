"use client";

import React, { useEffect, useState } from "react";
import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import CreateChannelModal from "@/components/modals/CreateChannelModal";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};

export default Modals;
