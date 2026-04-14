'use client'
import styled from "@emotion/styled";
import Image from "next/image";
import font from "@/packages/design-system/src/font";
import { useRouter } from "next/navigation";

const Footer = () =>{
    const router = useRouter();
    return(
        <FooterLayout>
            <FooterItem onClick={() => {router.push("/test")}}>
                <Image src="/test.svg" alt="test" width={24} height={24} />
                <FooterText>검사하기</FooterText>
            </FooterItem>
            <FooterItem onClick={() => {router.push("/")}}>
                <Image src="/home.svg" alt="home" width={24} height={24} />
                <FooterText>홈</FooterText>
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
    height : 10%;
`

const FooterItem = styled.div`
    display : flex;
    flex-direction : column;
    align-items : center;
    gap : 0.5rem;
`

const FooterText = styled.p`
    ${font.P3};
`