import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../context/AuthProvider";
import { useCommentByMovieId } from "../hooks/useComment";
import { addComment } from "../services/commentService";
import CommentItem from "./CommentItem";
import Icons from "./Icons";
import Loading from "./Loading";
import Button from "./ui/Button";

const CommentSection = ({ movieId }) => {
  const { data: comments, isLoading } = useCommentByMovieId({ movieId });
  const { user } = useAuth();

  // Kiểm tra nếu người dùng đã bình luạn rồi thì không cho bình luận nữa
  const isCommented = !!comments.find(
    (cmt) => user && cmt.user_id === user.uid,
  );

  return (
    <div className="gap-2 flex flex-col">
      <h2 className="flex items-center text-xl font-semibold">
        <Icons.Comment className={"mr-2"} />
        Bình luận
      </h2>

      <CommentForm movieId={movieId} isCommented={isCommented} />

      <div className="flex flex-col">
        {!isLoading &&
          comments.map((comment) => {
            return <CommentItem comment={comment} key={comment.id} />;
          })}

        <Loading isLoading={isLoading} />
      </div>
    </div>
  );
};

export const CommentForm = ({ movieId, isCommented = false }) => {
  const { user } = useAuth();
  const form = useForm({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });
  const queryClient = useQueryClient();

  const handleSubmit = async (data) => {
    try {
      const { comment, rating } = data;

      if (isCommented) {
        toast("Bạn đã bình luận rồi!");
        return;
      }

      if (!user) {
        toast("Vui lòng đăng nhập để thực hiện bình luận!");
        return;
      }

      if (comment.trim().length === 0) {
        toast("Vui lòng nhập bình luận của bạn!");
        return;
      }
      if (rating === 0) {
        toast("Vui lòng chọn đánh giá của bạn!");
        return;
      }

      await addComment({
        avatar: user.photoURL,
        content: comment,
        rating: rating,
        movieId,
        name: user.displayName,
        userId: user.uid,
      });

      queryClient.invalidateQueries({
        queryKey: ["comments", movieId],
      });

      toast("Bình luận của bạn đã được gửi thành công!");

      form.reset();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Có lỗi xảy ra trong quá trình gửi bình luận!");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-2"
    >
      <textarea
        {...form.register("comment")}
        placeholder="Nhập bình luận của bạn..."
        className="p-4 border rounded-md text-sm border-secondary focus:outline-none resize-y"
      ></textarea>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">Đánh giá:</span>
          {new Array(5).fill(0).map((_, index) => {
            return (
              <button
                key={index}
                type="button"
                onClick={() => form.setValue("rating", index + 1)}
                className={`${
                  form.watch("rating") >= index + 1
                    ? "text-yellow-400"
                    : "text-secondary"
                }`}
              >
                <Icons.Star />
              </button>
            );
          })}
        </div>

        <Button
          type="submit"
          className="px-4 py-1 bg-secondary text-white rounded-md"
        >
          <Icons.Send /> Gửi
        </Button>
      </div>
    </form>
  );
};

export default CommentSection;
