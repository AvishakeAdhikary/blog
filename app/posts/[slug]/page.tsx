import { getPostBySlug } from "@/lib/api";
import { author } from "@/lib/constants";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = {
    params: {
      slug: string;
    };
};

export function generateMetadata({ params }: Params): Metadata {
    const post = getPostBySlug(params.slug);
  
    if (!post) {
      return notFound();
    }
  
    const title = `${post.title} | ${author}'s Blog`;
  
    return {
      title,
      openGraph: {
        title,
        images: [post.ogImage.url],
      },
    };
}