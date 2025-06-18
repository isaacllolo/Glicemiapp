import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SidebarItem = styled(Link)`
  display: flex;
  color: #FE2472;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    i{ color:#FFFFFF; }
    color:#FFFFFF;
    background: #FE2472;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffff;
  font-size: 18px;
  &:hover {
    background: #FFFFFF;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const navigate = useNavigate();
  const [subnav, setSubnav] = useState(false);

  const handleClick = async () => {
    if (item.foo) {
      await item.foo();
    }
    navigate(item.path);
  };

  return (
    <div onClick={handleClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <SidebarItem as="div">
        {item.icon}
        <SidebarLabel>{item.title}</SidebarLabel>
      </SidebarItem>
      <div>
        {item.subNav && subnav
          ? item.iconOpened
          : item.subNav
          ? item.iconClosed
          : null}
      </div>
    </div>
  );
};

export default SubMenu;
