import { getAllPosts } from "@/lib/api";
import Navbar from "./_components/navbar";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { Meteors } from "@/components/ui/meteors";

export default async function Home() {
  const allPosts = await getAllPosts();
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        {heroPost && (
          <Link href={`/posts/${heroPost.slug}`}>
            <Card className="hero-post mb-8 pt-2 pb-8 px-8">
              <h2 className="text-2xl mb-2 font-bold">{heroPost.title}</h2>
              {
                heroPost.coverImage && (
                  <AspectRatio ratio={16 / 9}>
                    <Image src={heroPost.coverImage} alt={heroPost.title} className="mb-8 rounded-md object-cover w-full h-auto" width={0} height={0} sizes="100vw"/>
                  </AspectRatio>
                )
              }
              <p className="mt-8">{heroPost.excerpt}</p>
              <a href={`/posts/${heroPost.slug}`} className="text-blue-500">Read more</a>
            </Card>
          </Link>
        )}
        <h2 className="text-xl font-semibold mb-4">More Posts</h2>
        <Card className="p-4">
          { morePosts.map((post) => (
              <Card key={post.date} className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                <h1 className="font-bold text-xl text-white mb-4 relative z-50">{post.title}</h1>
                {
                  post.coverImage && (
                    <AspectRatio ratio={16 / 9}>
                      <Image src={post.coverImage} alt={post.title} className="mb-8 rounded-md object-cover w-full h-auto" width={0} height={0} sizes="100vw"/>
                    </AspectRatio>
                  )
                }
                <p className="font-normal text-base text-slate-500 mt-8 mb-4 relative z-50">{post.excerpt}</p>
                <Link href={`/posts/${post.slug}`}>
                  <button className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300">
                    Explore
                  </button>
                </Link>
                <Meteors number={20} />
              </Card>
            ))
          }
        </Card>
      </div>
    </div>
  );
}
