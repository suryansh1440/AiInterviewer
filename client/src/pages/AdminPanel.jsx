import InfoCard from "../components/InfoCard";
import { Users, Radio, Cable, Trash, ChevronDown } from "lucide-react";
import User from "../components/User";
import { users } from "../data";

export default function AdminPanel() {
  return (
    <section className="grid grid-cols-[repeat(4,minmax(16rem,1fr))] grid-rows-[min-content_10vw_90vh] bg-base-200 gap-12">
      <InfoCard
        Icon={<Users strokeWidth={1} size={30} className="text-primary" />}
        number={123}
        detail="Total Users"
      />

      <InfoCard
        Icon={<Radio strokeWidth={1} size={30} className="text-secondary" />}
        number={35}
        detail="Live Interviews"
      />

      <InfoCard
        Icon={<Cable strokeWidth={1} size={30} className="text-accent" />}
        number={12}
        detail="Logins Today"
      />

      <InfoCard
        Icon={<Trash strokeWidth={1} size={30} className="text-error" />}
        number={2}
        detail="Deleted Users"
      />

      <div className="col-span-full row-start-3 grid grid-cols-8 grid-rows-[repeat(auto-fill,max-content)] bg-base-100 overflow-auto p-[0.6rem]">
        <div className="col-span-full grid grid-cols-subgrid justify-items-center items-center text-base-content/50 text-lg font-bold uppercase border-b border-base-300 py-[0.3rem]">
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
                <ChevronDown stroke="var(--fallback-bc,theme(colors.base-content))" strokeWidth={1} size={20} />
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
