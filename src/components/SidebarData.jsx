import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
const iftipo = () => {
  const tipo2=[{
    title: 'Pacientes',
    path: '/',
    icon: <FaIcons.FaUserCircle className=' fa-6x' />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    
  },
  {
    title: 'Registrar paciente',
    path: '/p_reg',
    icon: <FaIcons.FaUserPlus className=' fa-6x ' />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
   
  },
  {
    title: 'Cerrar sesion',
    path: '/login',
    icon: <FaIcons.FaDoorClosed  className=' fa-6x ' />,
    foo: async()=>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('usuario');
    },
  }];
  const tipo1=[{
    title: 'Paciente',
    path: '/',
    icon: <FaIcons.FaUserCircle className=' fa-6x' />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  
    
  },
  {
    title: 'Cerrar sesion',
    path: '/login',
    foo: async()=>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('usuario');
    },
    icon: <FaIcons.FaDoorClosed className=' fa-6x ' />
  }];
  const tipo0=[{
    title: 'Cerrar sesion',
    path: '/login',
    foo: async()=>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('usuario');
    },
    icon: <FaIcons.FaDoorClosed className=' fa-6x ' />
  }];
  
 if(localStorage.getItem('tipo')== 'unico')return(tipo1)
 if(localStorage.getItem('tipo')== 'multi')return(tipo2)
 else return(tipo0)


  }
export const SidebarData =  iftipo();