// Layout.jsx
import styled from "styled-components";
import {
  Home,
  Settings,
  Calendar,
  Mail,
  Users,
  HelpCircle,
} from "lucide-react";
import React, { useState } from "react";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    height: 100vh;
    width: 64px;
    background-color: #1a1a1a;
    padding: 1.5rem 0;
  }
`;

const MobileNavigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #1a1a1a;
  display: flex;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 0 0.5rem;

  @media (min-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const IconWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${(props) => (props.isActive ? "#ff9800" : "#ffffff")};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;

  @media (min-width: 1024px) {
    margin-left: 64px;
  }
`;

const SidebarIcon = ({ Icon, isActive, onClick }) => (
  <IconWrapper isActive={isActive} onClick={onClick}>
    <Icon size={24} />
  </IconWrapper>
);

const MainLayout = ({ children }) => {
  const [activeIcon, setActiveIcon] = useState("Home");

  const icons = [
    { Icon: Home, label: "Home" },
    { Icon: Mail, label: "Mail" },
    { Icon: Calendar, label: "Calendar" },
    { Icon: Users, label: "Users" },
    { Icon: Settings, label: "Settings" },
    { Icon: HelpCircle, label: "Help" },
  ];

  return (
    <LayoutWrapper>
      <Sidebar>
        <NavContainer>
          {icons.map(({ Icon, label }) => (
            <SidebarIcon
              key={label}
              Icon={Icon}
              isActive={activeIcon === label}
              onClick={() => setActiveIcon(label)}
            />
          ))}
        </NavContainer>
      </Sidebar>

      <MainContent>{children}</MainContent>

      <MobileNavigation>
        <NavContainer>
          {icons.map(({ Icon, label }) => (
            <SidebarIcon
              key={label}
              Icon={Icon}
              isActive={activeIcon === label}
              onClick={() => setActiveIcon(label)}
            />
          ))}
        </NavContainer>
      </MobileNavigation>
    </LayoutWrapper>
  );
};

export default MainLayout;
