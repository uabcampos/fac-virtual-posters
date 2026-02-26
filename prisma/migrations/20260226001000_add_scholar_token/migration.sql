-- Add scholarToken column for secure Scholar Mode replies
ALTER TABLE "Poster" ADD COLUMN "scholarToken" TEXT UNIQUE;
