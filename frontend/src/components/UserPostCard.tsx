type PostPropsType = {
  id: number;
  file: string;
  title: string;
};

const UserPostCard = ({ post }: { post: PostPropsType }) => {
  return (
    <div
      key={post.id}
      className="group bg-black border border-zinc-800 rounded-2xl overflow-hidden 
      hover:border-zinc-600 transition-all duration-300 cursor-pointer
      hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
    >
      <div className="overflow-hidden">
        <img
          src={post.file}
          alt={post.title}
          className="w-full h-52 object-cover 
          group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-4">
        <h3 className="text-zinc-200 font-semibold text-lg tracking-wide group-hover:text-white transition">
          {post.title}
        </h3>
      </div>
    </div>
  );
};

export default UserPostCard;