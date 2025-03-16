import React from 'react'
import { getInitils } from '../../utils/helper'

const ProfileInfo = ({onLogout}) => {
  return (
    <div className='flex item-center gap-3'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>{getInitils("Umesh Teja")}</div>
        <div>
            <p className="text-sm font-medium">Umesh</p>
            <button className="text-sm text-slate-700 underline" onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfo