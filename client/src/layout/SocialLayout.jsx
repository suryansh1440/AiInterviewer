import React, { useState } from 'react'
import SocialSidebar from '../components/SocialSidebar'
import { Outlet } from 'react-router-dom'
import CreatePostModal from '../components/CreatePostModal'

const SocialLayout = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  

  const handleOpenCreate = () => setOpenCreateModal(true);
  const handleCloseCreate = () => setOpenCreateModal(false);

  return (
    <div className="max-h-[90vh] items-center bg-base-200 flex flex-row gap-8 px-4 md:px-10">
      <SocialSidebar onCreateClick={handleOpenCreate} />
      <main className="flex-1 flex flex-col items-center mt-6 justify-start">
        <Outlet />
      </main>
      <CreatePostModal open={openCreateModal} onClose={handleCloseCreate}/>
    </div>
  )
}

export default SocialLayout
