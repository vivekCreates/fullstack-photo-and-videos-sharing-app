import { useState } from "react";
import { usePost } from "../context/PostContext";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { createPost, createLoading } = usePost();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    createPost(formData);

    setTitle("");
    setDescription("");
    setFile(null);
    setPreview(null);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-neutral-950 rounded-2xl shadow-2xl p-8 border border-neutral-800">

        <h1 className="text-2xl font-semibold text-white mb-6">
          Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Title
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full bg-neutral-900 text-white border border-neutral-800 rounded-xl px-4 py-3 outline-none focus:border-white transition"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Description
            </label>

            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something..."
              className="w-full bg-neutral-900 text-white border border-neutral-800 rounded-xl px-4 py-3 outline-none focus:border-white resize-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Upload File
            </label>

            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-xl file:bg-white file:text-black file:border-none file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
            />
          </div>

          {preview && (
            <div className="mt-4">
              <p className="text-sm text-neutral-400 mb-2">Preview</p>

              <img
                src={preview}
                alt="preview"
                className="rounded-xl max-h-60 object-cover border border-neutral-800"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={createLoading}
            className="w-full h-12 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 active:scale-[0.98] transition flex items-center justify-center"
          >
            {createLoading ? <Loader /> : "Create Post"}
          </button>

        </form>
      </div>
    </div>
  );
}