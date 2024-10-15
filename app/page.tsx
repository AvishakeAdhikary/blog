// import { getAllPosts } from "@/lib/api";
import { getAllPosts } from "@/lib/api";
import Navbar from "./_components/navbar";

export default function Home() {
  // const allPosts = getAllPosts();
  // const heroPost = allPosts[0];
  // const morePosts = allPosts.slice(1);

  return (
    <Navbar></Navbar>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}