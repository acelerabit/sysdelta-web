'use client'

import { ReactNode, createContext, useContext, useState } from "react";
import { useCookies } from "next-client-cookies";

interface SubscriptionContextProps {
  subIsFree: string;
  removeCookie: () => void;
}


const SubscriptionContext = createContext({} as SubscriptionContextProps);


export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const cookies = useCookies();

  const [subIsFree, setSubIsFree] = useState(() => {
    const subCookie = cookies.get("sub-free");


    if(subCookie) {
      return subCookie
    }

    return ''
  })


  function removeCookie() {
    cookies.remove("sub-free");
    setSubIsFree('')
  }
  

  return (
    <SubscriptionContext.Provider
      value={{
        subIsFree,
        removeCookie
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);