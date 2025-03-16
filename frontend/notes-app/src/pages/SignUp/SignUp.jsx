import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import { validateEmail } from '../../utils/helper';
import PasswordInput from '../../components/Navbar/Input/PasswordInput';
import { Link } from 'react-router-dom';


const SignUp = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async(e) => {
    e.preventDefault();
    if(!name){
      setError("Invalid Name");
      return;
    }

    if(!validateEmail(email)){
      setError("Invalid Email Address.");
      return;
    }
    if(!password){
      setError("Invalid Password");
      return;
    }
    setError("")

    //SignUp API Call
  }

  return <>
    <Navbar />
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSignUp}>
          <h4 className="text-2xl mb-7">SignUp</h4>
          <input
          type="text" 
          placeholder='Name' 
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className='input-box mt-3' 
          />

          <input
          type="text" 
          placeholder='Email' 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className='input-box my-3' 
          />

          <PasswordInput
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />

          {error && 
          <p className="text-red-500 text-xs pb-1">{error}</p>
          }
          <button type="submit" className="btn-primary">Create Account</button>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login"className="font-medium text-primary underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>


    </>;
  
}

export default SignUp