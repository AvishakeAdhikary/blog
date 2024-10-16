import { getAllPosts } from "@/lib/api";
import Navbar from "./_components/navbar";

export default async function Home() {
  const allPosts = await getAllPosts();
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        {heroPost && (
          <div className="hero-post mb-8">
            <h2 className="text-2xl font-bold">{heroPost.title}</h2>
            <img src={heroPost.coverImage} alt={heroPost.title} className="mb-4" />
            <p>{heroPost.excerpt}</p>
            <a href={`/posts/${heroPost.slug}`} className="text-blue-500">Read more</a>
          </div>
        )}
        <h3 className="text-xl font-semibold mb-4">More Posts</h3>
        <ul>
          {morePosts.map((post) => (
            <li key={post.slug} className="mb-4">
              <h4 className="text-lg">{post.title}</h4>
              <p>{post.excerpt}</p>
              <a href={`/posts/${post.slug}`} className="text-blue-500">Read more</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
