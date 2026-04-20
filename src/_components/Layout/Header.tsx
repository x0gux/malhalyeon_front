'use client'
import styled from "@emotion/styled";
import font from "@/_packages/design-system/src/font";
import Link from "next/link";
import { useAuthStore } from "@/_store/authStore";
import { auth } from "@/_lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Logo from "@/../public/logo.svg"
import Image from "next/image";

const Header = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <HeaderContainer>
      <Image src={Logo} alt="Logo" width={50} height={50} onClick={() => {router.push("/")}} />
      <Nav>
        {user ? (
          <>
            <UserInfo>{user.email?.split('@')[0]}</UserInfo>
            <NavButton onClick={handleLogout}>로그아웃</NavButton>
          </>
        ) : (
          <>
            <NavLink href="/login">로그인</NavLink>
            <NavLink href="/signup">회원가입</NavLink>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  width: 100%;
  max-width : 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  z-index: 100;
  background: transparent;
`;



const Nav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLink = styled(Link)`
  ${font.P2};
  color: #000000;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`;

const UserInfo = styled.span`
  ${font.P2};
  color: #000000;
  font-weight: 500;
`;

const NavButton = styled.button`
  ${font.P2};
  color: #000000;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0;
  &:hover {
    opacity: 1;
  }
`;
