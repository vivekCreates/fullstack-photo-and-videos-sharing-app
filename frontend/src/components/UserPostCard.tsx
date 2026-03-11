type PostPropsType = {
  id: number;
  file: string;
  title: string;
};

const UserPostCard = ({ post }: { post: PostPropsType }) => {
  return (
    <div
      className="group bg-black border border-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden
      hover:border-neutral-600 transition-all duration-300 cursor-pointer
      hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
    >
      <div className="overflow-hidden">
        <img
          src={post.file}
          alt={post.title}
          className="w-full h-40 sm:h-48 md:h-52 object-cover
          group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-3 sm:p-4">
        <h3
          className="text-neutral-200 font-semibold
          text-sm sm:text-base md:text-lg
          tracking-wide group-hover:text-white transition line-clamp-2"
        >
          {post.title}
        </h3>
      </div>
    </div>
  );
};

export default UserPostCard;