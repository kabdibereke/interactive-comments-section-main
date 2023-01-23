import { AuthContextProvider, ContextType, IData } from "@/type"
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react"
import { auth } from '../../firebase';
import { db } from "../../firebase"


export const AuthContextP =createContext<ContextType | null>(null)

type Props = {}

const AuthContext = ({children}: AuthContextProvider) => {
  const [user,setUser] = useState<User | null>()
  const [openForm, setOpenForm] = useState(false)

  useEffect(()=> {
    const unsubsribe = onAuthStateChanged(auth , (currentUser)=> {
        setUser(currentUser)
    })
    return ()=> {
        unsubsribe()
    }
  })
  return (
    <AuthContextP.Provider value={{user }}>
        {children}
    </AuthContextP.Provider>

)
}

export default AuthContext