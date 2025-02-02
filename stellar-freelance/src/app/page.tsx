"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = async (publicKey: string | null) => {
    try {
      if (!publicKey) {
        console.error("No public key provided");
      }
      console.log("Attempting to fetch balance for:", publicKey);
      // More lenient validation for Stellar public key
      if (!publicKey || publicKey.length < 56 || !publicKey.startsWith("G")) {
        console.error("Invalid public key received from Albedo");
      }

      console.log("Fetching balance for:", publicKey);
      const response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${publicKey}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        console.error(errorData.detail || "Failed to fetch account data");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.balances) {
        console.error("No balances found in response");
      }

      const nativeBalance =
        data.balances.find((b: any) => b.asset_type === "native")?.balance ||
        "0";
      setBalance(nativeBalance);
    } catch (error) {
      console.error("Error in fetchBalance:", error);
      setBalance(null);
      // Optionally show a user-friendly error message
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Failed to fetch balance"
        }`
      );
    }
  };

  const handleLogin = async () => {
    try {
      const albedo = await import("@albedo-link/intent");
      const { publicKey } = await albedo.default.publicKey({
        intent: "public_key",
        network: "testnet",
      });

      // Add validation for the public key
      if (!publicKey || !/^G[A-Z0-9]{55,56}$/.test(publicKey)) {
        console.error("Invalid public key received from Albedo");
      }

      console.log("Received public key from Albedo:", publicKey);
      setWalletAddress(publicKey);
      await fetchBalance(publicKey); // Add await to ensure balance is fetched
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(
        `Wallet connection error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setWalletAddress(null); // Reset wallet address on error
      setBalance(null); // Reset balance on error
    }
  };

  const handlePayment = async () => {
    try {
      const albedo = await import("@albedo-link/intent");
      await albedo.default
        .pay({
          amount: "10",
          destination:
            "GCKOQGMTULKR55EWNHAXXJLTL25J3LT6BHHLBMDAVFKX3E32PCYVBO7M",
          asset_code: "TST",
          asset_issuer:
            "GBX6YUG3KCUEOBZRPN7TXBLMNXDW35XJOKDYFYIISDKDW4Y63LBCW6EI",
          network: "testnet",
        })
        .then((res) => {
          console.log("Payment successful:", res);
          alert("Payment successful!");
        })
        .catch((e) => {
          console.error("Payment error:", e);
          alert(`Payment failed: ${e.message}`);
        });
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert(
        `Payment initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 p-4">
        {walletAddress && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Account Stats</h3>
            <div className="space-y-1 text-sm">
              <p>
                Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
              <p>
                Balance:{" "}
                {balance
                  ? `${parseFloat(balance).toFixed(2)} XLM`
                  : "Loading..."}
              </p>
              <button
                onClick={handlePayment}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors"
              >
                Make Payment
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 p-4">
        {walletAddress ? (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Login with Albedo
          </button>
        )}
      </div>
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Find the perfect freelance services for your business
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="What service are you looking for today?"
              className="flex-1 p-3 rounded text-gray-900"
            />
            <button className="bg-white text-green-600 px-8 py-3 rounded font-semibold hover:bg-gray-100">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold mb-8">Popular Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Service Card */}
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
            <img
              src="https://placehold.co/400x200"
              alt="Service"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-2">Logo Design</h3>
              <p className="text-sm text-gray-600 mb-4">Starting at $5</p>
              <div className="flex items-center">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-600 ml-2">(1k+)</span>
              </div>
            </div>
          </div>
          {/* Repeat service cards as needed */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            {/* Add category links */}
          </div>
          <div>
            <h4 className="font-bold mb-4">About</h4>
            {/* Add about links */}
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            {/* Add support links */}
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            {/* Add social links */}
          </div>
        </div>
      </footer>
    </div>
  );
}
