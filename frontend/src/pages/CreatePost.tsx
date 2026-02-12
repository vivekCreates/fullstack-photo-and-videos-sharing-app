import { useState } from "react";
import { usePost } from "../context/PostContext";
import { useNavigate } from "react-router";

export default function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { createPost } = usePost()
    const navigate = useNavigate()
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

        setTitle("")
        setDescription("")
        setFile(null)
        setPreview("")

        navigate("/")


    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-neutral-900 rounded-2xl shadow-xl p-8 border border-neutral-800">

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
                            className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter post title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                            Description
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="Write something..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                            Upload File
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full text-neutral-300 file:bg-indigo-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:cursor-pointer bg-neutral-800 border border-neutral-700 rounded-lg"
                        />
                    </div>

                    {preview && (
                        <div className="mt-4">
                            <p className="text-sm text-neutral-400 mb-2">Preview:</p>
                            <img
                                src={preview}
                                alt="preview"
                                className="rounded-xl max-h-60 object-cover border border-neutral-700"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium py-2 rounded-lg"
                    >
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
}
