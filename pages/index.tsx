import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import MainBanner from "@/src/components/MainBanner";
import Catecory from "@/src/components/Catecory";
import AllCocktailList from "@/src/components/AllCocktailList";
import axios, { AxiosResponse } from "axios";
import { GetServerSideProps, GetStaticProps } from "next";
import type {
  AllCocktailListProps,
  Product,
} from "@/src/constants/productTypes";
import { getSession, useSession } from "next-auth/react";
import LoginForm from "@/src/components/user/LoginForm";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import wrapper, {
  AppDispatch,
  persistor,
  RootState2,
  RootState,
  store,
} from "@/src/reducer";
import { useEffect } from "react";
import {
  addItem,
  initializeItems,
  InitialProductType,
} from "@/src/reducer/products";
import { END } from "@redux-saga/core";
import { useDispatch } from "react-redux";
import { login } from "@/src/reducer/user";
import { GetProductListResult } from "@/src/constants/apiTypes";
import NonAlcCocktailList from "@/src/components/product/NonAlcCocktailList";
import { sessionUserType } from "@/src/constants/userType";
const inter = Inter({ subsets: ["latin"] });

// { allProductList }: AllCocktailListProps
export default function Home() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const store = useSelector((state: RootState2) => state.products.products);

  return (
    <>
      {status === "authenticated" ? (
        <div className="w-full mx-auto">
          <section>
            <MainBanner />
          </section>
          <section className="px-3 py-5">
            <Catecory />
          </section>
          <section className="p-3 md:p-5 lg:p-32">
            <AllCocktailList allProductList={store} />
          </section>
          <section className="p-3 md:p-5 lg:p-32 md:hidden">
            <NonAlcCocktailList allProductList={store} />
          </section>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const { data }: AxiosResponse<GetProductListResult> = await axios.get(
      "http://localhost:3000/api/products"
    );

    store.dispatch(initializeItems(data.data));

    if (!data.data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        allProductList: data.data,
      },
    };
  });

// const store = useSelector<RootState2, RootState2["products"]>(
//   (state) => state.products
// );

// export const getStaticPaths: GetStaticPaths = async (context) => {
//   const res = await fetch("http://localhost:3000/api/products");
//   const posts = await res.json();

//   const paths = posts.data.map((post) => ({
//     params: { id: post.id },
//   }));
//   // console.log("getStaticPaths", posts.data);

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getServerSideProps: GetServerSideProps =
//   wrapper.getServerSideProps((store) => async (context) => {
//     const res = await axios.get("http://localhost:3000/api/products");

//     if (!res.data) {
//       return {
//         notFound: true,
//       };
//     }
//     const { data } = res.data;

//     return {
//       props: {
//         allProductList: data,
//       },
//     };
//   });
