import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import AddEditNotes from './AddEditNotes'
import moment from 'moment';
//import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown:false,
    type:"add",
    data:null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const navigate = useNavigate();

  //get User info
  const getUserInfo = async()=> {
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch(err){
      if(err.response.status ===401 ){
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //get-all-notes
  const getAllNotes = async()=>{
    try{
      const response = await axiosInstance.get("/get-all-notes");
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes);
      }
    }catch(err){
      console.log("An unexpected error occured. Please try again.");
    }
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {}
  }, []);
  

  return (
    <>
      <Navbar userInfo = {userInfo}/>
      <div className="container mx-auto p-8">
        <div className='grid grid-cols-3 gap-4 mt-8'>
        {allNotes.map((item, index)=>(
          <NoteCard
          key = {item._id}
          title={item.title}
          date={moment(item.createdOn).format('Do MMM YYYY')}
          content={item.content}
          tags={item.tags}
          isPinned={item.isPinned}
          onEdit={() => {}}
          onDelete={() => {}}
          onPinNote={() => {}}
        />
        ))}
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