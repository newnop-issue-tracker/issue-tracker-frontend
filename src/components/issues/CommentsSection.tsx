import { useState } from 'react';
import { Avatar } from '@/components/UI/Avatar';
import { Button } from '@/components/UI/Button';
import { Icon } from '@/components/UI/Icon';
import { useComments, useCreateComment, useDeleteComment } from '@/features/issues/hooks';
import { useAuthStore } from '@/store/authStore';
import { timeAgo } from '@/lib/formatters';
import type { Comment } from '@/types/api';

interface CommentItemProps {
  comment: Comment;
  issueId: string;
  onReply: (parentId: string, authorName: string) => void;
}

function CommentItem({ comment, issueId, onReply }: CommentItemProps) {
  const me = useAuthStore((s) => s.user);
  const deleteMutation = useDeleteComment(issueId);

  return (
    <div className="comment-item">
      <Avatar user={comment.author} />
      <div className="comment-body">
        <div className="row-sb">
          <div className="row gap-2">
            <span className="comment-author">{comment.author.name}</span>
            <span className="text-xs text-subtle mono">{timeAgo(comment.createdAt)}</span>
          </div>
          <div className="row gap-1">
            <button
              className="comment-action"
              onClick={() => onReply(comment.id, comment.author.name)}
            >
              Reply
            </button>
            {me?.id === comment.authorId && (
              <button
                className="comment-action comment-action-danger"
                onClick={() => deleteMutation.mutate(comment.id)}
                disabled={deleteMutation.isPending}
              >
                <Icon.Trash size={12} />
              </button>
            )}
          </div>
        </div>
        <p className="comment-text">{comment.body}</p>

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="comment-item">
                <Avatar user={reply.author} />
                <div className="comment-body">
                  <div className="row-sb">
                    <div className="row gap-2">
                      <span className="comment-author">{reply.author.name}</span>
                      <span className="text-xs text-subtle mono">{timeAgo(reply.createdAt)}</span>
                    </div>
                    {me?.id === reply.authorId && (
                      <button
                        className="comment-action comment-action-danger"
                        onClick={() => deleteMutation.mutate(reply.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Icon.Trash size={12} />
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{reply.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentsSectionProps {
  issueId: string;
}

export function CommentsSection({ issueId }: CommentsSectionProps) {
  const { data: comments = [], isLoading } = useComments(issueId);
  const createMutation = useCreateComment(issueId);

  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<{ parentId: string; authorName: string } | null>(null);

  const handleReply = (parentId: string, authorName: string) => {
    setReplyTo({ parentId, authorName });
    setTimeout(() => document.getElementById('comment-input')?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    createMutation.mutate(
      { body: body.trim(), parentId: replyTo?.parentId },
      {
        onSuccess: () => {
          setBody('');
          setReplyTo(null);
        },
      },
    );
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <Icon.MessageSquare size={15} />
        <span>Comments</span>
        <span className="comments-count">{comments.length}</span>
      </div>

      {isLoading ? (
        <div className="text-sm text-subtle" style={{ padding: '12px 0' }}>Loading…</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-subtle" style={{ padding: '12px 0' }}>No comments yet. Be the first to comment.</div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              issueId={issueId}
              onReply={handleReply}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="comment-form">
        {replyTo && (
          <div className="reply-banner">
            <span>Replying to <strong>{replyTo.authorName}</strong></span>
            <button type="button" onClick={() => setReplyTo(null)}>
              <Icon.X size={12} />
            </button>
          </div>
        )}
        <textarea
          id="comment-input"
          className="input textarea"
          placeholder={replyTo ? `Reply to ${replyTo.authorName}…` : 'Leave a comment…'}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          style={{ resize: 'vertical', minHeight: 72 }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!body.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? 'Posting…' : replyTo ? 'Post reply' : 'Comment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
