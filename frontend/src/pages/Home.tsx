import Navbar from "../components/Navbar";
import PostSection from "../components/PostSection";

function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white">

      <Navbar />

      <div
        className="
        w-full
        max-w-6xl
        mx-auto
        px-4 sm:px-6
        pt-20
        pb-10
      "
      >
        <PostSection />
      </div>

    </div>
  );
}

export default Home;