import Message from '@/components/Message/Message'
import MessageForm from '@/components/MessageForm/MessageForm'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {  useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ContextType, IData } from '@/type';
import { AuthContextP } from '@/context/AuthContext';
import { useRouter } from 'next/router';


export default function Home() {
  const router= useRouter()
  const [data,setData] = useState<IData[]>([])
  const {user}  = useContext(AuthContextP)  as ContextType
  useEffect(()=> {
    if(!user){
        router.push('/login')
    }
  },[user?.email])

 
  return (
    <>
      <div className={styles.main}>
        <MessageForm setData={setData} data={data}/>
        {data.map((item,index)=> {
          return <Message key={index} {...item} />
        })}
      </div>
    </>
  )
}
