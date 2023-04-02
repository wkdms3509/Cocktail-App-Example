import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import MainBanner from "@/src/components/MainBanner";
import Catecory from "@/src/components/Catecory";
import AllCocktailList from "@/src/components/AllCocktailList";
import axios from "axios";
import { GetServerSideProps, GetStaticProps } from "next";
import type {
  AllCocktailListProps,
  Product,
} from "@/src/constants/productTypes";
import { useSession } from "next-auth/react";
import LoginForm from "@/src/components/user/LoginForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props: AllCocktailListProps) {
  const { allProductList } = props;
  const { data: session, status } = useSession();

  return (
    <>
      {status === "authenticated" ? (
        <div className="w-full p-32 mx-auto">
          <section>
            <MainBanner />
          </section>
          <section>
            <Catecory />
          </section>
          <section>
            <AllCocktailList allProductList={allProductList} />
          </section>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get("http://localhost:3000/api/products");

  if (!res.data) {
    return {
      notFound: true,
    };
  }

  const { data } = res.data;

  return {
    props: {
      allProductList: data,
    },
  };
};

// 빌드 타임에 html 생성
// export const getStaticProps: GetStaticProps = async () => {
//   const res = await axios.get("http://localhost:3000/api/products");
//   if (!res.data) {
//     return {
//       notFound: true,
//     };
//   }

//   const { data } = res.data;
//   return {
//     props: {
//       allProductList: data,
//     },
//   };
// };
