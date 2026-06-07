"use client";

import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import AddFarmerModal from "./AddFarmerModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFarmerCreated = () => {
    // Refresh the farmers table or show success message
    console.log("Farmer created successfully");
    // You can trigger a refetch of the farmers list here
  };

  return (
    <>
      <header className="w-full flex items-center justify-between px-6 py-5 bg-[#f6f8f6]">
        <div>
          <h1 className="text-3xl font-semibold">Farmer Management</h1>
          <p className="text-gray-500 text-sm">Manage platform farmers.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-9 sm:h-10 items-center justify-center rounded-xl bg-primary text-gray-100 text-sm font-semibold hover:bg-primary-dark transition-colors gap-2 px-2 sm:px-4 whitespace-nowrap"
        >
          <IoIosAdd className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline">Add Farmer</span>
        </button>
      </header>

      <AddFarmerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFarmerCreated}
      />
    </>
  );
}
