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
                <FooterIcon 
                    src="/test.svg" 
                    active={pathname === '/test'} 
                />
                <FooterText active={pathname === '/test'}>검사하기</FooterText>
            </FooterItem>
            <FooterItem onClick={() => { router.push("/") }}>
                <FooterIcon 
                    src="/home.svg" 
                    active={pathname === '/'} 
                />
                <FooterText active={pathname === '/'}>홈</FooterText>
            </FooterItem>
        </FooterLayout>
    )

}

export default Footer;

const FooterIcon = styled.div<{ src: string; active: boolean }>`
    width: 24px;
    height: 24px;
    background-color: ${props => props.active ? "#FF4D4D" : "#999999"};
    -webkit-mask-image: url(${props => props.src});
    mask-image: url(${props => props.src});
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
`


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