const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/blog`);
    const data = await res.json();
    return data.success ? data.posts : [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`);
    const data = await res.json();
    return data.success ? data.post : null;
  } catch {
    return null;
  }
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/blog/id/${id}`);
    const data = await res.json();
    return data.success ? data.post : null;
  } catch {
    return null;
  }
}

export async function createPost(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(post),
    });
    const data = await res.json();
    return { success: !!data.success, message: data.message };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function updatePost(
  id: string,
  post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/blog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(post),
    });
    const data = await res.json();
    return { success: !!data.success, message: data.message };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function deletePost(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/blog/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    return { success: !!data.success, message: data.message };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}