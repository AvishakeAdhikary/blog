import { getAllPosts } from "@/lib/api";

export default function Home() {
  const allPosts = getAllPosts();
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <div></div>
  );
}
