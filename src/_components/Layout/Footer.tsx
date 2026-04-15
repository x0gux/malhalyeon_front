'use client';

import styled from "@emotion/styled";
import Image from "next/image";
import font from "@/packages/design-system/src/font";
import { useRouter, usePathname } from "next/navigation";

const Footer = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <FooterLayout>
            <FooterItem onClick={() => { router.push("/test") }}>
                <Image 
                    src="/test.svg" 
                    alt="test" 
                    width={24} 
                    height={24} 
                    style={{ filter: pathname === '/test' ? 'none' : 'grayscale(100%) opacity(0.5)' }} 
                />
                <FooterText active={pathname === '/test'}>검사하기</FooterText>
            </FooterItem>
            <FooterItem onClick={() => { router.push("/") }}>
                <Image 
                    src="/home.svg" 
                    alt="home" 
                    width={24} 
                    height={24} 
                    style={{ filter: pathname === '/' ? 'none' : 'grayscale(100%) opacity(0.5)' }}
                />
                <FooterText active={pathname === '/'}>홈</FooterText>
            </FooterItem>
        </FooterLayout>
    )

}

export default Footer;


const FooterLayout = styled.div`
    z-index : 3;
    width : 100%;
    display : flex;
    justify-content : space-around;
    align-items : center;
    position: fixed;
    max-width:500px;
    bottom : 0;
    height : 80px;
    background-color: #ffffff;
    border-top: 1px solid #f0f0f0;
`

const FooterItem = styled.div`
    display : flex;
    flex-direction : column;
    align-items : center;
    gap : 4px;
    cursor: pointer;
`

const FooterText = styled.p<{ active?: boolean }>`
    ${font.P3};
    color: ${props => props.active ? "#FF4D4D" : "#999999"};
`