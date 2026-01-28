import React, { useState } from 'react'
import SettingsSidebar from '../component/SettingsSidebar'

const Settings = () => {
      const [userRole, setUserRole] = useState(null);
    
  return (
    <div>
      <SettingsSidebar/>
    </div>
  )
}

export default Settings
