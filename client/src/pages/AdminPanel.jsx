import Profile from "../../src/components/Profile";
import InfoCard from "../../src/components/InfoCard";
import { Users, Radio, Cable, Trash, ChevronDown } from "lucide-react";
import User from "../../src/components/User";
import { users } from "../../src/data";

export default function AdminPanel() {
  return (
    <section className="grid grid-cols-[repeat(4,minmax(16rem,1fr))] grid-rows-[min-content_10vw_90vh] bg-[#f8f8f8] gap-12">
      <Profile />
      <InfoCard
        bgColor="bg-[#3e6dda33]"
        Icon={<Users strokeWidth={1} size={30} stroke="#3e6dda" />}
        number={123}
        detail="Total Users"
      />

      <InfoCard
        bgColor="bg-[#e2760233]"
        Icon={<Radio strokeWidth={1} size={30} stroke="#e27602" bac />}
        number={35}
        detail="Live Interviews"
      />

      <InfoCard
        bgColor="bg-[rgba(54,175,104,0.2)]"
        Icon={<Cable strokeWidth={1} size={30} stroke="#36af68" />}
        number={12}
        detail="Logins Today"
      />

      <InfoCard
        bgColor="bg-[rgba(213,51,86,0.2)]"
        Icon={<Trash strokeWidth={1} size={30} stroke="#d53356" />}
        number={2}
        detail="Deleted Users"
      />

      <div className="col-span-full row-start-3 grid grid-cols-8 grid-rows-[repeat(auto-fill,max-content)] bg-white overflow-auto p-[0.6rem]">
        <div className="col-span-full grid grid-cols-subgrid justify-items-center items-center text-black/40 text-lg font-bold uppercase border-b border-gray-300 py-[0.3rem]">
          {[
            "Email",
            "Profile",
            "User",
            "Domain",
            "Difficulty",
            "Status",
            "Created At",
            "Last Seen",
          ].map((header) => (
            <div
              key={header}
              className="flex justify-center items-center gap-[0.2rem]"
            >
              {header}
              <button className="border-none bg-transparent">
                <ChevronDown stroke="black" strokeWidth={1} size={20} />
              </button>
            </div>
          ))}
        </div>

        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
}
