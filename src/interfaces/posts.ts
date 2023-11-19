interface Post {
  idPost: string;
  title: string;
  body: string;
  urlImage: string;
  isActive: boolean;
  createAt: boolean;
}

interface PostForm {
  title: string;
  body: string;
  urlImage: string;
}
