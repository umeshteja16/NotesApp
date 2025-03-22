import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo';
import Searchbar from '../SearchBar/Searchbar';
import { useNavigate } from 'react-router-dom'

const Navbar = ({userInfo, onSearchNote, handleClearSearch, getAllNotes}) => {

  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

const handleSearch = ()=>{
  if(searchQuery){
    onSearchNote(searchQuery)
  }
};

const onSearchChange = (e)=>{
  const query = e.target.value;
  setSearchQuery(query);
  onSearchNote(query)
  if(query.trim() ===""){
    getAllNotes();
  }
}

const onClearSearch = () =>{
  setSearchQuery("");
  handleClearSearch()
  
}
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>
        {(userInfo)?<Searchbar 
        value={searchQuery}
        onChange={onSearchChange}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        />:""}
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Navbar;