import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Input,Button } from 'antd';
import styles  from './ReplyMessageForm.module.css'
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../../firebase';
import avatarIcon from './avatar.png'
import Image from 'next/image';
import { db } from '../../../firebase'
import {  child, onValue, push, ref, set, update } from "firebase/database";
import { nanoid } from 'nanoid';
import { ContextType, IData } from '@/type';
import { motion } from 'framer-motion';
import { AuthContextP } from '@/context/AuthContext';
const { TextArea } = Input;


const ReplyMessageForm = (item: IData) => {
  const {user}  = useContext(AuthContextP)  as ContextType
  const [value, setValue] = useState(`@${item.user},  `);
  const [openForm, setOpenForm] = useState(false)
  const completeHandler = () => {
    setOpenForm(false)
    const newId = nanoid()
    // const replies = push(child(ref(db), `${newId}`)).key;
		update(ref(db, `/${item.id}`+ `${newId}`), {
      id:item.id + newId,
      count:0,
      message:value,
      user:user?.displayName,
      avatarUrl:user?.photoURL,
      date: new Date().getTime(),

		});
	};

  // const getData = async ()=> {
  //   try {
  //     onValue(ref(db), (snapshot) => {
  //       setData([]);
  //       const datas = snapshot.val() as IData;
  //       console.log(datas)
  //       if (datas !== null) {
  //         Object.values(datas).map((item) => {
  //           setData((oldArr) => [...oldArr, item]);
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(()=> {
  //     return ()=> {
  //       getData()
  //     }
  // },[])

  // function writeUserData() {
  //   const id =nanoid()
  //   set(ref(db,  `${id}`), {
  //     id:id,
  //     message: value,
  //     user: user?.displayName,
  //     likes: [],
  //     dislikes: [],
  //     avatarUrl: user?.photoURL,
  //     date: new Date().getTime(),
  //     replies: []
  //   });
  // }

  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    className={styles.wrapper}>
      {user?.photoURL ? <Image  width={40}  height={40} src={user?.photoURL} alt="avatar" className={styles.avatar} /> : <Image  src={avatarIcon} alt="avatar" className={styles.avatar} />}
      <TextArea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Controlled autosize"
      autoSize={{ minRows: 3, maxRows: 5 }}
      />
      <Button type="primary" size='large' onClick={completeHandler}>
          Edit
      </Button>
    </motion.div>
  )
}

export default ReplyMessageForm

