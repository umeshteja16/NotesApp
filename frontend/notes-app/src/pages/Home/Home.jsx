import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import AddEditNotes from './AddEditNotes'
//import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown:false,
    type:"add",
    data:null,
  });

  return (
    <>
      <Navbar/>
      <div className="container mx-auto p-8">
        <div className='grid grid-cols-3 gap-4 mt-8'>
        <NoteCard
          title="My First Note"
          date="March 13, 2025"
          content="This is a sample note with **Markdown support** and interactive features."
          tags={["Meeting"]}
          isPinned={true}
          onEdit={() => {}}
          onDelete={() => {}}
          onPinNote={() => {}}
        />
        </div>
      </div>
      <button 
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" 
        onClick={()=>{
          setOpenAddEditModal({isShown:true, type:"Add", data:null});
        }}>
        <p className='text-[32px] text-white'>+</p>
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={()=>setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll'
        >
        <AddEditNotes
          type = {openAddEditModal.type}
          noteData = {openAddEditModal.data}
          onClose={()=>{
            setOpenAddEditModal({ isShown:false, type: "add", data: null})
          }}
        />
      </Modal>

    </>
  )
}

export default Home