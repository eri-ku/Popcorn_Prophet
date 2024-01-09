import { CommentModel } from "./ArticlesPage";
import styles from "./Comment.module.css";

function Comment({ comment }: { comment: CommentModel }) {
  return <div>{comment.commentText}</div>;
}

export default Comment;
