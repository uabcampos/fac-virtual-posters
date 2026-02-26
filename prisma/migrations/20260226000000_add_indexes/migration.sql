-- Poster indexes
CREATE INDEX "Poster_session_status_publishedAt_idx"
  ON "Poster"("sessionId", "status", "publishedAt");

-- Comment indexes
CREATE INDEX "Comment_poster_createdAt_idx"
  ON "Comment"("posterId", "createdAt");

CREATE INDEX "Comment_poster_type_idx"
  ON "Comment"("posterId", "type");

-- PosterView indexes
CREATE INDEX "PosterView_poster_createdAt_idx"
  ON "PosterView"("posterId", "createdAt");
