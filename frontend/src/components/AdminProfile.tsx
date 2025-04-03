import React from "react";
import Image from "next/image"

const AdminProfile = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative size-20 bg-green-100 rounded-full overflow-hidden">
        <Image
          src={user?.profile_image ?? "/userplaceholder.png"}
          alt="logo"
          fill
          className="object-cover"
        />
      </div>
      <div className="hidden md:flex flex-col space-y-1">
        <span>{user?.username ? user.username : "Loading..."}</span>
      </div>
    </div>
  );
};

export default AdminProfile;
