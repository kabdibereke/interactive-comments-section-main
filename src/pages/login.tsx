import React, { useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import styles from  '../styles/Home.module.css'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { Space, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
const { Text } = Typography;

interface UserData  {
    confirm?:'string',
    email: 'string',
    nickname?:'string',
    password: 'string',
  }

const Login = () => {
    const router= useRouter()


  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
    ] = useSignInWithEmailAndPassword(auth);
  const onFinish = async (values: UserData) => {
    await signInWithEmailAndPassword(values.email,values.password)
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
        <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link className={styles.loginFormForgot} href="forgot">
            Forgot password
            </Link>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
            {!loading? "Log in" : "Loading"}
            </Button>
            Or <Link href="/register">register now!</Link>
        </Form.Item>
        </Form>

    </motion.div>
  );
};

export default Login;