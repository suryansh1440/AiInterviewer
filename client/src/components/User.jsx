export default function User({ user }) {
  // Difficulty class mapping
  const difficultyClasses = {
    hard: "bg-[#d5335633] text-[#d53356]",
    medium: "bg-[#e2760233] text-[#e27602]",
    easy: "bg-[#36af6833] text-[#36af68]",
  };

  return (
    <div className="col-span-full grid grid-cols-subgrid justify-items-center items-center border-b border-gray-300 text-base font-bold ">
      <div className="col-span-1">{user.email}</div>
      <img
        src={user.profile}
        alt="Profile"
        className="col-span-1 w-[2.5rem] h-[2.5rem] rounded-full object-cover self-center justify-self-center"
      />
      <div className="col-span-1">{user.person}</div>
      <div className="col-span-1">{user.domain}</div>
      <div className="col-span-1">
        <span
          className={`${
            difficultyClasses[user.difficulty]
          } capitalize px-[1rem] py-[0.6rem]`}
        >
          {user.difficulty}
        </span>
      </div>
      <div className="col-span-1">
        <span className="capitalize">{user.interview}</span>
      </div>
      <div className="col-span-1">{user.createdAt}</div>
      <div className="col-span-1">{user.lastSeen}</div>
    </div>
  );
}
