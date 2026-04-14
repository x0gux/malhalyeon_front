'use client'
import Image from "next/image";
import {Footer} from "@/_components/Layout";

const Home = () => {
  return (
    <>
      <Image src="/logo.svg" alt="Logo" width={150} height={150} />
      <Footer/>
    </>
  );
}
export default Home;