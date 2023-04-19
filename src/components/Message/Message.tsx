import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import styles from './Message.module.css'
import replyIcon from '../../assets/img/reply.png'
import avatarICon from '../../assets/img/avatar.png'
import ReplyMessageForm from '../ReplyMessageForm/ReplyMessageForm'
import { auth, db } from '../../../firebase'
import { ref, remove, update } from 'firebase/database';
import { ContextType, IData } from '@/type';
import { motion } from 'framer-motion';
import deleteIcon from '../../assets/img/delete.png';
import editIcon from '../../assets/img/edit.png';
import { Button, Input } from 'antd';
import  { AuthContextP } from '@/context/AuthContext'
const { TextArea } = Input;
let periods = {
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000
  };
  
function formatTime(diff:number) {
    
  
    if (diff > periods.month) {
      // it was at least a month ago
      return Math.floor(diff / periods.month) + " month ago";
    } else if (diff > periods.week) {
      return Math.floor(diff / periods.week) + " week ago";
    } else if (diff > periods.day) {
      return Math.floor(diff / periods.day) + " day ago";
    } else if (diff > periods.hour) {
      return Math.floor(diff / periods.hour) + " hour ago";
    } else if (diff > periods.minute) {
      return Math.floor(diff / periods.minute) + " minute ago";
    }
    return "right now";
}



const Message = (item: IData) => {
  const time = new Date().getTime() - item.date
  const [value, setValue] = useState(item.message);
  const [isEdit, setIsEdit] =useState(false);
  const [openForm, setOpenForm] = useState(false)
  const {user}  = useContext(AuthContextP)  as ContextType
  
  const countPlus = () => {
		update(ref(db, `/${item.id}`), {
      count:item.count+1
		});
	};
  const countMinus = () => {
		update(ref(db, `/${item.id}`), {
      count:item.count-1
		});
	};
  
  const deleteItem = () => {
		remove(ref(db, `/${item.id}`));
	};

  const editMessage = () => {
    // const replies = push(child(ref(db), `${newId}`)).key;
    
		update(ref(db, `/${item.id}`), {
      message:value
		});
    setIsEdit(false)
	};

  return (
    <>
    <motion.div
     initial={{ opacity: 0, scale: 0.5 }}
     animate={{ opacity: 1, scale: 1 }}
     transition={{ duration: 0.2 }}
    className={ item.id.length == 21? styles.wrapper  : styles.wrapperMin   }>
        <div className={styles.count} >
            <button onClick={countPlus}>+</button>
            <span>{item.count}</span>
            <button onClick={countMinus}>-</button>
        </div>
        <div className={styles.info}>
            <div className={styles.nameWrapper}>
                <div className={styles.avatarWrapper}>
                   {item.avatarUrl?  <Image width={32} height={32}  src={item.avatarUrl} alt="avatar"  className={styles.avatar}/>:  <Image width={32} height={32}  src={avatarICon} alt="avatar"  className={styles.avatar}/>}
                    <p className={styles.name}>{item.user}</p>
                    <p className={styles.time}>{formatTime(time)}</p>
                </div>
               <div className={styles.buttonWrapper}>
                <div className={styles.reply}>
                      <Image width={14} height={12} src={replyIcon} alt="reply" />
                      <p className={styles.replyText} onClick={()=> setOpenForm(!openForm)}>{!openForm? "Reply" : "Cancel"}</p>
                  </div>
                  {user?.displayName == item.user && 
                  <>
                    <div className={styles.reply}>
                        <Image width={14} height={12} src={deleteIcon} alt="reply" />
                        <p className={styles.deleteText} onClick={deleteItem} >Delete</p>
                    </div>
                    <div className={styles.reply}>
                        <Image width={14} height={12} src={editIcon} alt="reply" />
                        <p className={styles.editText} onClick={()=> setIsEdit(!isEdit)} >{!isEdit? "Edit" : "Cancel"}</p>
                    </div>
                  </>} 
               </div>
            </div>
            <div className={styles.message}>
              {isEdit? <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Controlled autosize"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />: item.message }
            </div>
            {isEdit && <Button type="primary" size='large' onClick={editMessage}>
              Save
            </Button>}
        </div>
    </motion.div>
     {openForm &&   <ReplyMessageForm {...item}/>}
    </>
  )
}

export default Message