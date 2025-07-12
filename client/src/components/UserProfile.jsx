import { BellDot, Mail, UserRound } from "lucide-react";

export default function UserProfile() {
  return (
    <div className="col-span-4 row-span-1 flex justify-between items-center bg-white">
      <h1 className="m-[0.6rem] p-[0.6rem_0.9rem]  font-bold">Users</h1>
      <div className="flex items-center mx-[0.6rem]">
        <BellDot size={20} strokeWidth={1.5} className="mx-[0.6rem]" />
        <Mail size={20} strokeWidth={1.5} className="mx-[0.6rem]" />

        <div className="flex items-center ml-[0.6rem]">
          <UserRound
            size={20}
            strokeWidth={1.5}
            className="mx-[0.3rem] p-[0.12rem] rounded-full border border-black"
          />
          <span className="font-medium">Harsh Singh</span>
        </div>
      </div>
    </div>
  );
}
