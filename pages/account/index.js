import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Account from "../../components/Account";
import { useUserAddress } from "../../components/AddressContext";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import { useWallet } from "../../components/WalletContext";
import { perpetualStatsFetcher } from "../../utils/fetcher";
import { isAddress } from "../../utils/helper";
import { getUserStats } from "../../utils/query";

export default function UserAccount() {
  let [isInvalid, setIsInvalid] = useState(true);
  let { address } = useWallet();

  useEffect(() => {
    if (!isAddress(address)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [address]);

  let { data: userStats } = useSWR(function () {
    if (!isAddress(address)) {
      return null;
    }
    return getUserStats(address?.toLowerCase());
  }, perpetualStatsFetcher);

  if (address) {
    return (
      <LoggedInUser
        isInvalid={isInvalid}
        address={address}
        userStats={userStats}
      />
    );
  }
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <Header noPadding />
        <SearchPanel />
      </div>
    </Layout>
  );
}

function LoggedInUser({ isInvalid, address, userStats }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Perpetual Protocol Dashboard | {address}</title>
      </Head>
      <Header title="Your Account Details" isInvalid={isInvalid} isSmall />
      <Account
        userStats={userStats?.user}
        isInvalid={isInvalid}
        userAddress={address?.toLowerCase()}
      />
    </div>
  );
}

function SearchPanel() {
  let { address, setAddress } = useUserAddress();
  let router = useRouter();
  function handleSubmit(event) {
    event.preventDefault();
    router.push(`/account/${address}`);
  }
  return (
    <>
      <div className="bg-white py-16 sm:py-24">
        <Head>
          <title>User Account | PerpTerminal </title>
        </Head>
        <div className="relative sm:py-16">
          <div aria-hidden="true" className="hidden sm:block">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl" />
            <svg
              className="absolute top-8 left-1/2 -ml-3"
              width={404}
              height={392}
              fill="none"
              viewBox="0 0 404 392"
            >
              <defs>
                <pattern
                  id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={392}
                fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
              />
            </svg>
          </div>
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative rounded-2xl px-6 py-10 bg-gray-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 1463 360"
                >
                  <path
                    className="text-gray-500 text-opacity-40"
                    fill="currentColor"
                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                  />
                  <path
                    className="text-gray-700 text-opacity-40"
                    fill="currentColor"
                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                  />
                </svg>
              </div>
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Check user activity
                  </h2>
                  <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-200">
                    To check user activity, add an Ethereum address in the
                    search box below. The address should start with orai1.
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="mt-12 sm:mx-auto sm:max-w-2xl sm:flex"
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor="address" className="sr-only">
                      Search by Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                      placeholder="Search by Address"
                      value={address}
                      onChange={({ target }) => setAddress(target.value)}
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent px-5 py-3 bg-gray-500 text-base font-medium text-white shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600 sm:px-10"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
