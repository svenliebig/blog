import type { Post } from "../models/post";

export interface PostRespository {
	getPost(id: string): Post | null
	getPosts(): Array<Pick<Post, "name">>
}