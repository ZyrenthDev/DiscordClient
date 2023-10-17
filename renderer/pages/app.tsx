import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { NextRouter, Router, useRouter } from 'next/router';
import axios from 'axios';

const apiConfig = {
  version: 9,
  baseUrl: 'https://discord.com/api/',
  cdnUrl: 'https://cdn.discordapp.com/',
  inviteUrl: 'https://discord.gg/',
  giftUrl: 'https://discord.gift/',
  templateBaseUrl: 'https://discord.new/'
};

type User = {
  global_name?: string;
  username?: string;
  discriminator?: string;
};

export default function NextPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const token = window.localStorage.getItem('token');

    if (!token) {
      router.push('/');
      return;
    };

    axios.get(`${apiConfig.baseUrl}v${apiConfig.version}/users/${atob(token.split('.')[0])}/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      validateStatus: (status) => true
    }).then(response => {
      const user = response.data ?? {
        global_name: 'Unknown user',
        username: 'unknown_user',
        discriminator: '0'
      };
      
      // @ts-ignore
      setUser(user);
    }).catch(error => {
      const user = {
        global_name: 'Unknown user',
        username: 'unknown_user',
        discriminator: '0'
      };

      // @ts-ignore
      setUser(user);
    });

    return;
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>App</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <span id='welcome'>Welcome {user.global_name}.</span>
        <button className='button-primary' onClick={() => logout(window.localStorage.getItem('token'), router)}>Logout</button>
      </div>
    </React.Fragment>
  )
}

async function logout(token: string, router: NextRouter) {
  const response = await axios.post(`${apiConfig.baseUrl}v${apiConfig.version}/auth/logout`, {}, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    validateStatus: (status) => true
  });

  if (!response.request.status.toString().startsWith('2')) return console.log(response.data);

  window.localStorage.removeItem('token');
  
  router.push('/');
}