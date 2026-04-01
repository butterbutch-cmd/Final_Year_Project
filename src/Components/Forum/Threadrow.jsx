import { useEffect } from "react";
import { deleteThread as apiDeleteThread, editThread as apiEditThread } from "../../services/forumAPI";

const avatarColors = [
  "bg-teal-600",
  "bg-purple-500",
  "bg-orange-400",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-600",
  "bg-red-500",
  "bg-indigo-500",
  "bg-yellow-500",
];

export default function ThreadRow({
  thread,
  onClick,
  pinned = false,
  currentUser,
  onDelete,
  onEdit,
  onReport,
}) {
  const getOwnerId = (author) =>
    typeof author === "string" ? author : author?._id ?? author?.id ?? null;

  const isCurrentUserThread =
    currentUser && getOwnerId(thread.author) === currentUser._id;

  const displayUsername =
    thread.author?.username ||
    (isCurrentUserThread ? currentUser?.username : null) ||
    "?";

  useEffect(() => {
    console.debug("ThreadRow rendered for thread ID:", thread._id);
  }, [thread, currentUser, displayUsername]);

  const avatarColor =
    avatarColors[(displayUsername.charCodeAt(0) || 0) % avatarColors.length];

  const participants = thread.participants || [thread.author];
  const isOwner = currentUser && getOwnerId(thread.author) === currentUser._id;

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (typeof onDelete === "function") {
      onDelete(thread._id);
      return;
    }

    if (!window.confirm("Delete this thread?")) return;
    try {
      await apiDeleteThread(thread._id);
      if (typeof window !== "undefined") window.location.reload();
    } catch (err) {
      console.error("Failed to delete thread:", err);
      alert(err?.message || "Delete failed");
    }
  };

  const handleEditClick = async (e) => {
    e.stopPropagation();

    const newTitle = window.prompt("Edit thread title:", thread.title);
    if (newTitle === null) return;

    const newContent = window.prompt("Edit thread content:", thread.content);
    if (newContent === null) return;

    try {
      await apiEditThread(thread._id, {
        title: newTitle,
        content: newContent,
      });

      alert("Thread updated successfully");

      if (typeof window !== "undefined") {
        window.location.reload();
      }

    } catch (err) {
      console.error("Edit failed:", err);
      alert(err?.message || "Failed to edit thread");
    }
  };

  const handleReportClick = async (e) => {
    e.stopPropagation();
    if (typeof onReport === "function") {
      onReport(thread._id);
      return;
    }
    const reason = window.prompt("Why are you reporting this thread? (optional)");
    if (reason === null) return;
    try {
      // dynamic import of report API to avoid circular import if any
      const { report } = await import("../../services/forumAPI");
      await report({ targetType: "thread", targetId: thread._id, reason: reason || "Reported via UI" });
      alert("Reported — moderators will review this thread.");
    } catch (err) {
      console.error("Report failed:", err);
      alert(err?.message || "Failed to report");
    }
  };

  return (
    <tr
      onClick={() => onClick?.(thread._id)}
      className={`group border-b border-stone-100 cursor-pointer transition-all duration-150 ${
        pinned
          ? "bg-amber-50/60 hover:bg-amber-100/50"
          : "bg-white hover:bg-stone-50/80"
      }`}
    >
      {/* Title + Tags */}
      <td className="py-4 px-5 w-full">
        <div className="flex items-start gap-3">
          {pinned && (
            <span className="text-amber-400 mt-0.5 flex-shrink-0 text-[13px]" title="Pinned">  
            </span>
          )}
          <div className="min-w-0">
            <p
              className={`text-[14px] font-semibold leading-snug mb-1.5 group-hover:text-green-700 transition-colors ${
                pinned ? "text-stone-700" : "text-stone-800"
              }`}
            >
              {thread.title}
            </p>

            {pinned && thread.content && (
              <p className="text-[12px] text-stone-400 leading-relaxed line-clamp-2 mb-2">
                {thread.content}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {/* Author chip */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-4 h-4 rounded-full ${avatarColor} text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0`}
                >
                  {displayUsername[0]?.toUpperCase() || "?"}
                </div>
                <span className="text-[12px] text-stone-400 font-medium">{displayUsername}</span>
              </div>

              {thread.tags && thread.tags.length > 0 && (
                <>
                  <span className="text-stone-200">·</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4 px-4 whitespace-nowrap">
        {thread.category ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            {thread.category}
          </span>
        ) : null}
      </td>

      {/* Participants */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="flex -space-x-2">
          {participants.slice(0, 3).map((user, i) => {
            const isCurrentUserParticipant = currentUser && getOwnerId(user) === currentUser._id;
            const name = user?.username || (isCurrentUserParticipant ? currentUser?.username : "?");
            const color = avatarColors[(name.charCodeAt(0) || i * 3) % avatarColors.length];

            return (
              <span
                key={i}
                className={`w-7 h-7 rounded-full ${color} text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white flex-shrink-0 shadow-sm`}
                title={name}
              >
                {name[0]?.toUpperCase() || "?"}
              </span>
            );
          })}
          {participants.length > 3 && (
            <span className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 text-[10px] font-bold flex items-center justify-center ring-2 ring-white flex-shrink-0">
              +{participants.length - 3}
            </span>
          )}
        </div>
      </td>

      {/* Score */}
      <td className="py-4 px-4 whitespace-nowrap text-center">
        <div className="inline-flex items-center gap-1 text-[13px] font-semibold text-stone-600">
          <span className="text-rose-400 text-[11px]">♥</span>
          {thread.score ?? 0}
        </div>
      </td>

      {/* Comments */}
      <td className="py-4 px-4 whitespace-nowrap text-center">
        <span className="text-[13px] text-stone-400 font-medium">
          {thread.commentCount ?? "—"}
        </span>
      </td>

      {/* Actions + Time */}
      <td className="py-4 px-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="text-[12px] text-stone-400 mr-2">just now</span>

          {isOwner && (
            <>
              <button
                onClick={handleEditClick}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                title="Edit thread"
              >
                 Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Delete thread"
              >
                ✕ 
              </button>
            </>
          )}

          {!isOwner && (
            <button
              onClick={handleReportClick}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium text-stone-300 hover:text-amber-500 hover:bg-amber-50 transition-all"
              title="Report thread"
            >
              ⚑ Report
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}