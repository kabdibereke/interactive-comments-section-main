import {
  Button,
  Form,
  Input,
  Upload,
} from 'antd';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { UserOutlined, UploadOutlined,LockOutlined } from '@ant-design/icons';
import styles from  '../styles/Home.module.css'
import { useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebase';
import {  useContext, useEffect, useState } from 'react';
import {  ref, StorageReference, uploadBytes, UploadResult } from "firebase/storage";
import { useUploadFile } from 'react-firebase-hooks/storage';
import {  Typography } from 'antd';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';


const { Text} = Typography;


interface UserData  {
  confirm?:'string',
  email: 'string',
  nickname?:'string',
  password: 'string',
}

const Register = () => {
  const [form] = Form.useForm();
  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [updateProfile, updating, errord] = useUpdateProfile(auth);
  const router = useRouter()
  const [
    createUserWithEmailAndPassword,
    userd,
    loading,
    errorAuth,
  ] = useCreateUserWithEmailAndPassword(auth);

  let storageRef: StorageReference;
  let result: UploadResult | undefined
  const normFile =  (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    setSelectedFile(e?.fileList[0].originFileObj)
    return e?.fileList;
  };
  const upload = async () => {
    if (selectedFile) {
       result = await uploadFile(storageRef, selectedFile);

    }
  }
  const onFinish = async (values: UserData) => {
   await createUserWithEmailAndPassword(values.email,values.password)
   storageRef = ref(storage, `${values.email}`);
   let url = result?.metadata.bucket? `https://firebasestorage.googleapis.com/v0/b/${result?.metadata.bucket}/o/${result?.metadata.fullPath}?alt=media` : null
   
   await upload()
   await updateProfile({ displayName: values.nickname, photoURL: url })
   router.push('/')
  
  }


 

  return (
   <motion.div 
   initial={{ opacity: 0, scale: 0.5 }}
   animate={{ opacity: 1, scale: 1 }}
   transition={{ duration: 0.2 }}
   className={styles.wrapper}>
     <Form
      form={form}
      name="register"
      onFinish={onFinish}
      className={styles.form}
      scrollToFirstError
    >
      {errorAuth &&  <Text type="danger">{errorAuth.message.substring(10)}</Text> }
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input prefix={<UserOutlined  />} placeholder="Email" className={styles.input}/>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password  prefix={<LockOutlined  />} placeholder="Password" className={styles.input}/>
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password   prefix={<LockOutlined  />} placeholder="Confirm Password" className={styles.input}/>
      </Form.Item>

      <Form.Item
        name="nickname"
        tooltip="What do you want others to call you?"
        rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
      >
        <Input prefix={<UserOutlined  />} placeholder="Nickname" className={styles.input}/>
      </Form.Item>

    <Form.Item
      name="upload"
      valuePropName="fileList"
      getValueFromEvent={normFile}
    >
      <Upload name="logo"  listType="picture" >
        <Button icon={<UploadOutlined />}>Click to upload image</Button>
      </Upload>
    </Form.Item>

      <Form.Item >
        <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
          {!uploading? "Reagister" : "Loading"}
        </Button>
        Or <Link href="/login">login now!</Link>
      </Form.Item>
    </Form>
   </motion.div>
  );
};

export default Register;