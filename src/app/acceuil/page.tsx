"use client";
import React, { useEffect } from "react";

const page = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

   useEffect(() => {
      console.log("API_URL",API_URL)
    }, []);
  return (
    <div>
      <h2>Bonjour Acceuil</h2>
      
    </div>
  );
};

export default page;
