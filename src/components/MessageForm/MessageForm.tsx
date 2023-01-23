import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Input,Button } from 'antd';
import styles  from './MessageForm.module.css'
import { auth } from '../../../firebase';
import avatarIcon from '../../assets/img/avatar.png'
import Image from 'next/image';
import { db } from '../../../firebase'
import {  onValue, ref, set } from "firebase/database";
import { nanoid } from 'nanoid';
import { ContextType, IData } from '@/type';
import { motion } from 'framer-motion';
import { AuthContextP } from '@/context/AuthContext';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
const { TextArea } = Input;


interface IMessageFormProps {
  setData: Dispatch<SetStateAction<IData[]>>,
  data: IData[]
}
const MessageForm = ({setData,data}: IMessageFormProps) => {
  const {user}  = useContext(AuthContextP)  as ContextType
  const [value, setValue] = useState('');
  const [signOut, loading, error] = useSignOut(auth);
  const router= useRouter()
  const getData = async ()=> {
    try {
      onValue(ref(db), (snapshot) => {
        setData([]);
        const datas = snapshot.val() as IData;
        console.log(datas)
        if (datas !== null) {
          Object.values(datas).map((item) => {
            setData((oldArr) => [...oldArr, item]);
          });
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    getData()
  },[])

  function writeUserData() {
    const id =nanoid()
    set(ref(db,  `${id}`), {
      id:id,
      message: value,
      user: user?.displayName,
      count: 0,
      avatarUrl: user?.photoURL,
      date: new Date().getTime(),
    });
  }

  const logout = ()=> {
    signOut()
    router.push('/login')
  }
  return (
    <motion.div className={styles.wrapper}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    >
        {user?.photoURL ? <Image  width={40}  height={40} src={user?.photoURL} alt="avatar" className={styles.avatar} /> : <Image width={40}  height={40} src={avatarIcon} alt="avatar" className={styles.avatar} />}
        
        <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Controlled autosize"
        autoSize={{ minRows: 3, maxRows: 5 }}
        />
       <div className={styles.buttonWrapper}>
       <Button type="primary" size='large' onClick={writeUserData}>
          Send
        </Button>
        <Button type="primary" size='small' onClick={logout}>
           {!loading? "Log Out" : "Loading"}
        </Button>
       </div>
    </motion.div>
  )
}

export default MessageForm

