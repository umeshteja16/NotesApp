import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]); // Add tag
            setInputValue(""); // Clear input field
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "NumpadEnter") {
            e.preventDefault(); // Prevents accidental form submissions
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div>
            {tags?.length > 0 && (
                <div className='flex items-center gap-2 flex-wrap mt-2'>
                    {tags.map((tag, index) => (
                        <span key={index} className='flex items-center bg-gray-200 px-2 py-1 rounded'>
                            # {tag}
                            <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveTag(tag)}>
                                <MdClose />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <div className='flex items-center gap-4 mt-3'>
                <input 
                    type='text' 
                    className='text-sm bg-transparent border px-3 py-2 rounded outline-none' 
                    placeholder='Add tags'
                    value={inputValue}  // Ensure the input reflects state
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button 
                    className='w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700'
                    onClick={addNewTag} // Fix: Ensure onClick executes the function
                >
                    <MdAdd className="text-3xl text-blue-700 hover:text-white"/>
                </button>
            </div>
        </div>
    );
};

export default TagInput;
