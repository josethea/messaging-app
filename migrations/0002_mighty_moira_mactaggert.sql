CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"workspaceId" text NOT NULL,
	"memberOneId" text NOT NULL,
	"memberTwoId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"workspaceId" text NOT NULL,
	"memberId" text NOT NULL,
	"channelId" text,
	"conversationId" text,
	"parentMessageId" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_memberOneId_member_id_fk" FOREIGN KEY ("memberOneId") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_memberTwoId_member_id_fk" FOREIGN KEY ("memberTwoId") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_memberId_member_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversationId_conversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_parentMessageId_message_id_fk" FOREIGN KEY ("parentMessageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;