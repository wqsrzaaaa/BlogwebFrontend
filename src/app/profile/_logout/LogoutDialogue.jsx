"use client";

import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const LogoutDialogue = () => {
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-red-500 text-sm cursor-pointer hover:underline">
          Logout
        </p>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            Do you want to log out?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button className={'cursor-pointer'} variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleLogout} className="bg-red-600 text-white cursor-pointer hover:bg-red-600">
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialogue;
