import Navbar from "../components/Navbar"


export const PostDetails= () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between items-center">
      <Navbar/>
      <div className="w-[70%] h-140 mb-10 max-w-6xl bg-zinc-900 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        <div className="h-96 md:h-auto bg-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-10 h-fit flex flex-col justify-between">
          
          <div>
            <h1 className="text-4xl font-bold mb-6">
              Beautiful Sunset in Mountains
            </h1>

            <p className="text-zinc-400 leading-relaxed mb-8">
              This is the full detail of the post. Here you can describe the
              story behind the image, what inspired it, and any important
              information related to it. This section supports longer content.
            </p>
          </div>

          <div className="border-t border-zinc-700 pt-6 text-sm text-zinc-500">
            Created at: 12 February 2026
          </div>

        </div>

      </div>

    </div>
  );
};

