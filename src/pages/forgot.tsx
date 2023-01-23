import React, { useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import styles from  '../styles/Home.module.css'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { Space, Typography } from 'antd';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
const { Text } = Typography;

interface UserData  {
    confirm?:'string',
    email: 'string',
    nickname?:'string',
    password: 'string',
  }

const Forgot = () => {
  const router = useRouter()

  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
    auth
  );
  const onFinish = async (values: UserData) => {
    await sendPasswordResetEmail(values.email)
    router.push('/')
  };
  
  return (
    <motion.div 
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    className={styles.wrapper}>
        <Form
        name="email"
        className={styles.form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        >
        {error &&  <Text type="danger">{error.message.substring(10)}</Text> }
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
        <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
            {!sending? "Reset" : "Loading"}
            </Button>
            Or <Link href="/login">Log In</Link>
        </Form.Item>
        </Form>

    </motion.div>
  );
};

export default Forgot;