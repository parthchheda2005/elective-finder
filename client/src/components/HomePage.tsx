export default function HomePage() {
  return (
    <div className="flex justify-center items-center h-screen flex-col text-center">
      <h1 className="font-extrabold text-5xl">find your dream elective.</h1>
      <h2 className="font-semibold text-xl m-2">
        welcome to your ai powered elective finder.
      </h2>
      <div className="w-full flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="p-2 bg-emerald-200 text-[#242424] rounded w-28">
          register
        </button>
        <button className="p-2 bg-indigo-200 text-[#242424] rounded w-28">
          login
        </button>
      </div>
    </div>
  );
}
