'use client'
import Image from "next/image";
import {motion} from 'framer-motion'

const Loading = () => {
  return (
    <>
      <Image src="/logo.svg" alt="Logo" width={150} height={150} />
      <motion.div
        style={{ display: "inline-block" ,width: "25px", height: "25px" }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Image src="/l-circle.svg" alt="Logo" width={25} height={25} />
      </motion.div>
    </>
  );
}
export default Loading;

